const { modelConfiguration } = require('../lib/openrouter');
const { loadPrePack } = require('../lib/data/load-pre');
const { sendJson, method } = require('../lib/http');

module.exports = async function readiness(req, res) {
  if (!method(req, res, 'GET')) return;
  const config = modelConfiguration();
  try {
    const prePack = await loadPrePack();
    sendJson(res, 200, {
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
