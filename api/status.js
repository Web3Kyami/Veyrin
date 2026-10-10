const { modelConfiguration } = require('../lib/openrouter');
const { sendJson, method } = require('../lib/http');

module.exports = function status(req, res) {
  if (!method(req, res, 'GET')) return;
  const config = modelConfiguration();
  sendJson(res, 200, {
    brand: 'VEYRIN — Research Chamber',
    caseId: 'nvda-2026-q2-fy27',
    historicalReconstruction: true,
    modelConfigured: Boolean(config.apiKey && config.model && !config.invalidProvider),
    provider: config.provider || null,
    model: config.model || null,
    secretServerOnly: true
  });
};
