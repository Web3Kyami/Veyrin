const { modelConfiguration } = require('../lib/openrouter');
const { DEFAULT_CASE_ID, listPreCases } = require('../lib/data/pre-cases');
const { sendJson, method } = require('../lib/http');

module.exports = function status(req, res) {
  if (!method(req, res, 'GET')) return;
  const config = modelConfiguration();
  sendJson(res, 200, {
    brand: 'VEYRIN — Research Chamber',
    caseId: DEFAULT_CASE_ID,
    supportedCases: listPreCases().map(({ caseId, company, ticker, event, eventDate, sourceCount }) => ({ caseId, company, ticker, event, eventDate, sourceCount })),
    historicalReconstruction: true,
    modelConfigured: Boolean(config.apiKey && config.model && !config.invalidProvider),
    provider: config.provider || null,
    model: config.model || null,
    secretServerOnly: true
  });
};
