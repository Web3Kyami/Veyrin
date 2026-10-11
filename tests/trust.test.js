const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { canonicalize, sha256, signToken, verifyToken } = require('../lib/security');
const { CASE_ID, CUTOFF_AT, PRE_WINDOW, PRE_SOURCES, getPreSources, isSourcePreEligible } = require('../lib/data/pre-case');
const { assertPrePack, getSourceIds, assertAtlas, assertVex, assertSealDraft, assertVerifiedMarketInstruments } = require('../lib/case-validation');
const { verifyReceipt } = require('../lib/receipt');
const { selectNvdaRealityInstrument, selectRealityInstrument } = require('../lib/bitget');
const tesla = require('../lib/data/tesla-pre-case');
const { DEFAULT_CASE_ID, getPreSources: getCaseSources, isSupportedCase, listPreCases } = require('../lib/data/pre-cases');

function pack() {
  return {
    caseId: CASE_ID,
    cutoffAt: CUTOFF_AT,
    ticker: 'NVDA',
    sources: getPreSources(),
    bitgetSource: { id: 'BITGET_PRE_CANDLE', title: 'NVDA Reality stock token · completed pre-cutoff candle', url: 'https://www.bitget.com/docs/catalog/market/market-data' },
    bitgetPre: {
      symbol: 'RNVDAUSDT', category: 'SPOT', isRwa: 'YES', isReality: 'yes', symbolType: 'stock', status: 'online', baseCoin: 'rNVDA', quoteCoin: 'USDT',
      interval: '15m', startAt: PRE_WINDOW.startAt, endAt: PRE_WINDOW.endAt,
      open: 1, high: 1, low: 1, close: 1, baseVolume: 5, quoteTurnover: 5
    }
  };
}

function atlas(sourceId) {
  return {
    stance: 'MIXED',
    thesis: 'The dated evidence leaves the expected result uncertain.',
    thesisCitations: [{ sourceId }],
    claims: [
      { id: 'C1', statement: 'Company guidance and secondary estimates differ.', citations: [{ sourceId }], strength: 'MED', caveat: 'The dated estimate is not a guaranteed consensus.' },
      { id: 'C2', statement: 'A source date is not a timestamp for current consensus.', citations: [{ sourceId }], strength: 'LOW', caveat: 'Preserve the displayed time precision.' },
      { id: 'C3', statement: 'A price observation cannot establish the cause of a move.', citations: [{ sourceId }], strength: 'MED', caveat: 'Market context remains incomplete.' }
    ],
    unknowns: ['The reaction is not established by pre-event sources.'],
    falsifiers: ['A material change to company guidance.'],
    watchItems: ['The next reported quarter.']
  };
}

test('canonical JSON sorts object keys and preserves array order', () => {
  assert.equal(canonicalize({ b: 2, a: { z: 1, y: 0 } }), '{"a":{"y":0,"z":1},"b":2}');
  assert.equal(sha256({ a: 1, b: 2 }), sha256({ b: 2, a: 1 }));
  assert.notEqual(sha256([1, 2]), sha256([2, 1]));
});

test('date-only and timezone-unspecified sources preserve conservative pre-cutoff eligibility', () => {
  assert.equal(PRE_SOURCES.length, 4);
  for (const source of PRE_SOURCES) assert.equal(isSourcePreEligible(source), true, source.id);
  const afterCutoff = { ...PRE_SOURCES[0], publishedAt: '2026-08-27' };
  assert.equal(isSourcePreEligible(afterCutoff), false);
});

test('NVIDIA remains the default supported case with its original four-source packet', () => {
  const nvdaPack = pack();
  assert.equal(DEFAULT_CASE_ID, CASE_ID);
  assert.equal(nvdaPack.ticker, 'NVDA');
  assert.deepEqual(getCaseSources(CASE_ID).map(source => source.id), PRE_SOURCES.map(source => source.id));
  assert.equal(nvdaPack.sources.length, 4);
  assert.equal(nvdaPack.sources.every(source => source.eligibility === 'VERIFIED_PRE'), true);
  assert.equal(assertPrePack(nvdaPack), true);
  assert.equal(listPreCases().some(item => item.caseId === CASE_ID && item.ticker === 'NVDA' && item.sourceCount === 4), true);
});

test('Tesla case has five pre-cutoff sources and an exact supported Reality stock packet', () => {
  const tslaPack = {
    caseId: tesla.CASE_ID,
    cutoffAt: tesla.CUTOFF_AT,
    ticker: tesla.TICKER,
    sources: getCaseSources(tesla.CASE_ID),
    bitgetSource: { id: 'BITGET_PRE_CANDLE', title: 'TSLA Reality stock token · completed pre-cutoff candle', url: 'https://www.bitget.com/docs/catalog/market/market-data' },
    bitgetPre: {
      symbol: 'RTSLAUSDT', category: 'SPOT', isRwa: null, isReality: 'yes', symbolType: 'stock', status: 'online', baseCoin: 'rTSLA', quoteCoin: 'USDT',
      interval: '15m', startAt: tesla.PRE_WINDOW.startAt, endAt: tesla.PRE_WINDOW.endAt,
      open: 374.77, high: 375.21, low: 374.13, close: 374.55, baseVolume: 754423.957363, quoteTurnover: 282692162.5657789
    }
  };
  assert.equal(tslaPack.sources.length, 5);
  assert.equal(tslaPack.sources.every(source => source.eligibility === 'VERIFIED_PRE'), true);
  assert.equal(assertPrePack(tslaPack), true);
  assert.equal(isSupportedCase(CASE_ID), true);
  assert.equal(isSupportedCase(tesla.CASE_ID), true);
  assert.equal(isSupportedCase('unknown-case'), false);
  const changed = structuredClone(tslaPack);
  changed.sources[0].publishedAt = '2026-07-23';
  assert.throws(() => assertPrePack(changed), /PRE_SOURCE_NOT_ELIGIBLE|PRE_SOURCE_METADATA_CHANGED/);
});

test('pre packet rejects any price candle that crosses the evidence cutoff', () => {
  const valid = pack();
  assert.equal(assertPrePack(valid), true);
  const changed = pack();
  changed.bitgetPre.endAt = '2026-08-26T20:00:00.000Z';
  assert.throws(() => assertPrePack(changed), /OUTSIDE_WINDOW|INVALID_TIME/);
});

test('Bitget Reality stock discovery accepts omitted isRwa but rejects a negative flag', () => {
  const instrument = { symbol: 'RNVDAUSDT', baseCoin: 'rNVDA', quoteCoin: 'USDT', category: 'SPOT', symbolType: 'stock', status: 'online', isReality: 'yes' };
  assert.equal(selectNvdaRealityInstrument([instrument]), instrument);
  const teslaInstrument = { symbol: 'RTSLAUSDT', baseCoin: 'rTSLA', quoteCoin: 'USDT', category: 'SPOT', symbolType: 'stock', status: 'online', isReality: 'yes' };
  assert.equal(selectRealityInstrument([teslaInstrument], 'TSLA'), teslaInstrument);
  assert.throws(() => selectNvdaRealityInstrument([{ ...instrument, isRwa: 'no' }]), /BITGET_INSTRUMENT_NOT_FOUND/);
  assert.throws(() => selectNvdaRealityInstrument([instrument, { ...instrument, symbol: 'ANOTHERNVDAUSDT' }]), /BITGET_AMBIGUOUS_INSTRUMENT/);
  const missingFlag = pack();
  missingFlag.bitgetPre.isRwa = null;
  assert.equal(assertPrePack(missingFlag), true);
  assert.doesNotThrow(() => sha256(missingFlag));
});

test('unknown and malformed citations are refused deterministically', () => {
  const ids = getSourceIds(pack());
  assert.throws(() => assertAtlas(atlas('POST_RESULT'), ids), /CITATION_NOT_IN_PRE_PACKET/);
  assert.throws(() => assertAtlas({ ...atlas('NVDA_PRE_IR_Q1'), unusedField: true }, ids), /SCHEMA_KEYS_INVALID/);
});

test('agent outputs cannot introduce an unverified Bitget USDT instrument', () => {
  assert.doesNotThrow(() => assertVerifiedMarketInstruments({ watchItems: ['Review RNVDAUSDT after the cutoff.'] }, ['RNVDAUSDT']));
  assert.throws(
    () => assertVerifiedMarketInstruments({ watchItems: ['Review RNRNAUSDT after the cutoff.'] }, ['RNVDAUSDT']),
    error => error.code === 'AGENT_MARKET_INSTRUMENT_UNVERIFIED' && error.statusCode === 502
  );
});

test('ATLAS, VEX and SEAL outputs are role-shaped and citation-bound', () => {
  const ids = getSourceIds(pack());
  const atlasOutput = atlas('NVDA_PRE_IR_Q1');
  const claimIds = assertAtlas(atlasOutput, ids);
  const vexOutput = { challenges: [{ targetClaimId: 'C1', critique: 'The evidence does not establish how the market will react.', citations: [{ sourceId: 'NVDA_PRE_SP_GLOBAL' }], severity: 'MATERIAL' }], concededClaimIds: [], missingEvidence: [], alternateHypotheses: [] };
  assert.equal(assertVex(vexOutput, ids, claimIds), undefined);
  const sealOutput = { dispositions: ['C1', 'C2', 'C3'].map(claimId => ({ claimId, status: 'UNRESOLVED', rationale: 'The historical price response is outside this evidence packet.', citations: [{ sourceId: 'NVDA_PRE_CALENDAR' }] })), executiveFinding: 'No directional result follows from the eligible evidence.', missedRisk: 'Historical model leakage remains possible.', forwardChecklist: ['Compare only after sealing.'] };
  assert.equal(assertSealDraft(sealOutput, ids, claimIds), undefined);
});

test('role signatures and a canonical seal reject changed bytes', () => {
  const prior = process.env.OPENROUTER_API_KEY;
  process.env.OPENROUTER_API_KEY = 'unit-test-only-not-a-live-credential';
  try {
    const preEvidence = pack();
    const preHash = sha256(preEvidence);
    const atlasToken = signToken('agent-atlas', { preHash, output: atlas('NVDA_PRE_IR_Q1') });
    const vexToken = signToken('agent-vex', { preHash, output: { challenges: [], concededClaimIds: [], missingEvidence: [], alternateHypotheses: [] } });
    const sealAgentToken = signToken('agent-seal', { preHash, output: { dispositions: [], executiveFinding: 'A concise finding.', missedRisk: 'A concise risk.', forwardChecklist: [] } });
    const record = { schemaVersion: 'veyrin-receipt-v1', caseId: CASE_ID, preHash, preEvidence, stages: { atlas: atlasToken, vex: vexToken, seal: sealAgentToken } };
    const sealed = signToken('sealed-record', { record, digest: sha256(record), sealedAt: '2026-10-10T00:00:00.000Z' });
    assert.equal(verifyReceipt(sealed), true);
    const changed = structuredClone(sealed);
    changed.payload.record.preEvidence.sources[0].summary += ' modified';
    assert.equal(verifyReceipt(changed), false);
    assert.equal(verifyToken(atlasToken, 'agent-atlas'), true);
  } finally {
    if (prior === undefined) delete process.env.OPENROUTER_API_KEY;
    else process.env.OPENROUTER_API_KEY = prior;
  }
});

test('server receipt tokens can be signed when only the Google AI Studio key is configured', () => {
  const priorOpenRouterKey = process.env.OPENROUTER_API_KEY;
  const priorGoogleKey = process.env.GEMINI_API_KEY;
  delete process.env.OPENROUTER_API_KEY;
  process.env.GEMINI_API_KEY = 'unit-test-google-only-signing-key';
  try {
    const token = signToken('pre-pack', { preHash: 'test-hash', provider: 'google-ai-studio' });
    assert.equal(verifyToken(token, 'pre-pack'), true);
  } finally {
    if (priorOpenRouterKey === undefined) delete process.env.OPENROUTER_API_KEY;
    else process.env.OPENROUTER_API_KEY = priorOpenRouterKey;
    if (priorGoogleKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = priorGoogleKey;
  }
});

test('post-outcome loader is absent from every pre-reveal API route', () => {
  for (const name of ['readiness', 'preflight', 'atlas', 'vex', 'seal', 'verify']) {
    assert.equal(fs.readFileSync(`api/${name}.js`, 'utf8').includes('post-outcome'), false, name);
  }
  const reveal = fs.readFileSync('api/reveal.js', 'utf8');
  assert.match(reveal, /post-outcome/);
  assert.match(reveal, /verifyReceipt\(sealToken\)/);
});

test('public surface carries VEYRIN branding and a real mobile viewport', () => {
  const html = fs.readFileSync('public/index.html', 'utf8');
  assert.match(html, /<title>VEYRIN — Research Chamber<\/title>/);
  assert.match(html, /name="viewport" content="width=device-width,initial-scale=1"/);
  assert.equal(/CROSSFIRE|Nerom/i.test(html), false);
});
