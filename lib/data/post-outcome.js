const { getPostMarketObservation } = require('../bitget');

const CASE_ID = 'nvda-2026-q2-fy27';
const OUTCOME_WINDOW = {
  startAt: '2026-08-26T20:30:00.000Z',
  endAt: '2026-08-26T20:45:00.000Z',
  interval: '15m'
};
const OUTCOME_SOURCE = {
  publisher: 'NVIDIA Investor Relations',
  title: 'NVIDIA Announces Financial Results for Second Quarter Fiscal 2027',
  url: 'https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Announces-Financial-Results-for-Second-Quarter-Fiscal-2027/',
  publishedAt: '2026-08-26',
  timestampPrecision: 'date-only'
};

async function loadPostOutcome(expectedSymbol) {
  const bitgetPost = await getPostMarketObservation(OUTCOME_WINDOW, expectedSymbol);
  return { caseId: CASE_ID, bitgetPost, outcomeSource: OUTCOME_SOURCE };
}

module.exports = { CASE_ID, OUTCOME_WINDOW, loadPostOutcome };
