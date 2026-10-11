const nvda = require('./pre-case');
const tesla = require('./tesla-pre-case');

const PRE_CASES = new Map([
  [nvda.CASE_ID, nvda],
  [tesla.CASE_ID, tesla]
]);

function getPreCase(caseId = nvda.CASE_ID) {
  const config = PRE_CASES.get(caseId);
  if (!config) throw Object.assign(new Error('This investigation is not supported.'), { code: 'CASE_NOT_SUPPORTED', statusCode: 404 });
  return config;
}

function isSupportedCase(caseId) {
  return PRE_CASES.has(caseId);
}

function getPreSources(caseId = nvda.CASE_ID) {
  const config = getPreCase(caseId);
  return config.PRE_SOURCES.map(source => ({
    ...source,
    eligibility: nvda.isSourcePreEligible(source, config.CUTOFF_AT) ? 'VERIFIED_PRE' : 'PRE_UNCERTAIN'
  }));
}

function listPreCases() {
  return [...PRE_CASES.values()].map(config => ({
    caseId: config.CASE_ID,
    company: config.COMPANY,
    ticker: config.TICKER,
    event: config.EVENT,
    eventDate: config.EVENT_DATE,
    cutoffAt: config.CUTOFF_AT,
    sourceCount: config.PRE_SOURCES.length
  }));
}

module.exports = { DEFAULT_CASE_ID: nvda.CASE_ID, PRE_CASES, getPreCase, getPreSources, isSupportedCase, listPreCases };
