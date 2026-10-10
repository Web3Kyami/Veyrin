# 06 — Route-by-route behaviour, components and UI states

## Global shell
Header: VEYRIN wordmark, CHAMBER, PROOF, small `MARKET RESEARCH // NO EXECUTION` label. On narrow widths collapse into responsive menu with keyboard navigation. Footer: source attributions, privacy/limitations, Build for Bitget AI Base Camp S2 and optional GitHub. No app authentication or mandatory wallet.

## `/` LANDING
**Sections**
1. Hero (headline and one-line explanation; primary Start; small status caption based on actual selected case).
2. Chamber hero teaser: three portraits surrounding a masked market-event placeholder *labelled preview*, and prominent cutoff timestamp.
3. Illustrated explanation: "Evidence was public → analysis locked → future movement shown". Three meaningful distinct steps, no mechanical blockchain jargon.
4. Meet investigators: ATLAS / VEX / SEAL and what each actually can change.
5. Featured READY case (company, released event title, cutoff policy, source count; no post-reveal price spoilers).
6. Proof strip: real Bitget source, dated evidence, hash receipt; only display verified tests/figures.
7. What VEYRIN cannot prove; short honest retrospective-model knowledge note.
8. CTA.
**States:** featured case READY; source LIMITED with explanation; no ready case => "Research sample being verified" + link to proof page, no Start with broken journey. Loading must be skeleton or real state.

## `/chamber` CASE PREP
**Sections:** event picker (P0 = one featured card), selected case facts, clock/timezone badge, count of verified pre-evidence sources, Bitget instrument badge, optional personal thesis input max 280 chars (paste safe), toggle "How historical replay works"; CTA `Begin Investigation`.
**Behavior:** enter thesis, validate, create run via API, navigate to case running route with runId query or store runId server-side session. Refresh must recover stage state if persisted. No outcome price visible.
**States:** ready, loading, missing/pre-invalid evidence, rate-limited LLM, Bitget unavailable; user sees exact reason and next step.

## `/chamber/[caseId]` RESEARCH CHAMBER
**Top:** breadcrumbs, company + event, as-of cutoff, source eligibility summary, run state.
**Center:** 3 agent seats with original portraits, stage core and active evidence highlight. Stage request must correspond to actual API state.
**Right:** Evidence rail; order sorted by relevance/time, source ID, publisher, UTC publication date, link; tap expands selected relevant quote and claim mapping.
**Bottom:** plain-language transcript of validated ATLAS/VEX/SEAL output, claim IDs; each challenge links to a specific ATLAS claim.
**Seal state:** SHA-256 receipt, independent validation result, audit summary, unsupported source counts, `Reveal Market Reaction` call-to-action.
**Loading:** per-role status text `Request in progress`, spinner and actual source count. Never a made-up 10%/40% 'deep thought' progression. If partial response streaming, show actual chunks as drafts labelled UNVERIFIED until parsing finishes.
**Error:** `ATLAS_FAILED` / `VEX_FAILED` / `SEAL_FAILED`, role-specific retry and "See available evidence". Stale case pre-verified packets remain visible.
**No partial seal:** if evidence missing/unverified, block reveal and show source issue with clear recovery.
**Keyboard:** top-to-bottom meaningful DOM reading order, active-agent updates announced in ARIA live region; canvas purely decoration.

## `/chamber/[caseId]/reveal` OUTCOME
**Precondition:** run state sealed; server must not return result otherwise. If user opens route directly: 403/redirect to current chamber with explainable message, not unfiltered outcome.
**Sections**
1. Header `REVEAL // MARKET REACTION`, underlying symbol, event date, reveal observation window.
2. Main chart: real measured post event price series or clearly marked two-point interval; date-axis; observed_at and dataset timestamp.
3. Bitget panel: exact tokenized instrument symbol and type; market session and quote quality; if unavailable, show limitation and do not invent. Secondary panel NYSE underlying. Never overlay different currencies unnormalized.
4. Verdict split: sealed conclusion before reveal vs actual observed movement; outcomes that conflict/surprise; why a correct price guess doesn't validate reasoning.
5. Evidence dispute table: supported/contested/unresolved claims; cited source links and VEX critique.
6. Trader's research takeaway: what to collect before next comparable event and the distinction between observed and inferred causality.
7. Receipt & share: copy hash / source list / downloadable JSON; shareable link only if persisted; replay badge explicit.
**States:** outcome loaded; quote stale; insufficient price points; corporate action ambiguity; failed post-data fetch; user refresh; source disappeared. Honest partial results permitted with prominent limitations, not fake complete.

## `/proof` JUDGE MODE
**Sections**
- One-sentence what judges should test, no login.
- `HOW TO VERIFY` numbered steps with links to actual case/source/receipt.
- Real vs illustrative matrix; evidence windows and integrity semantics.
- Bitget tool actual integration and data fetch evidence (tool name, source system, data type, cache status, observedAt).
- Replay vs forward distinction in conspicuous type.
- Known limitations / no trading execution / no financial promises.
- Test metrics from executed tests only, not arbitrary numbers.
- Main submission repo and demo video URLs if available; no broken placeholders on final build.

## Optional `/cases` (P1)
Filter only completed READY cases, sorted by event date; no fake pagination or inaccessible event cards. `NOT READY` not shown as runnable. More than one only if complete data integrity.

## Component state acceptance matrix
| Component | Idle | Working | Complete | Failure |
|---|---|---|---|---|
| Agent seat | Dim + role | Only active illuminated | Source-linked summary | Error icon + retry |
| Evidence rail | Pre-pack source list | Highlight related IDs | Highlight cited IDs | Cached pre-evidence + fetch warning |
| Transcript | None | Actual draft ONLY if streaming | Verified JSON summaries | Raw error-safe message, not invented response |
| Seal | Unavailable | Verifier running | Real digest, copyable | Seal blocked with reason |
| Reveal | Disabled until seal | Data fetch | Observed price + comparison | Stale/missing tagged, do not fabricate |
| Bitget quote | No quote yet | Requesting | Symbol/type/timestamp/value | Unavailable with explicit reason |

## UX copy exact snippets
- Replay badge: `HISTORICAL RECONSTRUCTION — This analysis uses dated sources, but the model may already know the event outcome from training.`
- Source badge: `Published before cutoff · verified <time>` or `Date unverified · excluded`.
- Seal: `SHA-256 confirms this stored dossier has not changed since sealing. It does not prove a historical pre-event forecast.`
- Outcome caption: `Observed market movement is not proof of a single cause or a profitable trade.`
- API failure: `The [role] research pass did not finish. No verdict was generated. Retry this step.`
- Clear CTA: `Reveal what the market actually did`.

## Mobile-specific design verification
- Event selector full-width, max 2 taps from landing to Begin.
- Agent seats become horizontally swipeable/scrollable *with visible tab labels*, not tiny triangular portraits.
- Evidence rail as anchored bottom sheet with list buttons and ESC / close.
- Audit summary before reveal visible without sticky overlays blocking text.
- Color, motion and dates remain readable at 375px.
