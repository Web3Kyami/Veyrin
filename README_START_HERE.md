# VEYRIN — Research Chamber
### Engineering handoff | Bitget AI Base Camp Hackathon S2 | v1.1 — 2026-10-10

**Tagline:** Three AI investigators. One market thesis. No hindsight allowed into the evidence window.

**Product:** A trader selects a real historical U.S.-stock event (and optionally enters a thesis). VEYRIN assembles only records provably published before a locked cutoff. ATLAS constructs the strongest evidence-led view; VEX attacks unsupported assumptions; SEAL reconciles and prepares a pre-reveal research docket. The server verifies the permitted source IDs and signs a canonical digest. Only then can the user reveal subsequent real market movement and inspect which observations supported, contradicted, or did not resolve the analysis. A human decides what to trade, if anything.

**Track:** AI Trading Desk → Decision Stress Testing. Not autonomous trading. No live orders. No funds or wallet required.

## IMPORTANT — revised pack
The owner supplied **156 global skills**. First consult `16_SKILL_ROUTING_AND_DISCOVERY.md` to discover/read only applicable installed skill files, and `17_EXECUTION_AND_TEST_CADENCE.md` for autonomous operation without full-suite testing after every edit. Root `DESIGN.md` is authoritative, while `05_DESIGN.md` is an old-path entrypoint. Character art, pending generation/owner selection, is governed by `18_PORTRAITS_AND_BRAND_ASSETS.md`. Reference-specific implementation: `19_REFERENCE_IMPLEMENTATION_MAP.md`. Do not assume these skills are accessible merely because the owner supplied an archive.

## Run order for the coding agent
1. Read `AGENTS.md` and `00_DECISIONS_AND_GATES.md` BEFORE writing any UI or code.
2. Read `01_PRODUCT.md`, `02_DATA_AND_RESEARCH.md`, `03_AGENT_SYSTEM.md`, and `04_ARCHITECTURE.md`.
3. Read root `DESIGN.md`, `design/pages/*.md` and `06_PAGES_AND_STATES.md`. Design UI from the specified product-specific composition, not a generic SaaS landing template.
4. Follow the atomic tasks in `07_TASKS.md`, acceptance checks in `08_TESTS_AND_ACCEPTANCE.md`, and evidence protocol in `09_DEMO_AND_SUBMISSION.md`.
5. Use `10_SOURCE_REFERENCES_AND_RIGHTS.md` for integrations, factual references, source inspiration and licences.
6. `11_API_AND_SCHEMA_CONTRACTS.md` is the binding contract for API/client/state/model schemas. `12_OPERATIONS_AND_DEPLOY.md` tells you how to deploy safely on Vercel.
7. See `18_PORTRAITS_AND_BRAND_ASSETS.md` and `13_VISUAL_ASSET_BRIEF.md` for future original agent portraits. Build branded vector fallbacks now.
8. Use `14_WORK_ASSIGNMENTS.md` if several coding agents are available. `PROMPT_TO_CODING_AGENT.md` is a standalone command prompt.

## The non-negotiable demo
A stranger can open a no-login URL, choose a real event, watch three **actual LLM roles** perform a research task using dated sourced evidence, seal the pre-reveal record, click REVEAL, see sourced actual market prices, review what stood up or failed, and inspect raw evidence + the canonical hash in under 3 minutes with no fabricated outcome.

## Evidence classification
- **Public pre-cutoff source:** publication timestamp verifiable; no future content in pre-reveal LLM payload.
- **Outcome:** measured market price/release event after cutoff, shown only after server state is SEALED.
- **Inference:** LLM reasoning, always attributed to a role and source IDs, with uncertainty and rebuttals.
- **Replay:** reconstructed analysis of a past event; **not** a genuine pre-event forecast, even if its prompt is cutoff-limited. The model may have trained on the outcome. Every relevant UI and document says so.
- **Forward:** a new analysis actually recorded before an upcoming event, for future followup (optional / post-submission).

## Product scope
**P0:** one verified case, three distinct agent calls, original theatrical research UI, SHA-256 sealing, actual outcome reveal, citations, Bitget market context, proof panel, resilient deploy.
**P1:** second verified case, shareable URL with persisted read-only verdict, accessibility polish, optional richer visualizations.
**P2 (NOT for this deadline):** arbitrary-news crawling, agent audio/TTS, autonomous order execution, multi-agent live simulations, forecasting leaderboard, user accounts, crypto onchain certificates.

## First instruction
Implement the datasource acceptance task before scaffolding dozens of pages. If the selected case cannot meet the sponsor-data requirement, change the case, not the truth standard. More detail in `00_DECISIONS_AND_GATES.md`.

## Success definition
**Product:** trader learns whether a pre-event rationale was defensible and which missing evidence should shape the next research decision.
**Judges:** can reproduce one claim, inspect why ATLAS/VEX disagree, verify SEAL's seal, and see genuine Bitget data used in the core workflow.
**Engineering:** accessible, fast enough for a demo, no model key leaks, no artificial model dialogue, no retroactive tampering.

## Deployment choice
Next.js app and server-side route handlers on **Vercel**. If durable server storage is needed, choose a small managed database attached to Vercel (no separate app server or VPS). Do not use local SQLite/filesystem as production persistence on serverless instances.

## IMPORTANT
This folder is an implementation specification, not a working app. Market events, prices, API capabilities, vendor quotas and participant eligibility must be confirmed during implementation. Do not promote hypothesized data into factual UX content.
