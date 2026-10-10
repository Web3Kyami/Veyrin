# 00 — Locked decisions, open questions and kill gates

## Decisions locked in this chat
| Dimension | Decision |
|---|---|
| Product name | VEYRIN — Research Chamber (pronounced VAY-rin) |
| One-liner | Three AI investigators stress-test a market thesis with cutoff-limited evidence, lock their reasoning, then reveal the actual market reaction. |
| Target | Curious self-directed traders of U.S. stocks / tokenized U.S. stock exposure; strongest use when evaluating event reactions and resisting hindsight narratives. |
| Hackathon | Bitget AI Base Camp Hackathon S2 |
| Main track | AI Trading Desk |
| Subtheme | Decision Stress Testing (subject to final form options) |
| UI inspiration | Nerom CROSSFIRE war-room: cinematic agents, active turn, central subject, proof-rich visuals. Recreate layout *pattern* and behaviour, not unlicensed original code/art. |
| Agents | ATLAS analyst, VEX challenger, SEAL auditor. Distinct calls, not just cosmetic speaking order. |
| Model route | Google AI Studio Gemini API is the default server-side provider; OpenRouter remains available only when explicitly selected. Provider and model are configured by env. No public pricing/provider-tier labels. |
| Hosting | Vercel app + server route handlers; no VPS. Managed persistence via Vercel integration only if needed. |
| Money | No wallets, trading execution or real positions. Read-only public Bitget data; no demo-account requirement. |
| Primary showcase | One complete real, verifiable historical event, replayed honestly. |
| User action | Human sees research insight and can choose to investigate further; no BUY / SELL advice. |

## Deadline / submission risk (HIGH)
The user's relayed organiser update: official October 8 cutoff but **submissions accepted until October 11, 2026 at 23:59**. The update has NO verified timezone. Season 2 handbook generally uses UTC+8; until confirmation, **assume October 11 23:59 UTC+8**, equivalent to **October 11 15:59 UTC / 16:59 Nigeria (UTC+1)**. Err on the early side; the extension timezone is not verified. Aim to submit **several hours before** conservative cutoff.
The original handbook date schedule is stale/contradictory. A late acceptance may not extend Fan Favorite or other award eligibility. Never claim late entry qualifies for voting without explicit confirmation.

## Phase 0: kill gates (first **15–30 minutes** for a targeted feasibility read; expand only if real data needs it)
**G1 — Real evidence case:** Find a specific company event with at least 3 usable, independently linkable pre-cutoff sources, timestamps earlier than cutoff, an authoritative outcome announcement later, and actual subsequent price observations. Pass only if every data point has source URL and exact event/quote time. Candidate: NVIDIA Q2 FY2027 earnings Aug 26, 2026; no guarantee of pre-event expectations from Bitget. If no credible pre-cutoff analyst consensus, DO NOT invent it: use documented company guidance, public context, analyst statement genuinely published before cutoff, or explicitly mark 'historical consensus unavailable'.
**G2 — Bitget in the causal path:** At least one real Bitget-source datum affects the research comparison (e.g. a supported tokenized stock's timestamped price reaction or price/market-window state). Verify actual instrument type and quote semantics. A sidebar Bitget logo or unrelated BTC ticker DOES NOT PASS. If chosen company has no usable Bitget market context, choose another eligible company/event.
**G3 — Three agent invocations:** Use configured model provider from server; get machine-validated role-specific JSON for all 3 agents on case fixture. If a role fails, show failure and offer retry; never synthesize prewritten fake live dialogue.
**G4 — Hard split:** Pre-reveal calls physically cannot read/import outcome module or outcome payload. Automated test demonstrating post-cutoff leakage causes refusal.
**G5 — Verifiable seal:** Canonicalize the input docket and compute server-side SHA-256 before reveal; after reveal, demonstrate any changed byte invalidates verification.
**G6 — Realistic deploy:** Vercel preview runs without login and finishes one complete replay on supported mobile/desktop browsers. Production secrets server-only.

No full page-polish until G1 + G2 + G3 pass. Use the lean, phase-gated testing policy in `17_EXECUTION_AND_TEST_CADENCE.md`; the early stage is an integration check, not a sprawling test project. No submission if G4/G5 fail.

## What this IS NOT
- Not a live-pre-event prediction from 2026 when performed retroactively today. UI label: **Historical reconstruction · outcome withheld from the supplied evidence · not a contemporaneous forecast.**
- Not a causal explanation proving why a market moved. We distinguish observed outcomes from hypotheses.
- Not a machine that knows undisclosed market consensus.
- Not a tokenized-stock arbitrage simulator or execution agent.
- Not three independent minds if one LLM is used three times. Describe honestly as **three specialized reasoning passes / agent roles**.

## Change rules
May alter: visual palette, portrait style, number of secondary screens, chart lib, database vendor, specific chosen case. Must not alter: three real distinct roles, source-time checks, pre/post boundary, Bitget integration, no-login demo, real outcomes, clearly labelled replay.

## Recommended build strategy
Ship `P0` early, record one valid demo, then add niceties. Keep a fully runnable fallback when external model returns an error: an explicitly marked previously recorded run, if one was actually generated and stored earlier, never fake current AI execution.
