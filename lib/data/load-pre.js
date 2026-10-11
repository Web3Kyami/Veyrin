const { DEFAULT_CASE_ID, getPreCase, getPreSources } = require('./pre-cases');
const { getPreMarketObservation } = require('../bitget');
const { assertPrePack } = require('../case-validation');

async function loadPrePack(caseId = DEFAULT_CASE_ID) {
  const config = getPreCase(caseId);
  const bitgetPre = await getPreMarketObservation(config.PRE_WINDOW, config.TICKER);
  const pack = {
    caseId: config.CASE_ID,
    company: config.COMPANY,
    ticker: config.TICKER,
    event: config.EVENT,
    eventDate: config.EVENT_DATE,
    eventAtApprox: config.EVENT_AT_APPROX,
    cutoffAt: config.CUTOFF_AT,
    reconstructionLabel: 'Historical reconstruction · outcome withheld from supplied evidence · not a contemporaneous forecast.',
    sources: getPreSources(config.CASE_ID),
    bitgetSource: {
      id: 'BITGET_PRE_CANDLE',
      publisher: 'Bitget public market API',
      title: `${config.TICKER} Reality stock token · completed pre-cutoff candle`,
      url: 'https://www.bitget.com/docs/catalog/market/market-data',
      publishedAt: bitgetPre.endAt,
      timestampPrecision: 'exact-candle-end',
      summary: 'A completed 15-minute SPOT market candle returned from Bitget. Instrument flags, window boundary, traded volume and quote turnover are checked before inclusion.',
      eligibility: 'VERIFIED_PRE'
    },
    bitgetPre
  };
  assertPrePack(pack);
  return pack;
}

module.exports = { loadPrePack };
