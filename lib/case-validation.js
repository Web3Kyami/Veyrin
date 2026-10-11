const { getPreCase, getPreSources } = require('./data/pre-cases');

function assertPrePack(pack) {
  if (!pack || typeof pack.caseId !== 'string') throw new Error('CASE_PACKET_MISMATCH');
  const config = getPreCase(pack.caseId);
  if (pack.cutoffAt !== config.CUTOFF_AT || pack.ticker !== config.TICKER) throw new Error('CASE_PACKET_MISMATCH');
  if (!Array.isArray(pack.sources) || pack.sources.length < 3) throw new Error('PRE_SOURCE_COUNT');
  const expectedSources = getPreSources(config.CASE_ID);
  const expectedById = new Map(expectedSources.map(source => [source.id, source]));
  if (pack.sources.length !== expectedById.size || new Set(pack.sources.map(source => source.id)).size !== expectedById.size) throw new Error('PRE_SOURCE_SET_MISMATCH');
  for (const source of pack.sources) {
    const expected = expectedById.get(source.id);
    if (!expected || expected.eligibility !== 'VERIFIED_PRE') throw new Error('PRE_SOURCE_NOT_ELIGIBLE');
    if (['publisher', 'title', 'url', 'publishedAt', 'timestampPrecision', 'summary', 'eligibility'].some(key => source[key] !== expected[key]) || JSON.stringify(source.facts) !== JSON.stringify(expected.facts)) {
      throw new Error('PRE_SOURCE_METADATA_CHANGED');
    }
  }
  if (new Set(pack.sources.map(source => source.id)).size !== pack.sources.length) throw new Error('DUPLICATE_SOURCE_ID');
  const quote = pack.bitgetPre;
  const optionalRwaAffirmed = quote && (quote.isRwa === undefined || quote.isRwa === null || ['yes', 'true', '1'].includes(String(quote.isRwa).toLowerCase()));
  if (!quote || quote.category !== 'SPOT' || !optionalRwaAffirmed || String(quote.isReality).toLowerCase() !== 'yes') {
    throw new Error('BITGET_INSTRUMENT_UNVERIFIED');
  }
  const expectedTicker = config.TICKER.toUpperCase();
  const baseTicker = String(quote && quote.baseCoin || '').replace(/^R/i, '').toUpperCase();
  const pairTicker = String(quote && quote.symbol || '').toUpperCase().replace(/USDT$/, '').replace(/^R/, '');
  if (String(quote.symbolType).toLowerCase() !== 'stock' || String(quote.status).toLowerCase() !== 'online' || (baseTicker !== expectedTicker && pairTicker !== expectedTicker) || String(quote.quoteCoin).toUpperCase() !== 'USDT') {
    throw new Error('BITGET_INSTRUMENT_MISMATCH');
  }
  if (!pack.bitgetSource || pack.bitgetSource.id !== 'BITGET_PRE_CANDLE' || pack.bitgetSource.url !== 'https://www.bitget.com/docs/catalog/market/market-data' || !pack.bitgetSource.title.includes(config.TICKER)) throw new Error('BITGET_SOURCE_METADATA_INVALID');
  const preStart = Date.parse(config.PRE_WINDOW.startAt);
  const preEnd = Date.parse(config.PRE_WINDOW.endAt);
  if (quote.startAt !== config.PRE_WINDOW.startAt || quote.endAt !== config.PRE_WINDOW.endAt || quote.interval !== config.PRE_WINDOW.interval || Date.parse(quote.endAt) > Date.parse(config.CUTOFF_AT)) {
    throw new Error('BITGET_PRE_CANDLE_OUTSIDE_WINDOW');
  }
  if (Date.parse(quote.endAt) - Date.parse(quote.startAt) !== 15 * 60 * 1000 || preEnd <= preStart) throw new Error('BITGET_PRE_CANDLE_INVALID_TIME');
  if (![quote.open, quote.high, quote.low, quote.close, quote.baseVolume, quote.quoteTurnover].every(value => Number.isFinite(Number(value))) || Number(quote.close) <= 0 || Number(quote.baseVolume) <= 0 || Number(quote.quoteTurnover) <= 0) {
    throw new Error('BITGET_PRE_CANDLE_INVALID_VALUE');
  }
  return true;
}

function getSourceIds(pack) {
  return new Set([...pack.sources.map(source => source.id), 'BITGET_PRE_CANDLE']);
}

function assertCitations(citations, sourceIds) {
  if (!Array.isArray(citations)) throw new Error('CITATIONS_MISSING');
  for (const citation of citations) {
    if (!citation || typeof citation.sourceId !== 'string' || !sourceIds.has(citation.sourceId)) throw new Error('CITATION_NOT_IN_PRE_PACKET');
    if (citation.relevantQuote !== undefined && (typeof citation.relevantQuote !== 'string' || citation.relevantQuote.length > 280)) throw new Error('CITATION_TEXT_INVALID');
    if (Object.keys(citation).some(key => !['sourceId', 'relevantQuote'].includes(key))) throw new Error('CITATION_EXTRA_FIELD');
  }
}

function assertCitationReferences(value, sourceIds) {
  if (Array.isArray(value)) return value.forEach(item => assertCitationReferences(item, sourceIds));
  if (!value || typeof value !== 'object') return;
  if (Object.prototype.hasOwnProperty.call(value, 'citations')) assertCitations(value.citations, sourceIds);
  for (const child of Object.values(value)) assertCitationReferences(child, sourceIds);
}

function assertVerifiedMarketInstruments(value, verifiedSymbols) {
  const allowed = new Set(verifiedSymbols.filter(symbol => typeof symbol === 'string').map(symbol => symbol.toUpperCase()));
  const symbolPattern = /\b[A-Z0-9]{2,16}USDT\b/gi;
  function visit(item) {
    if (typeof item === 'string') {
      for (const match of item.matchAll(symbolPattern)) {
        if (!allowed.has(match[0].toUpperCase())) {
          throw Object.assign(new Error('A role referenced a market instrument not present in the verified packet.'), {
            code: 'AGENT_MARKET_INSTRUMENT_UNVERIFIED',
            statusCode: 502
          });
        }
      }
      return;
    }
    if (Array.isArray(item)) return item.forEach(visit);
    if (item && typeof item === 'object') Object.values(item).forEach(visit);
  }
  visit(value);
}

function assertShortString(value, max, field) {
  if (typeof value !== 'string' || value.trim().length < 8 || value.length > max) throw new Error(`AGENT_FIELD_INVALID_${field}`);
}

function assertKeys(value, keys, code) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).sort().join('|') !== [...keys].sort().join('|')) throw new Error(code);
}

function assertAtlas(output, sourceIds) {
  assertKeys(output, ['stance', 'thesis', 'thesisCitations', 'claims', 'unknowns', 'falsifiers', 'watchItems'], 'ATLAS_SCHEMA_KEYS_INVALID');
  if (!output || !['BULLISH', 'BEARISH', 'MIXED', 'INSUFFICIENT'].includes(output.stance)) throw new Error('ATLAS_STANCE_INVALID');
  assertShortString(output.thesis, 900, 'THESIS');
  if (!Array.isArray(output.claims) || output.claims.length < 3 || output.claims.length > 5) throw new Error('ATLAS_CLAIMS_INVALID');
  const ids = new Set();
  for (const claim of output.claims) {
    assertKeys(claim, ['id', 'statement', 'citations', 'strength', 'caveat'], 'ATLAS_CLAIM_KEYS_INVALID');
    if (!claim || !/^C[1-5]$/.test(claim.id) || ids.has(claim.id)) throw new Error('ATLAS_CLAIM_ID_INVALID');
    ids.add(claim.id);
    assertShortString(claim.statement, 500, 'CLAIM');
    assertShortString(claim.caveat, 400, 'CAVEAT');
    if (!['HIGH', 'MED', 'LOW'].includes(claim.strength)) throw new Error('ATLAS_STRENGTH_INVALID');
    assertCitations(claim.citations, sourceIds);
    if (claim.citations.length === 0) throw new Error('ATLAS_CLAIM_UNCITED');
  }
  for (const field of ['unknowns', 'falsifiers', 'watchItems']) {
    if (!Array.isArray(output[field]) || output[field].length > 6 || output[field].some(item => typeof item !== 'string' || item.length > 240)) throw new Error(`ATLAS_${field.toUpperCase()}_INVALID`);
  }
  assertCitationReferences(output, sourceIds);
  return ids;
}

function assertVex(output, sourceIds, atlasClaimIds) {
  assertKeys(output, ['challenges', 'concededClaimIds', 'missingEvidence', 'alternateHypotheses'], 'VEX_SCHEMA_KEYS_INVALID');
  if (!output || !Array.isArray(output.challenges) || output.challenges.length > 5) throw new Error('VEX_CHALLENGES_INVALID');
  for (const challenge of output.challenges) {
    assertKeys(challenge, ['targetClaimId', 'critique', 'citations', 'severity'], 'VEX_CHALLENGE_KEYS_INVALID');
    if (!challenge || !atlasClaimIds.has(challenge.targetClaimId)) throw new Error('VEX_TARGET_INVALID');
    assertShortString(challenge.critique, 800, 'CRITIQUE');
    if (!['CRITICAL', 'MATERIAL', 'MINOR'].includes(challenge.severity)) throw new Error('VEX_SEVERITY_INVALID');
    assertCitations(challenge.citations, sourceIds);
    if (challenge.citations.length === 0) throw new Error('VEX_CHALLENGE_UNCITED');
  }
  for (const field of ['concededClaimIds', 'missingEvidence', 'alternateHypotheses']) {
    if (!Array.isArray(output[field]) || output[field].length > 6) throw new Error(`VEX_${field.toUpperCase()}_INVALID`);
  }
  if (output.concededClaimIds.some(id => !atlasClaimIds.has(id))) throw new Error('VEX_CONCESSION_TARGET_INVALID');
  if (output.missingEvidence.some(item => typeof item !== 'string' || item.length > 240) || output.alternateHypotheses.some(item => typeof item !== 'string' || item.length > 300)) throw new Error('VEX_TEXT_INVALID');
  assertCitationReferences(output, sourceIds);
}

function assertSealDraft(output, sourceIds, atlasClaimIds) {
  assertKeys(output, ['dispositions', 'executiveFinding', 'missedRisk', 'forwardChecklist'], 'SEAL_SCHEMA_KEYS_INVALID');
  if (!output || !Array.isArray(output.dispositions) || output.dispositions.length !== atlasClaimIds.size) throw new Error('SEAL_DISPOSITIONS_INVALID');
  const found = new Set();
  const validStatuses = ['SUPPORTED', 'CONTESTED', 'UNRESOLVED', 'EXCLUDED'];
  for (const disposition of output.dispositions) {
    assertKeys(disposition, ['claimId', 'status', 'rationale', 'citations'], 'SEAL_DISPOSITION_KEYS_INVALID');
    if (!disposition || !atlasClaimIds.has(disposition.claimId) || found.has(disposition.claimId) || !validStatuses.includes(disposition.status)) throw new Error('SEAL_DISPOSITION_INVALID');
    found.add(disposition.claimId);
    assertShortString(disposition.rationale, 800, 'RATIONALE');
    assertCitations(disposition.citations, sourceIds);
    if (disposition.citations.length === 0) throw new Error('SEAL_DISPOSITION_UNCITED');
  }
  for (const field of ['executiveFinding', 'missedRisk']) assertShortString(output[field], 900, field.toUpperCase());
  if (!Array.isArray(output.forwardChecklist) || output.forwardChecklist.length > 8 || output.forwardChecklist.some(item => typeof item !== 'string' || item.length > 240)) throw new Error('SEAL_CHECKLIST_INVALID');
  assertCitationReferences(output, sourceIds);
}

module.exports = { assertPrePack, getSourceIds, assertAtlas, assertVex, assertSealDraft, assertCitations, assertVerifiedMarketInstruments };
