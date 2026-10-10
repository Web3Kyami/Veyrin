# 02 — Data sourcing, timestamp integrity, Bitget integration and historical replay

## Critical honesty standard
It is impossible to completely erase an LLM's prior training knowledge of historical outcomes. **Cutoff-limited documents are an evidence constraint, not a guarantee of model ignorance.** Public website UI and README should prominently call completed past cases "Historical reconstruction". A true contemporaneous forward assessment exists only if timestamped and committed **before** its real-world outcome is public.

## Two independent data compartments
**PRE pack** (visible to ATLAS, VEX, SEAL): verified material `published_at <= cutoff_at` and, when available, `first_available_at <= cutoff_at`. Include company historical guidance, prior earnings, pre-event market prices, public macro context, genuine dated pre-event analyst commentary, known schedule, publicly visible past rToken quote history. Missing publisher timestamps => exclude or flag as not eligible for pre-pack.
**POST pack** (never supplied to any pre-reveal LLM prompt): event earnings result/release text, actual next-session or defined-window price observations, Bitget post-event trading data, observed news responses, post-cutoff source references. Available to reveal route only after seal verification.

### Important subtlety
An earnings date published before cutoff can be included; earnings numbers released after cutoff cannot. Stock candles spanning before AND after a cutoff must be sliced correctly: no candle high/low/close from incomplete future portion. If timestamp granularity is daily and cutoff occurs mid-session, that day's full OHLC is *not* pre-cutoff. All clocks use ISO-8601 UTC, with America/New_York used only to label NYSE sessions. Handle daylight savings; never manually subtract fixed ET offset.

## Case-data strategy
**Mandatory (P0):** one deliberately curated historical event with independently traceable pre evidence and post prices. Candidate identified from official NVIDIA investor relations: Q2 FY2027 results released Aug 26, 2026, with conference call set for 5 PM Eastern. A valid pre-cutoff could be Aug 26 before company results were made public; verify official release timing and stock/Bitget quotes in available windows. DO NOT insert August 26 earnings results into pre pack. If this candidate cannot satisfy available genuine Bitget tokenized-equity data, swap event/company before proceeding.
**Optional (P1):** a second differentiated case with different result direction, only if complete.

### Candidate official sources
- Pre: NVIDIA July 29, 2026 earnings-call announcement: https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Sets-Conference-Call-for-Second-Quarter-Financial-Results/default.aspx
- Post: NVIDIA Aug 26, 2026 results: https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Announces-Financial-Results-for-Second-Quarter-Fiscal-2027/
- Post SEC Form 8-K: https://www.sec.gov/Archives/edgar/data/1045810/000104581026000073/nvda-20260826.htm
- Do not assume these 3 alone constitute adequate PRE evidence. Need at least 3 independently documented pre-cutoff eligible items.

## Bitget sources and adapter choice
1. `bitget-mcp-server` described in Bitget S2 handbook: HTTP MCP endpoint `https://agent.bitget.com/mcp`, read-only US stock & ETF fundamentals, price history, earnings calendar, analyst estimates, related news. Requires discovery of actual tool schemas; do not invent tool names or assume it preserves *historical as-of* analyst consensus. On Vercel, use `@modelcontextprotocol/sdk` with HTTP transport server-side or an inspected officially supported HTTP adapter.
2. Bitget public market API / Agent Hub SDK: no-account public price/candles and symbol info. Inspect / verify actual spot rToken vs futures vs other tokenized instruments. Quote freshness, tradeability and instrument metadata matter. Do not blindly treat underlier and token prices as identical.
3. `bitget-signal` optional: macro/news/sentiment data where relevant. It must support the chosen case, not be added to inflate integration count.
4. U.S. company primary records: investor relations and SEC EDGAR. SEC requests require an identifying User-Agent and respectful rate limiting; avoid heavy scraping during live judge demo. Better pre-ingest and cache verified official extracts ahead of time.
5. Market history vendor: Bitget equity MCP if it exposes relevant candles with timestamps; otherwise a secondary reputable quote source may provide the underlying-equity reaction, clearly attributed, while **Bitget contributes its own real market observation**. Historical price licenses matter: link to sources, do not scrape and republish a prohibited feed.

## Minimum Bitget integration (a hard product requirement)
For the chosen historical case, render at least ONE grounded Bitget observation that is integral to the market-reaction comparison: e.g. pre/post rToken indicative market quotes or verified hourly market candle in closed-underlier hours, with exact instrument designation, observed timestamp, stale status and provenance. Underlier NYSE reaction must be displayed separately. If an rToken quote is stale or unavailable, label unavailable instead of using a crypto ticker as a fake equivalent. Switch case if cannot meet this bar.

## Ingestion pipeline
1. A curated manifest declares company/ticker, event type, cutoff_at, event_at, timezone, underlier symbol, candidate Bitget symbol/type, observation windows, allowed source URLs.
2. Server-only fetchers retrieve source pages/quotes (with gentle retry/backoff). Save a thin extracted **fact + source + published_at + first_available_at + observed_at + content hash** record. Avoid passing raw unbounded web pages to the LLM.
3. Validate dates, attribution, content hashes, source domain allowlist, no forward leakage, ticker/type alignment, data currency, no duplicate source IDs.
4. Produce `PreEvidencePack`. Distinct loader produces `PostOutcomePack` but cannot be imported by `lib/agents/**`, `app/api/research/**` or pre-reveal client components.
5. Pass only the pre pack to ATLAS. Pass same pack + ATLAS output to VEX. Pass same pack + ATLAS/VEX to SEAL. Do not let an agent request open-web tool access in P0.
6. Before reveal, server signs/canonicalizes pre-pack snapshot, all role outputs, cutoff + model ID, hashes; save durable seal.
7. Server requires valid sealed state to return post pack to reveal route. Reveal contains observed changes, independently sourced. Post-reveal interpretation may run as an optional *separate, explicitly post-hoc* reasoning step, never changing the sealed record.

## Source eligibility statuses
`VERIFIED_PRE` (source timestamp and content proven pre cutoff) · `PRE_UNCERTAIN` (excluded from main analysis) · `VERIFIED_POST` · `UNAVAILABLE` · `MISMATCHED_INSTRUMENT` · `STALE_MARKET_QUOTE`. The UI exposes these states and counts.

## Price calculation
Define baseline/observation windows **before** seeing chosen price outcome; store the policy in case manifest. For an underlying: a valid last completed regular-hours close preceding cutoff, and first following regular-hours close or explicitly an observed after-hours quote. For Bitget: a verified quote/candle at specified UTC windows with liquidity and staleness caveats. Show `(end - start)/start * 100` ONLY when currency denomination, corporate actions, asset units and observation quality make the comparison meaningful. Else show "comparison unavailable". No implied executable return from stale mids or illiquid marks.

## Research object vs prediction
`pre_thesis` is not a guaranteed directional forecast. It can say BULLISH / BEARISH / MIXED / INSUFFICIENT. The reveal grades **evidence support, expectation mismatch and what remains unknown**; it does not assert that a single price move proves the pre-thesis true/false in a causal sense.

## Dataset manifest example (placeholder, deliberately no numerical facts)
```json
{
  "id": "nvda-2026-q2-fy27",
  "company": "NVIDIA",
  "underlier": "NVDA",
  "eventType": "EARNINGS",
  "cutoffAt": "TO_BE_VERIFIED_ISO_UTC",
  "eventAt": "TO_BE_VERIFIED_ISO_UTC",
  "bitgetInstrument": { "symbol": "DISCOVER", "type": "DISCOVER", "verified": false },
  "preSources": [],
  "postSources": [],
  "status": "UNVERIFIED"
}
```
Do not check placeholder data into production or make event card READY until verified.

## Immutable demo provenance
Commit case manifest, extracted pre/post evidence metadata (not necessarily copyrighted full text), source URLs, retrieval timestamps, hashes, and an explanation of what was cached and why. Add `data/cases/<case>/EVIDENCE.md` at build time. If data was from a static snapshot, label snapshot and timestamp; don't call it live.

## Engineering tests
- Source published 1 second after cutoff => rejected from pre pack.
- Source with no proven publication date => excluded as historical pre evidence.
- NYSE time-zone daylight-saving transitions preserve correct cutoff instant.
- Subday candle with future OHLC data => rejected.
- Wrong Bitget instrument => not compared to underlier.
- Quote older than max staleness window => visually stale, not live.
- Price zero/negative/missing => no percentage calculation.
- Replay query cannot retrieve or import post pack before SEAL.
- Agent citations to unknown source ids are removed/flagged; high-impact unsupported claims block seal or are explicitly labelled uncertain.
