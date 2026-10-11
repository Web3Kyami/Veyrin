const CASE_ID = 'tsla-2026-q2';
const COMPANY = 'Tesla';
const TICKER = 'TSLA';
const EVENT = 'Second-quarter 2026 earnings';
const EVENT_DATE = '2026-07-22';
const EVENT_AT_APPROX = 'After market close on July 22, 2026; the pre-event schedule did not specify an exact release time.';
const CUTOFF_AT = '2026-07-22T19:45:00.000Z';
const PRE_WINDOW = {
  startAt: '2026-07-22T19:30:00.000Z',
  endAt: '2026-07-22T19:45:00.000Z',
  interval: '15m'
};

const PRE_SOURCES = [
  {
    id: 'TSLA_PRE_Q1_UPDATE',
    publisher: 'Tesla Investor Relations',
    title: 'Tesla Q1 2026 Update',
    url: 'https://assets-ir.tesla.com/tesla-contents/IR/TSLA-Q1-2026-Update.pdf',
    publishedAt: '2026-04-22',
    timestampPrecision: 'date-only',
    summary: 'Tesla’s Q1 2026 update reports company results and operating context available before the Q2 earnings event.',
    facts: [
      'Tesla reported Q1 2026 total revenue of $22.387 billion, up 16% year over year.',
      'Tesla reported Q1 2026 production of 408,386 vehicles and deliveries of 358,023 vehicles.'
    ]
  },
  {
    id: 'TSLA_PRE_SEC_10Q',
    publisher: 'U.S. Securities and Exchange Commission',
    title: 'Tesla Q1 2026 Form 10-Q filing',
    url: 'https://www.sec.gov/Archives/edgar/data/1318605/000162828026026673/tsla-20260331.htm',
    publishedAt: '2026-04-22T21:43:00',
    timestampPrecision: 'clock-time-timezone-unspecified',
    summary: 'The SEC filing index records acceptance of Tesla’s Q1 2026 Form 10-Q. Its displayed acceptance time does not specify a timezone.',
    facts: [
      'SEC accession 0001628280-26-026673 was accepted on April 22, 2026 at 21:43:00 as displayed; timezone unspecified.',
      'The filing covers the quarter ended March 31, 2026 and reports total revenue of $22.387 billion.'
    ]
  },
  {
    id: 'TSLA_PRE_DELIVERY_CONSENSUS',
    publisher: 'Tesla Investor Relations',
    title: 'Q2 2026 Delivery Consensus',
    url: 'https://ir.tesla.com/press-release/delivery-consensus-second-quarter-2026',
    publishedAt: '2026-06-26',
    timestampPrecision: 'date-only',
    summary: 'Tesla published a company-compiled sell-side delivery estimate. Tesla explicitly says it does not endorse the estimates or conclusions.',
    facts: [
      'The Q2 2026 average total-delivery estimate was 406,024 across 22 estimates; the median was 408,609.',
      'The page labels Q2 figures as company-compiled estimates, not Tesla guidance or actual deliveries.'
    ]
  },
  {
    id: 'TSLA_PRE_DELIVERIES',
    publisher: 'Tesla Investor Relations',
    title: 'Tesla Second Quarter 2026 Production, Deliveries & Deployments',
    url: 'https://ir.tesla.com/press-release/tesla-second-quarter-2026-production-deliveries-and-deployments',
    publishedAt: '2026-07-02',
    timestampPrecision: 'date-only',
    summary: 'Tesla reported Q2 production and delivery figures and announced that its Q2 financial results would follow after market close on July 22.',
    facts: [
      'Tesla reported Q2 2026 production of 451,758 vehicles and deliveries of 480,126 vehicles.',
      'The release scheduled Q2 financial results after market close on July 22, 2026 and the results webcast for 4:30 p.m. Central Time.',
      'Tesla cautioned that deliveries alone should not be treated as an indicator of quarterly financial results.'
    ]
  },
  {
    id: 'TSLA_PRE_EARNINGS_CONSENSUS',
    publisher: 'Tesla Investor Relations',
    title: 'Q2 2026 Earnings Consensus',
    url: 'https://ir.tesla.com/press-release/earnings-consensus-second-quarter-2026',
    publishedAt: '2026-07-17',
    timestampPrecision: 'date-only',
    summary: 'Tesla published a company-compiled sell-side estimate for Q2 earnings. Tesla explicitly says it does not endorse the estimates or conclusions.',
    facts: [
      'The Q2 2026 average total-revenue estimate was $27.584 billion across 23 inputs; the median was $27.965 billion.',
      'The Q2 2026 average GAAP EPS estimate was $0.36 across 23 inputs; the median was $0.34.',
      'These are estimates, not company guidance or reported Q2 results.'
    ]
  }
];

module.exports = { CASE_ID, COMPANY, TICKER, EVENT, EVENT_DATE, EVENT_AT_APPROX, CUTOFF_AT, PRE_WINDOW, PRE_SOURCES };
