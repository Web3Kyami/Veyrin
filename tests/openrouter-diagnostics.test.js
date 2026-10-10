const test = require('node:test');
const assert = require('node:assert/strict');
const { invokeRole, runModelCompatibilityProbes } = require('../lib/openrouter');

const previousProvider = process.env.VEYRIN_AI_PROVIDER;
process.env.VEYRIN_AI_PROVIDER = 'openrouter';
test.after(() => {
  if (previousProvider === undefined) delete process.env.VEYRIN_AI_PROVIDER;
  else process.env.VEYRIN_AI_PROVIDER = previousProvider;
});

test('ATLAS uses direct JSON Schema output and diagnostics keep prompts and credentials private', async () => {
  const previousKey = process.env.OPENROUTER_API_KEY;
  const previousModel = process.env.OPENROUTER_MODEL;
  const previousFetch = global.fetch;
  const previousWarn = console.warn;
  const apiKey = 'sk-or-v1-unit-test-private-credential';
  const promptMarker = 'do-not-log-this-private-thesis';
  const warnings = [];
  process.env.OPENROUTER_API_KEY = apiKey;
  process.env.OPENROUTER_MODEL = 'qwen/qwen3.8-27b:free';
  console.warn = (...args) => warnings.push(args.join(' '));
  global.fetch = async (_url, options) => {
    const payload = JSON.parse(options.body);
    assert.equal(payload.model, 'qwen/qwen3.8-27b:free');
    assert.equal(Object.hasOwn(payload, 'tools'), false);
    assert.equal(Object.hasOwn(payload, 'tool_choice'), false);
    assert.equal(Object.hasOwn(payload, 'parallel_tool_calls'), false);
    assert.equal(Object.hasOwn(payload, 'provider'), false);
    assert.equal(payload.response_format.type, 'json_schema');
    assert.equal(payload.response_format.json_schema.name, 'atlas_result');
    assert.equal(payload.response_format.json_schema.strict, false);
    const userPayload = JSON.parse(payload.messages[1].content);
    assert.deepEqual(payload.response_format.json_schema.schema, userPayload.outputSchema);
    assert.equal(userPayload.case.sources[0].content, 'verified evidence');
    return new Response(JSON.stringify({
      error: {
        code: 'MODEL_NOT_FOUND',
        message: `credential ${apiKey}; prompt ${payload.messages[1].content}`,
        request_id: 'body-request-ignored'
      }
    }), {
      status: 404,
      headers: { 'content-type': 'application/json', 'x-request-id': 'req_test_404' }
    });
  };

  try {
    await assert.rejects(
      invokeRole('ATLAS', {
        case: { caseId: 'test-case', sources: [{ sourceId: 'S1', content: 'verified evidence' }] },
        userThesis: { text: promptMarker, classification: 'USER_HYPOTHESIS_NOT_EVIDENCE' },
        outputSchema: { type: 'object', properties: {}, required: [] }
      }, { headers: { host: 'localhost' } }),
      error => error.code === 'MODEL_REQUEST_REJECTED' && /404/.test(error.message)
    );
  } finally {
    global.fetch = previousFetch;
    console.warn = previousWarn;
    if (previousKey === undefined) delete process.env.OPENROUTER_API_KEY;
    else process.env.OPENROUTER_API_KEY = previousKey;
    if (previousModel === undefined) delete process.env.OPENROUTER_MODEL;
    else process.env.OPENROUTER_MODEL = previousModel;
  }

  assert.equal(warnings.length, 1);
  const diagnostic = JSON.parse(warnings[0].replace(/^\[veyrin:model-diagnostic\] /, ''));
  assert.equal(diagnostic.role, 'ATLAS');
  assert.equal(diagnostic.modelId, 'qwen/qwen3.8-27b:free');
  assert.equal(diagnostic.httpStatus, 404);
  assert.equal(diagnostic.requestId, 'req_test_404');
  assert.equal(diagnostic.errorCode, 'MODEL_NOT_FOUND');
  assert.equal(diagnostic.errorMessage.includes(apiKey), false);
  assert.equal(diagnostic.errorMessage.includes(promptMarker), false);
});

test('malformed JSON-only output is rejected and never returned as role research', async () => {
  const previousKey = process.env.OPENROUTER_API_KEY;
  const previousModel = process.env.OPENROUTER_MODEL;
  const previousFetch = global.fetch;
  const previousWarn = console.warn;
  const warnings = [];
  let requestCount = 0;
  process.env.OPENROUTER_API_KEY = 'sk-or-v1-unit-test-private-credential';
  process.env.OPENROUTER_MODEL = 'free/test-model';
  console.warn = (...args) => warnings.push(args.join(' '));
  global.fetch = async () => {
    requestCount += 1;
    if (requestCount === 1) return new Response(JSON.stringify({
      error: { code: 'UNSUPPORTED_PARAMETER', message: 'response_format json_schema unsupported' }
    }), { status: 400 });
    return new Response(JSON.stringify({ choices: [{ message: { content: '{"answer":]' } }] }), { status: 200 });
  };

  try {
    await assert.rejects(invokeRole('ATLAS', {
      case: { caseId: 'test-case' },
      userThesis: { text: 'private thesis', classification: 'USER_HYPOTHESIS_NOT_EVIDENCE' },
      outputSchema: { type: 'object', properties: {}, required: [] }
    }, { headers: {} }), error => error.code === 'MODEL_INVALID_JSON');
  } finally {
    global.fetch = previousFetch;
    console.warn = previousWarn;
    if (previousKey === undefined) delete process.env.OPENROUTER_API_KEY;
    else process.env.OPENROUTER_API_KEY = previousKey;
    if (previousModel === undefined) delete process.env.OPENROUTER_MODEL;
    else process.env.OPENROUTER_MODEL = previousModel;
  }
  assert.equal(requestCount, 2);
  assert.equal(warnings.length, 2);
  assert.equal(warnings.some(message => message.includes('private thesis')), false);
});

test('role request retries JSON-only only when the provider rejects JSON Schema support', async () => {
  const previousKey = process.env.OPENROUTER_API_KEY;
  const previousModel = process.env.OPENROUTER_MODEL;
  const previousFetch = global.fetch;
  const previousWarn = console.warn;
  const requests = [];
  const warnings = [];
  process.env.OPENROUTER_API_KEY = 'sk-or-v1-unit-test-private-credential';
  process.env.OPENROUTER_MODEL = 'free/test-model';
  console.warn = (...args) => warnings.push(args.join(' '));
  global.fetch = async (_url, options) => {
    const payload = JSON.parse(options.body);
    requests.push(payload);
    if (requests.length === 1) return new Response(JSON.stringify({
      error: { code: 'UNSUPPORTED_PARAMETER', message: 'response_format json_schema is not supported' }
    }), { status: 400, headers: { 'x-request-id': 'req_schema_not_supported' } });
    return new Response(JSON.stringify({ choices: [{ message: { content: '{"answer":"ready"}' } }] }), {
      status: 200, headers: { 'x-request-id': 'req_json_only' }
    });
  };

  let result;
  try {
    result = await invokeRole('ATLAS', {
      case: { caseId: 'test-case', sources: [{ sourceId: 'S1', text: 'verified evidence' }] },
      userThesis: { text: 'private thesis marker', classification: 'USER_HYPOTHESIS_NOT_EVIDENCE' },
      outputSchema: { type: 'object', properties: { answer: { type: 'string' } }, required: ['answer'], additionalProperties: false }
    }, { headers: { host: 'localhost' } });
  } finally {
    global.fetch = previousFetch;
    console.warn = previousWarn;
    if (previousKey === undefined) delete process.env.OPENROUTER_API_KEY;
    else process.env.OPENROUTER_API_KEY = previousKey;
    if (previousModel === undefined) delete process.env.OPENROUTER_MODEL;
    else process.env.OPENROUTER_MODEL = previousModel;
  }

  assert.equal(requests.length, 2);
  assert.equal(requests[0].response_format.type, 'json_schema');
  assert.equal(requests[1].response_format, undefined);
  for (const payload of requests) {
    assert.equal(payload.tools, undefined);
    assert.equal(payload.tool_choice, undefined);
    assert.equal(payload.provider, undefined);
  }
  assert.deepEqual(result.output, { answer: 'ready' });
  assert.equal(warnings.length, 1);
  assert.equal(warnings[0].includes('private thesis marker'), false);
});

test('compatibility probes separate text-only and JSON Schema requests', async () => {
  const previousKey = process.env.OPENROUTER_API_KEY;
  const previousModel = process.env.OPENROUTER_MODEL;
  const previousFetch = global.fetch;
  const apiKey = 'sk-or-v1-unit-test-private-credential';
  const requests = [];
  process.env.OPENROUTER_API_KEY = apiKey;
  process.env.OPENROUTER_MODEL = 'qwen/qwen3.8-27b:free';
  global.fetch = async (_url, options) => {
    const payload = JSON.parse(options.body);
    requests.push(payload);
    const content = requests.length === 1 ? 'PONG' : '{"ok":true}';
    return new Response(JSON.stringify({
      id: `response-${requests.length}`,
      choices: [{ finish_reason: 'stop', message: { content } }]
    }), { status: 200, headers: { 'content-type': 'application/json', 'x-request-id': `req_${requests.length}` } });
  };

  let result;
  try { result = await runModelCompatibilityProbes({ headers: {} }); }
  finally {
    global.fetch = previousFetch;
    if (previousKey === undefined) delete process.env.OPENROUTER_API_KEY;
    else process.env.OPENROUTER_API_KEY = previousKey;
    if (previousModel === undefined) delete process.env.OPENROUTER_MODEL;
    else process.env.OPENROUTER_MODEL = previousModel;
  }

  assert.equal(requests.length, 2);
  assert.equal(Object.hasOwn(requests[0], 'tools'), false);
  assert.equal(Object.hasOwn(requests[0], 'tool_choice'), false);
  assert.equal(Object.hasOwn(requests[0], 'provider'), false);
  assert.equal(Object.hasOwn(requests[0], 'response_format'), false);
  assert.equal(Object.hasOwn(requests[1], 'tools'), false);
  assert.equal(Object.hasOwn(requests[1], 'tool_choice'), false);
  assert.equal(Object.hasOwn(requests[1], 'provider'), false);
  assert.equal(requests[1].response_format.type, 'json_schema');
  assert.deepEqual(result.probes.map(probe => probe.ok), [true, true]);
  assert.deepEqual(result.probes.map(probe => probe.requestId), ['req_1', 'req_2']);
});

test('compatibility probes fall back to JSON-only generation when JSON Schema is rejected', async () => {
  const previousKey = process.env.OPENROUTER_API_KEY;
  const previousModel = process.env.OPENROUTER_MODEL;
  const previousFetch = global.fetch;
  const previousWarn = console.warn;
  const apiKey = 'sk-or-v1-unit-test-private-credential';
  const requests = [];
  const warnings = [];
  process.env.OPENROUTER_API_KEY = apiKey;
  process.env.OPENROUTER_MODEL = 'qwen/qwen3.8-27b:free';
  console.warn = (...args) => warnings.push(args.join(' '));
  global.fetch = async (_url, options) => {
    const payload = JSON.parse(options.body);
    requests.push(payload);
    if (requests.length === 2) {
      return new Response(JSON.stringify({ error: { code: 'UNSUPPORTED_PARAMETER', message: 'response_format json_schema unsupported' } }), {
        status: 400,
        headers: { 'content-type': 'application/json', 'x-request-id': 'req_schema_rejected' }
      });
    }
    const content = requests.length === 1 ? 'PONG' : '{"ok":true}';
    return new Response(JSON.stringify({ choices: [{ finish_reason: 'stop', message: { content } }] }), {
      status: 200,
      headers: { 'content-type': 'application/json', 'x-request-id': `req_${requests.length}` }
    });
  };

  let result;
  try { result = await runModelCompatibilityProbes({ headers: {} }); }
  finally {
    global.fetch = previousFetch;
    console.warn = previousWarn;
    if (previousKey === undefined) delete process.env.OPENROUTER_API_KEY;
    else process.env.OPENROUTER_API_KEY = previousKey;
    if (previousModel === undefined) delete process.env.OPENROUTER_MODEL;
    else process.env.OPENROUTER_MODEL = previousModel;
  }

  assert.equal(requests.length, 3);
  assert.equal(requests[2].response_format, undefined);
  assert.equal(requests[2].tools, undefined);
  assert.equal(requests[2].tool_choice, undefined);
  assert.deepEqual(result.probes.map(probe => probe.ok), [true, false, true]);
  assert.equal(result.probes[1].errorCode, 'UNSUPPORTED_PARAMETER');
  assert.equal(result.probes[1].requestId, 'req_schema_rejected');
  assert.equal(warnings.length, 1);
  assert.equal(warnings[0].includes(apiKey), false);
});
