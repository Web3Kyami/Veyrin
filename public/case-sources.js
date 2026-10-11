// Public evidence catalogue. These entries are descriptive only; runtime preflight
// independently checks source metadata, Bitget instrument identity, and cutoff.
window.VEYRIN_CASES = {
  'nvda-2026-q2-fy27': {
    caseId: 'nvda-2026-q2-fy27',
    company: 'NVIDIA',
    ticker: 'NVDA',
    eventTitle: 'Q2 FY2027 earnings',
    eventDate: '26 August 2026',
    cutoffAt: '2026-08-26T19:45:00.000Z',
    marketLabel: 'Bitget Reality SPOT · RNVDAUSDT',
    sources: [
      {
        id: 'NVDA_PRE_IR_Q1', publisher: 'NVIDIA Investor Relations', title: 'NVIDIA Announces Financial Results for First Quarter Fiscal 2027',
        url: 'https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Announces-Financial-Results-for-First-Quarter-Fiscal-2027/default.aspx',
        publishedAt: '2026-05-20', timestampPrecision: 'date-only',
        summary: 'NVIDIA published its fiscal Q1 results and Q2 company outlook on May 20. The release frames company guidance, not analyst consensus.',
        facts: ['The release reports the fiscal quarter ended April 26, 2026.', 'The company gave a Q2 FY2027 revenue outlook of $91.0 billion, plus or minus 2%.'], eligibility: 'CATALOGUED'
      },
      {
        id: 'NVDA_PRE_SEC_10Q', publisher: 'U.S. Securities and Exchange Commission', title: 'NVIDIA Q1 FY2027 Form 10-Q filing index',
        url: 'https://www.sec.gov/Archives/edgar/data/1045810/000104581026000052/0001045810-26-000052-index.htm',
        publishedAt: '2026-05-20T16:35:52', timestampPrecision: 'clock-time-timezone-unspecified',
        summary: 'The SEC filing index records NVIDIA’s fiscal Q1 Form 10-Q acceptance date and displayed time. The index does not specify a timezone.',
        facts: ['SEC displayed acceptance time: May 20, 2026 at 16:35:52; timezone unspecified.', 'The reported period ended April 26, 2026.'], eligibility: 'CATALOGUED'
      },
      {
        id: 'NVDA_PRE_CALENDAR', publisher: 'NVIDIA Investor Relations', title: 'NVIDIA Sets Conference Call for Second-Quarter Financial Results',
        url: 'https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Sets-Conference-Call-for-Second-Quarter-Financial-Results/default.aspx',
        publishedAt: '2026-07-29', timestampPrecision: 'date-only',
        summary: 'NVIDIA announced its Q2 FY2027 results schedule on July 29, including an approximate public-release time and a later investor call.',
        facts: ['NVIDIA scheduled its fiscal Q2 results for August 26, 2026.', 'The company said written results commentary would follow public announcement at approximately 1:20 p.m. Pacific Time; the call was scheduled for 2 p.m. PT.'], eligibility: 'CATALOGUED'
      },
      {
        id: 'NVDA_PRE_SP_GLOBAL', publisher: 'S&P Global Market Intelligence', title: 'Nvidia earnings preview: Q2 2027',
        url: 'https://www.spglobal.com/market-intelligence/en/news-insights/research/2026/08/nvidia-earnings-preview-q2-2027',
        publishedAt: '2026-08-24', timestampPrecision: 'date-only',
        summary: 'A dated secondary preview reports Visible Alpha consensus and frames disagreement about NVIDIA’s data-center and product outlook.',
        facts: ['The preview reports Visible Alpha total-revenue consensus of $92.2 billion for fiscal Q2 2027.', 'The same preview reports a Data Center revenue estimate range of $83.5 billion to $91.5 billion.', 'This is a secondary estimate published on August 24, not company guidance or a guaranteed consensus snapshot.'], eligibility: 'CATALOGUED'
      }
    ]
  },
  'tsla-2026-q2': {
    caseId: 'tsla-2026-q2',
    company: 'Tesla',
    ticker: 'TSLA',
    eventTitle: 'Q2 2026 earnings',
    eventDate: '22 July 2026',
    cutoffAt: '2026-07-22T19:45:00.000Z',
    marketLabel: 'Bitget Reality SPOT · RTSLAUSDT',
    sources: [
      {
        id: 'TSLA_PRE_Q1_UPDATE', publisher: 'Tesla Investor Relations', title: 'Tesla Q1 2026 Update',
        url: 'https://assets-ir.tesla.com/tesla-contents/IR/TSLA-Q1-2026-Update.pdf',
        publishedAt: '2026-04-22', timestampPrecision: 'date-only',
        summary: 'Tesla’s Q1 2026 update reports company results and operating context available before the Q2 earnings event.',
        facts: ['Tesla reported Q1 2026 total revenue of $22.387 billion, up 16% year over year.', 'Tesla reported Q1 2026 production of 408,386 vehicles and deliveries of 358,023 vehicles.'], eligibility: 'CATALOGUED'
      },
      {
        id: 'TSLA_PRE_SEC_10Q', publisher: 'U.S. Securities and Exchange Commission', title: 'Tesla Q1 2026 Form 10-Q filing',
        url: 'https://www.sec.gov/Archives/edgar/data/1318605/000162828026026673/tsla-20260331.htm',
        publishedAt: '2026-04-22T21:43:00', timestampPrecision: 'clock-time-timezone-unspecified',
        summary: 'The SEC filing index records acceptance of Tesla’s Q1 2026 Form 10-Q. Its displayed acceptance time does not specify a timezone.',
        facts: ['SEC accession 0001628280-26-026673 was accepted on April 22, 2026 at 21:43:00 as displayed; timezone unspecified.', 'The filing covers the quarter ended March 31, 2026 and reports total revenue of $22.387 billion.'], eligibility: 'CATALOGUED'
      },
      {
        id: 'TSLA_PRE_DELIVERY_CONSENSUS', publisher: 'Tesla Investor Relations', title: 'Q2 2026 Delivery Consensus',
        url: 'https://ir.tesla.com/press-release/delivery-consensus-second-quarter-2026',
        publishedAt: '2026-06-26', timestampPrecision: 'date-only',
        summary: 'Tesla published a company-compiled sell-side delivery estimate. Tesla explicitly says it does not endorse the estimates or conclusions.',
        facts: ['The Q2 2026 average total-delivery estimate was 406,024 across 22 estimates; the median was 408,609.', 'The page labels Q2 figures as company-compiled estimates, not Tesla guidance or actual deliveries.'], eligibility: 'CATALOGUED'
      },
      {
        id: 'TSLA_PRE_DELIVERIES', publisher: 'Tesla Investor Relations', title: 'Tesla Second Quarter 2026 Production, Deliveries & Deployments',
        url: 'https://ir.tesla.com/press-release/tesla-second-quarter-2026-production-deliveries-and-deployments',
        publishedAt: '2026-07-02', timestampPrecision: 'date-only',
        summary: 'Tesla reported Q2 production and delivery figures and announced that its Q2 financial results would follow after market close on July 22.',
        facts: ['Tesla reported Q2 2026 production of 451,758 vehicles and deliveries of 480,126 vehicles.', 'The release scheduled Q2 financial results after market close on July 22, 2026 and the results webcast for 4:30 p.m. Central Time.', 'Tesla cautioned that deliveries alone should not be treated as an indicator of quarterly financial results.'], eligibility: 'CATALOGUED'
      },
      {
        id: 'TSLA_PRE_EARNINGS_CONSENSUS', publisher: 'Tesla Investor Relations', title: 'Q2 2026 Earnings Consensus',
        url: 'https://ir.tesla.com/press-release/earnings-consensus-second-quarter-2026',
        publishedAt: '2026-07-17', timestampPrecision: 'date-only',
        summary: 'Tesla published a company-compiled sell-side estimate for Q2 earnings. Tesla explicitly says it does not endorse the estimates or conclusions.',
        facts: ['The Q2 2026 average total-revenue estimate was $27.584 billion across 23 inputs; the median was $27.965 billion.', 'The Q2 2026 average GAAP EPS estimate was $0.36 across 23 inputs; the median was $0.34.', 'These are estimates, not company guidance or reported Q2 results.'], eligibility: 'CATALOGUED'
      }
    ]
  }
};

window.VEYRIN_CASE_SOURCES = window.VEYRIN_CASES['nvda-2026-q2-fy27'].sources;
