const { loadPostOutcome } = require('../lib/data/post-outcome');
const { sha256, verifyToken } = require('../lib/security');
const { verifyReceipt } = require('../lib/receipt');
const { sendJson, method, readJson, softRateLimit, sendFailure } = require('../lib/http');

module.exports = async function reveal(req, res) {
  if (!method(req, res, 'POST') || !softRateLimit(req, res, 'reveal', 6, 60000)) return;
  try {
    const body = await readJson(req);
    const sealToken = body.sealToken;
    if (!verifyToken(sealToken, 'sealed-record') || !verifyReceipt(sealToken)) {
      throw Object.assign(new Error('Reveal is locked until the sealed record and its signature verify.'), { code: 'REVEAL_SEAL_INVALID', statusCode: 403 });
    }
    const { record, digest } = sealToken.payload;
    if (sha256(record) !== digest) throw Object.assign(new Error('The sealed record does not match its digest.'), { code: 'REVEAL_CASE_MISMATCH', statusCode: 400 });
    // The post-outcome module is reached only after signature and digest checks.
    const outcome = await loadPostOutcome(record.caseId, record.preEvidence.bitgetPre.symbol);
    const before = Number(record.preEvidence.bitgetPre.close);
    const after = Number(outcome.bitgetPost.close);
    const changePct = before > 0 && after > 0 && Number(outcome.bitgetPost.quoteTurnover) > 0 ? ((after - before) / before) * 100 : null;
    sendJson(res, 200, {
      caseId: outcome.caseId,
      digest,
      pre: record.preEvidence.bitgetPre,
      post: outcome.bitgetPost,
      observedChangePercent: changePct,
      outcomeSource: outcome.outcomeSource,
      interpretation: 'Observed Bitget Reality stock-token price change between two selected completed 15-minute candles. This is not a causal estimate, executable return, or proof the thesis was correct.'
    });
  } catch (error) { sendFailure(res, error); }
};
