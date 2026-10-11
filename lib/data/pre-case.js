const CASE_ID = 'nvda-2026-q2-fy27';
const COMPANY = 'NVIDIA';
const TICKER = 'NVDA';
const EVENT = 'Fiscal Q2 2027 results';
const EVENT_DATE = '2026-08-26';
const CUTOFF_AT = '2026-08-26T19:45:00.000Z';
const EVENT_AT_APPROX = '2026-08-26T20:20:00.000Z';
const PRE_WINDOW = {
  startAt: '2026-08-26T19:30:00.000Z',
  endAt: '2026-08-26T19:45:00.000Z',
  interval: '15m'
};

const PRE_SOURCES = [
  {
    id: 'NVDA_PRE_IR_Q1',
    publisher: 'NVIDIA Investor Relations',
    title: 'NVIDIA Announces Financial Results for First Quarter Fiscal 2027',
    url: 'https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Announces-Financial-Results-for-First-Quarter-Fiscal-2027/default.aspx',
    publishedAt: '2026-05-20',
    timestampPrecision: 'date-only',
    summary: 'NVIDIA published its fiscal Q1 results and Q2 company outlook on May 20. The release frames company guidance, not analyst consensus.',
    facts: [
      'The release reports the fiscal quarter ended April 26, 2026.',
      'The company gave a Q2 FY2027 revenue outlook of $91.0 billion, plus or minus 2%.'
    ]
  },
  {
    id: 'NVDA_PRE_SEC_10Q',
    publisher: 'U.S. Securities and Exchange Commission',
    title: 'NVIDIA Q1 FY2027 Form 10-Q filing index',
    url: 'https://www.sec.gov/Archives/edgar/data/1045810/000104581026000052/0001045810-26-000052-index.htm',
    publishedAt: '2026-05-20T16:35:52',
    timestampPrecision: 'clock-time-timezone-unspecified',
    summary: 'The SEC filing index records NVIDIA’s fiscal Q1 Form 10-Q acceptance date and displayed time. The index does not specify a timezone.',
    facts: [
      'SEC displayed acceptance time: May 20, 2026 at 16:35:52; timezone unspecified.',
      'The reported period ended April 26, 2026.'
    ]
  },
  {
    id: 'NVDA_PRE_CALENDAR',
    publisher: 'NVIDIA Investor Relations',
    title: 'NVIDIA Sets Conference Call for Second-Quarter Financial Results',
    url: 'https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Sets-Conference-Call-for-Second-Quarter-Financial-Results/default.aspx',
    publishedAt: '2026-07-29',
    timestampPrecision: 'date-only',
    summary: 'NVIDIA announced its Q2 FY2027 results schedule on July 29, including an approximate public-release time and a later investor call.',
    facts: [
      'NVIDIA scheduled its fiscal Q2 results for August 26, 2026.',
      'The company said written results commentary would follow public announcement at approximately 1:20 p.m. Pacific Time; the call was scheduled for 2 p.m. PT.'
    ]
  },
  {
    id: 'NVDA_PRE_SP_GLOBAL',
    publisher: 'S&P Global Market Intelligence',
    title: 'Nvidia earnings preview: Q2 2027',
    url: 'https://www.spglobal.com/market-intelligence/en/news-insights/research/2026/08/nvidia-earnings-preview-q2-2027',
    publishedAt: '2026-08-24',
    timestampPrecision: 'date-only',
    summary: 'A dated secondary preview reports Visible Alpha consensus and frames disagreement about NVIDIA’s data-center and product outlook.',
    facts: [
      'The preview reports Visible Alpha total-revenue consensus of $92.2 billion for fiscal Q2 2027.',
      'The same preview reports a Data Center revenue estimate range of $83.5 billion to $91.5 billion.',
      'This is a secondary estimate published on August 24, not company guidance or a guaranteed consensus snapshot.'
    ]
  }
];

function isSourcePreEligible(source, cutoffAt = CUTOFF_AT) {
  const cutoff = Date.parse(cutoffAt);
  if (!Number.isFinite(cutoff)) return false;
  if (source.timestampPrecision === 'date-only') {
    const endOfDisplayedDate = Date.parse(`${source.publishedAt}T23:59:59.999Z`);
    return Number.isFinite(endOfDisplayedDate) && endOfDisplayedDate <= cutoff;
  }
  if (source.timestampPrecision === 'clock-time-timezone-unspecified') {
    // Treat the displayed time as late as UTC+14. This conservative bound
    // avoids falsely assigning UTC to the SEC's timezone-free timestamp.
    const displayed = Date.parse(`${source.publishedAt}Z`);
    return Number.isFinite(displayed) && displayed + 14 * 60 * 60 * 1000 <= cutoff;
  }
  const instant = Date.parse(source.publishedAt);
  return Number.isFinite(instant) && instant <= cutoff;
}

function getPreSources() {
  return PRE_SOURCES.map(source => ({ ...source, eligibility: isSourcePreEligible(source) ? 'VERIFIED_PRE' : 'PRE_UNCERTAIN' }));
}

module.exports = { CASE_ID, COMPANY, TICKER, EVENT, EVENT_DATE, EVENT_AT_APPROX, CUTOFF_AT, PRE_WINDOW, PRE_SOURCES, getPreSources, isSourcePreEligible };
