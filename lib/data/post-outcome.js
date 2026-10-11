const { getPostMarketObservation } = require('../bitget');

const OUTCOMES = new Map([
  ['nvda-2026-q2-fy27', {
    ticker: 'NVDA',
    window: {
      startAt: '2026-08-26T20:30:00.000Z',
      endAt: '2026-08-26T20:45:00.000Z',
      interval: '15m'
    },
    source: {
      publisher: 'NVIDIA Investor Relations',
      title: 'NVIDIA Announces Financial Results for Second Quarter Fiscal 2027',
      url: 'https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Announces-Financial-Results-for-Second-Quarter-Fiscal-2027/',
      publishedAt: '2026-08-26',
      timestampPrecision: 'date-only'
    }
  }],
  ['tsla-2026-q2', {
    ticker: 'TSLA',
    window: {
      startAt: '2026-07-22T20:30:00.000Z',
      endAt: '2026-07-22T20:45:00.000Z',
      interval: '15m'
    },
    source: {
      publisher: 'Tesla Investor Relations',
      title: 'Tesla Releases Second Quarter 2026 Financial Results',
      url: 'https://ir.tesla.com/press-release/tesla-releases-second-quarter-2026-financial-results',
      publishedAt: '2026-07-22',
      timestampPrecision: 'date-only'
    }
  }]
]);

async function loadPostOutcome(caseId, expectedSymbol) {
  const config = OUTCOMES.get(caseId);
  if (!config) throw Object.assign(new Error('This investigation has no verified outcome window.'), { code: 'CASE_OUTCOME_UNAVAILABLE', statusCode: 404 });
  const bitgetPost = await getPostMarketObservation(config.window, expectedSymbol, config.ticker);
  return { caseId, bitgetPost, outcomeSource: config.source };
}

module.exports = { loadPostOutcome };
