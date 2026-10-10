const test = require('node:test');
const assert = require('node:assert/strict');
const { invokeRole, modelConfiguration } = require('../lib/openrouter');

async function withEnvironment(values, run) {
  const previous = new Map(Object.keys(values).map(key => [key, process.env[key]]));
  for (const [key, value] of Object.entries(values)) {
    if (value === null) delete process.env[key];
    else process.env[key] = value;
  }
  try { return await run(); }
  finally {
    for (const [key, value] of previous) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

function requestContext() {
  return {
    case: { caseId: 'historical-test', sources: [{ sourceId: 'S1', text: 'Verified pre-cutoff evidence.' }] },
    userThesis: { text: 'private-thesis-marker', classification: 'USER_HYPOTHESIS_NOT_EVIDENCE' },
    outputSchema: { type: 'object', properties: { answer: { type: 'string' } }, required: ['answer'], additionalProperties: false }
  };
}

function restoreFetch(next) {
  const previous = global.fetch;
  global.fetch = next;
  return () => { global.fetch = previous; };
}

test('Google AI Studio is the default and receives direct evidence with server-only credentials and JSON Schema', async () => {
  await withEnvironment({
    VEYRIN_AI_PROVIDER: null,
    GEMINI_API_KEY: 'unit-test-google-private-key',
    GEMINI_MODEL: 'gemini-test-model',
    OPENROUTER_API_KEY: 'unit-test-openrouter-private-key',
    OPENROUTER_MODEL: 'openrouter/test-model'
  }, async () => {
    assert.equal(modelConfiguration().provider, 'google-ai-studio');
    const restore = restoreFetch(async (url, options) => {
      assert.equal(url, 'https://generativelanguage.googleapis.com/v1beta/models/gemini-test-model:generateContent');
      assert.equal(options.headers['x-goog-api-key'], 'unit-test-google-private-key');
      assert.equal(options.headers.authorization, undefined);
      assert.equal(url.includes('unit-test-google-private-key'), false);
      const payload = JSON.parse(options.body);
      assert.equal(payload.generationConfig.maxOutputTokens, 1600);
      assert.equal(payload.generationConfig.responseMimeType, 'application/json');
      assert.deepEqual(payload.generationConfig.responseSchema, requestContext().outputSchema);
      assert.equal(Object.hasOwn(payload, 'tools'), false);
      assert.equal(Object.hasOwn(payload, 'tool_choice'), false);
      const userMessage = payload.contents.map(item => item.parts.map(part => part.text).join('')).join('\n');
      const userPayload = JSON.parse(userMessage);
      assert.equal(userPayload.case.sources[0].text, 'Verified pre-cutoff evidence.');
      assert.equal(userPayload.userThesis.text, 'private-thesis-marker');
      return new Response(JSON.stringify({
        candidates: [{ content: { parts: [{ text: '{"answer":"evidence received"}' }] }, finishReason: 'STOP' }]
      }), { status: 200, headers: { 'content-type': 'application/json' } });
    });
    try {
      const result = await invokeRole('ATLAS', requestContext(), { headers: { host: 'localhost' } });
      assert.deepEqual(result.output, { answer: 'evidence received' });
      assert.equal(result.provider, 'google-ai-studio');
      assert.equal(result.model, 'gemini-test-model');
    } finally { restore(); }
  });
});

test('Google AI Studio retries JSON-only only for an explicit schema capability error', async () => {
  await withEnvironment({ VEYRIN_AI_PROVIDER: 'google-ai-studio', GEMINI_API_KEY: 'unit-test-google-private-key', GEMINI_MODEL: 'gemini-test-model' }, async () => {
    const previousWarn = console.warn;
    const warnings = [];
    const requests = [];
    const restore = restoreFetch(async (_url, options) => {
      const payload = JSON.parse(options.body);
      requests.push(payload);
      if (requests.length === 1) return new Response(JSON.stringify({
        error: { code: 400, status: 'INVALID_ARGUMENT', message: 'responseSchema is not supported for this model.' }
      }), { status: 400, headers: { 'x-goog-request-id': 'req_schema_unknown' } });
      return new Response(JSON.stringify({
        candidates: [{ content: { parts: [{ text: '{"answer":"json-only retry"}' }] }, finishReason: 'STOP' }]
      }), { status: 200 });
    });
    console.warn = (...args) => warnings.push(args.join(' '));
    try {
      const result = await invokeRole('ATLAS', requestContext(), { headers: {} });
      assert.deepEqual(result.output, { answer: 'json-only retry' });
    } finally {
      restore();
      console.warn = previousWarn;
    }
    assert.equal(requests.length, 2);
    assert.ok(requests[0].generationConfig.responseSchema);
    assert.equal(requests[0].generationConfig.responseMimeType, 'application/json');
    assert.equal(requests[1].generationConfig.responseSchema, undefined);
    assert.equal(requests[1].generationConfig.responseMimeType, undefined);
    assert.equal(warnings.length, 1);
    assert.ok(warnings[0].includes('req_schema_unknown'));
  });
});

test('Google provider errors include sanitized diagnostics and never fall back on HTTP 404', async () => {
  await withEnvironment({ VEYRIN_AI_PROVIDER: 'google-ai-studio', GEMINI_API_KEY: 'unit-test-google-private-key', GEMINI_MODEL: 'gemini-test-model' }, async () => {
    const previousWarn = console.warn;
    const warnings = [];
    let requestCount = 0;
    const restore = restoreFetch(async (_url, options) => {
      requestCount += 1;
      const payload = JSON.parse(options.body);
      const userText = payload.contents[0].parts[0].text;
      return new Response(JSON.stringify({ error: {
        code: 404,
        status: 'NOT_FOUND',
        message: `key unit-test-google-private-key; prompt ${userText}`
      } }), { status: 404, headers: { 'x-goog-request-id': 'req_google_404' } });
    });
    console.warn = (...args) => warnings.push(args.join(' '));
    try {
      await assert.rejects(invokeRole('ATLAS', requestContext(), { headers: {} }), error => error.code === 'MODEL_REQUEST_REJECTED');
    } finally {
      restore();
      console.warn = previousWarn;
    }
    assert.equal(requestCount, 1);
    assert.equal(warnings.length, 1);
    const diagnostic = JSON.parse(warnings[0].replace(/^\[veyrin:model-diagnostic\] /, ''));
    assert.equal(diagnostic.provider, 'google-ai-studio');
    assert.equal(diagnostic.httpStatus, 404);
    assert.equal(diagnostic.requestId, 'req_google_404');
    assert.equal(diagnostic.errorCode, 'NOT_FOUND');
    assert.equal(diagnostic.errorMessage.includes('unit-test-google-private-key'), false);
    assert.equal(diagnostic.errorMessage.includes('private-thesis-marker'), false);
  });
});

test('Google AI Studio malformed JSON is rejected without returning a role result', async () => {
  await withEnvironment({ VEYRIN_AI_PROVIDER: 'google-ai-studio', GEMINI_API_KEY: 'unit-test-google-private-key', GEMINI_MODEL: 'gemini-test-model' }, async () => {
    const previousWarn = console.warn;
    const warnings = [];
    const restore = restoreFetch(async () => new Response(JSON.stringify({
      candidates: [{ content: { parts: [{ text: '{"answer":]' }] }, finishReason: 'STOP' }]
    }), { status: 200 }));
    console.warn = (...args) => warnings.push(args.join(' '));
    try {
      await assert.rejects(invokeRole('ATLAS', requestContext(), { headers: {} }), error => error.code === 'MODEL_INVALID_JSON');
    } finally {
      restore();
      console.warn = previousWarn;
    }
    assert.equal(warnings.length, 1);
    assert.equal(warnings[0].includes('unit-test-google-private-key'), false);
    assert.equal(warnings[0].includes('private-thesis-marker'), false);
  });
});

test('OpenRouter remains available only when explicitly selected', async () => {
  await withEnvironment({
    VEYRIN_AI_PROVIDER: 'openrouter',
    OPENROUTER_API_KEY: 'unit-test-openrouter-key',
    OPENROUTER_MODEL: 'provider/test-model',
    GEMINI_API_KEY: 'unit-test-google-key',
    GEMINI_MODEL: 'gemini-test-model'
  }, async () => {
    const config = modelConfiguration();
    assert.equal(config.provider, 'openrouter');
    assert.equal(config.model, 'provider/test-model');
  });
});

test('role execution refuses a provider or model changed since signed preflight', async () => {
  await withEnvironment({ VEYRIN_AI_PROVIDER: 'google-ai-studio', GEMINI_API_KEY: 'unit-test-google-private-key', GEMINI_MODEL: 'gemini-test-model' }, async () => {
    let requestCount = 0;
    const restore = restoreFetch(async () => {
      requestCount += 1;
      return new Response('{}', { status: 200 });
    });
    try {
      await assert.rejects(
        invokeRole('ATLAS', requestContext(), { headers: {} }, { provider: 'openrouter', model: 'other-model' }),
        error => error.code === 'MODEL_CONFIG_CHANGED'
      );
    } finally { restore(); }
    assert.equal(requestCount, 0);
  });
});
