**Skill routing and lean testing:** Every worker uses relevant exact installed skills from `16_SKILL_ROUTING_AND_DISCOVERY.md`; test cadence from `17_EXECUTION_AND_TEST_CADENCE.md`. Only lead owns shared skill log and state. The visual worker must use root `DESIGN.md` and page specs, not invent art direction.

# 14 — Worksplit for multiple coding agents / interns

## Suggested agent organization
**Lead/Integrator (one owner):** owns product contract, merge control, CI, Vercel deployment, no hallucinated claims, stage gates. Reads entire pack. Sets branches from one repo and coordinates API freeze before parallel work.
**Data/market engineer:** owns `lib/bitget/**`, `lib/data/**`, `data/cases/**`, `scripts/ingest-case`, source proofs/quote semantics. Primary responsibility: G1/G2, reality and timestamps. Does NOT edit UI components.
**AI/backend engineer:** owns `lib/agents/**`, `lib/integrity/**`, `app/api/**`, `lib/stores/**`; strict schema, stage gates, LLM failure handling, server secret protection. May depend on data manifest contract; starts with mocked *clearly labelled test fixtures*, then runs real provider.
**UI/art engineer:** owns `components/**`, `app/(pages)` and `05_DESIGN.md` implementation; must not invent market data for visuals or add fake role messages. Builds dynamic components against exact typed API mock fixtures; original portraits and motion.
**QA/evidence/documentation (can be lead):** owns tests, screenshot verification, demo, submission fields, README, X link, proof artifacts. Ensures public links accessible and docs don't overstate.

## Branch workflow
`main` protected as release; `feat/data-case`, `feat/agents-seal`, `feat/chamber-ui`, `feat/judge-proof` for discrete scope. First merge shared Zod schema and case stub types. PR must include affected paths, tests, artifacts and blockers. Avoid 4 agents modifying `app/page.tsx` or CSS simultaneously. Pair agent UI and backend at test gate for full journey.

## Critical dependency sequence
1. Lead defines contracts; Data validates case/Bitget; AI validates selected model. UI scaffolds tokens and portraits in parallel.
2. Lead merges real case pack and agents pre/post gate before page chrome expansion.
3. UI hooks real API states; QA runs full flow, no placeholder outcomes.
4. Merge only green branches, deploy Vercel preview.
5. QA captures proof and submission assets early, then motion polish if time.

## If model limits/time are tight
P0 priorities by survival:
1. Source validity and real Bitget data.
2. Three genuine specialized agent calls.
3. Seal/reveal hard gate and verifiable record.
4. One beautiful, coherent desktop/mobile chamber.
5. Accessible public URL + demo video + submission form.
Then: fancy canvas particles, extra cases, sharing, alternate routes, animations, artwork variant count. Nothing in P0 requires a token, trading wallet, exchange account, or costly multi-model council.

## Mandatory daily/status handoff (we have less than two days)
`Completed: task IDs, commit, relevant test output, deployment URL. Next: three highest risk tasks. Blocked: real API error text (redacted), affected case, decision required. Truth audit: any fake/placeholder/cached/outcome-leak concerns.`

## Rescue procedure
If P0 not green near freeze, choose one **real recorded** valid case instead of arbitrary live research; keep accessible full case path and proof. Never publish LLM placeholders as genuine. Drop features that aren't central. Only if no usable Bitget case exists: stop and tell owner that the chosen product/competition fit is blocked; don't conceal it.
