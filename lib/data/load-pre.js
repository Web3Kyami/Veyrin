const { CASE_ID, CUTOFF_AT, PRE_WINDOW, getPreSources } = require('./pre-case');
const { getPreMarketObservation } = require('../bitget');
const { assertPrePack } = require('../case-validation');

async function loadPrePack() {
  const bitgetPre = await getPreMarketObservation(PRE_WINDOW);
  const pack = {
    caseId: CASE_ID,
    company: 'NVIDIA',
    ticker: 'NVDA',
    event: 'Fiscal Q2 2027 results',
    eventAtApprox: '2026-08-26T20:20:00Z',
    cutoffAt: CUTOFF_AT,
    reconstructionLabel: 'Historical reconstruction · outcome withheld from supplied evidence · not a contemporaneous forecast.',
    sources: getPreSources(),
    bitgetSource: {
      id: 'BITGET_PRE_CANDLE',
      publisher: 'Bitget public market API',
      title: 'NVDA Reality stock token · completed pre-cutoff candle',
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
