const { modelConfiguration } = require('../lib/openrouter');
const { loadPrePack } = require('../lib/data/load-pre');
const { DEFAULT_CASE_ID } = require('../lib/data/pre-cases');
const { sendJson, method } = require('../lib/http');

function requestedCaseId(req) {
  if (req.query && typeof req.query.caseId === 'string') return req.query.caseId;
  try { return new URL(req.url || '/', 'http://veyrin.local').searchParams.get('caseId') || DEFAULT_CASE_ID; }
  catch { return DEFAULT_CASE_ID; }
}

module.exports = async function readiness(req, res) {
  if (!method(req, res, 'GET')) return;
  const config = modelConfiguration();
  try {
    const prePack = await loadPrePack(requestedCaseId(req));
    sendJson(res, 200, {
      case: { caseId: prePack.caseId, company: prePack.company, ticker: prePack.ticker, event: prePack.event, eventDate: prePack.eventDate, cutoffAt: prePack.cutoffAt },
      model: { configured: Boolean(config.apiKey && config.model && !config.invalidProvider), provider: config.provider || null, modelId: config.model || null, requiredVariables: config.requiredVariables },
      bitget: {
        ready: true,
        symbol: prePack.bitgetPre.symbol,
        instrumentType: `${prePack.bitgetPre.category} Reality stock token`,
        timestamp: prePack.bitgetPre.endAt,
        cutoffAt: prePack.cutoffAt,
        close: prePack.bitgetPre.close,
        quoteCurrency: prePack.bitgetPre.quoteCoin,
        window: prePack.bitgetPre.interval,
        volume: prePack.bitgetPre.baseVolume,
        turnover: prePack.bitgetPre.quoteTurnover
      },
      sources: prePack.sources
    });
  } catch (error) {
    sendJson(res, 200, {
      model: { configured: Boolean(config.apiKey && config.model && !config.invalidProvider), provider: config.provider || null, modelId: config.model || null, requiredVariables: config.requiredVariables },
      bitget: { ready: false, error: error.code || error.message || 'BITGET_UNAVAILABLE' }
    });
  }
};
