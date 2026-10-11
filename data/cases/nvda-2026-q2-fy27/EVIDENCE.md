# NVIDIA Q2 FY2027 historical reconstruction: provenance

**Status: implemented and previously verified in a Preview end-to-end run.** This remains a historical reconstruction, not a contemporaneous forecast. The model may have learned the historical outcome despite receiving only a cutoff-limited evidence packet. No Bitget price values are stored in this pre-event document.

## Locked time policy

- Research cutoff: `2026-08-26T19:45:00Z` (12:45 p.m. America/Los_Angeles).
- NVIDIA's July 29 schedule says results would be announced at approximately 1:20 p.m. Pacific time, about 35 minutes after the cutoff. The release time is approximate, so the cutoff is presented as a selected evidence boundary, not a claim about an exact publication second.
- Pre-event Bitget market window: completed 15-minute candle opened at `2026-08-26T19:30:00Z`; its close is eligible only after its scheduled end at 19:45 UTC and only if Bitget returns the exact interval.
- Post-event Bitget market window: completed 15-minute candle opened at `2026-08-26T20:30:00Z`, ending at 20:45 UTC. Compare the two closes as a bounded observed change, not a causal estimate or executable return.
- Public Bitget SPOT discovery returned `RNVDAUSDT` (`rNVDA` / `USDT`) as `symbolType=stock`, `status=online`, and `isReality=yes`. The current response omitted `isRwa`; the implementation accepts an omitted flag, rejects an explicit negative flag, and never claims that Bitget reported `isRwa=yes` for this instrument.

## Pre-event source catalogue

These sources are from before the cutoff. Their own displayed precision is preserved; date-only pages are not assigned a fabricated clock time.

| ID | Source | Published/accepted as displayed | Precision | Use and limits |
|---|---|---|---|---|
| `NVDA_PRE_IR_Q1` | [NVIDIA Q1 FY2027 results](https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Announces-Financial-Results-for-First-Quarter-Fiscal-2027/default.aspx) | May 20, 2026 | Date only | Prior company-reported quarter and company guidance for Q2. Primary company source. |
| `NVDA_PRE_SEC_10Q` | [SEC Q1 FY2027 Form 10-Q filing index](https://www.sec.gov/Archives/edgar/data/1045810/000104581026000052/0001045810-26-000052-index.htm) | Accepted May 20, 2026 at 16:35:52, timezone not specified by the index | Clock time, timezone unspecified | Regulatory filing record. Do not label its acceptance time UTC. |
| `NVDA_PRE_CALENDAR` | [NVIDIA Q2 FY2027 results schedule](https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Sets-Conference-Call-for-Second-Quarter-Financial-Results/default.aspx) | July 29, 2026 | Date only | Official schedule, approximately 1:20 p.m. PT release and 2 p.m. PT call. |
| `NVDA_PRE_SP_GLOBAL` | [S&P Global Q2 earnings preview](https://www.spglobal.com/market-intelligence/en/news-insights/research/2026/08/nvidia-earnings-preview-q2-2027) | August 24, 2026 | Date only | Secondary analysis and Visible Alpha consensus; not company guidance. Preserve that it is a dated estimate, not ground truth. |

The displayed source dates precede the cutoff by at least two days. Retrieval occurred after the event and therefore proves the current source contents, not contemporaneous access by a historical analyst. The application validates source eligibility and allowed citations in code. Runtime readiness also depends on the configured model and Bitget data endpoint.

## Outcome compartment

The official NVIDIA Q2 release is linked only from the reveal compartment: [NVIDIA Q2 FY2027 results](https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Announces-Financial-Results-for-Second-Quarter-Fiscal-2027/). Bitget post-event candles are fetched by the reveal route only after verifying a server-signed seal. The pre-event APIs and prompts must not import or receive this compartment.

## Discovery limitation

During public-source discovery the builder saw the already-published historical outcome. This case cannot honestly be described as a blind forecast or as outcome knowledge erased from the builder/model. No Q2 outcome value was copied into the pre-event packet. The product must retain the prominent historical-reconstruction limitation.

## Bitget references

- [Bitget market API documentation](https://www.bitget.com/docs/catalog/market/market-data) documents the instrument, ticker and historical-candle endpoints, including the `isRwa` and `isReality` fields and rToken candle interval limits. Field presence is checked against the actual response; documentation alone does not establish that a field was returned.
- [Bitget stock spot product description](https://www.bitget.com/support/articles/12560603887209) describes Reality-issued U.S. stock tokens and identifies NVDA among the supported underlying assets.
- These pages establish product/API documentation only. A deployed API response, instrument identity, quote timestamps and price values are still required for G2.
