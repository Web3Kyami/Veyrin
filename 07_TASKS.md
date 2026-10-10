# 07 — Implementation task board (atomic, ordered, testable)

## As-built status, 2026-10-10

This board began as an implementation proposal. The shipped runtime is static HTML/CSS/browser JavaScript plus Node.js serverless functions on Vercel, not the Next.js/TypeScript/Zod/Neon architecture proposed below. Current route contracts and architecture are in 04_ARCHITECTURE.md and 11_API_AND_SCHEMA_CONTRACTS.md; verified phase results and blockers are in STATE.md. Do not scaffold the superseded stack or claim the remaining acceptance gates passed.

The P0 implementation is present, including the Bitget-linked case, separated pre/post loaders, the three role routes, deterministic citation checks, signed receipt, reveal guard, primary pages and silhouette fallbacks. The remaining release blockers are a configured model response that completes the forced-tool request, Vercel CLI authorization for a new Preview deployment, then one successful anonymous seal/verify/reveal journey and release pass. The current Preview URL and exact evidence are recorded in STATE.md. This directory is not a Git repository, so report tested artifacts and commands without inventing a commit SHA.

**EXECUTION OVERRIDE:** `17_EXECUTION_AND_TEST_CADENCE.md` is binding: minimal risk-gated checks early, focused tests on sensitive logic, one integrated E2E, and one release suite; DO NOT run all tests after each microchange. `16_SKILL_ROUTING_AND_DISCOVERY.md` routes loaded skills. User expects unattended progress.

**HARD DEADLINE:** User reports organiser accepts until Oct 11 2026 23:59, timezone unconfirmed. Assume UTC+8 conservatively; see `00_DECISIONS_AND_GATES.md`. Freeze demo several hours before deadline. Do not wait for visual perfection to ship functional proof.

Read the required **skill files at their actual paths** before each relevant phase (`16_SKILL_ROUTING_AND_DISCOVERY.md`). Stage status only at phase transitions; do not generate verbose micro-task reporting.

Task states: `TODO` → `IN_PROGRESS` → `BLOCKED` / `DONE` with proof link. Every DONE includes commit SHA + test command, screenshot or API artifact. Senior orchestrator enforces stage gates. Parallel streams only after data-contract agreement.

## PHASE A — Viability / real case (short, parallel; do not build a giant test harness) (MUST complete before broad UI)
- [ ] **A01** Choose historical event and observation windows *without viewing outcome values during pre-pack curation*; write `data/cases/<id>/manifest.json` with exact cutoff UTC, event release timing and market session policy. PASS when two reviewers agree time is unambiguous.
- [ ] **A02** Verify at least 3 truly pre-cutoff source records with published/first-available timestamp, URL, excerpt and SHA-256; label any ambiguous as excluded. PASS automated eligibility test.
- [ ] **A03** Retrieve authoritative post-event release source plus pre/post *underlier* market points; record exact quote type, window and time; calculate one change with reproducible script.
- [ ] **A04** Probe Bitget stock MCP `https://agent.bitget.com/mcp`, discover actual tool signatures, fetch selected company data. Save redacted sanitized query/response provenance `docs/BITGET_PROBE.md`. Do not invent APIs. PASS: one real response.
- [ ] **A05** Probe Bitget public market symbol inventory and instrument metadata; verify exact tokenized-stock market and actual sample/quote/candle around event window. PASS: exact venue/instrument/quote source with timestamps. If not usable, switch case/company; NEVER substitute an unrelated BTC ticker.
- [ ] **A06** Build artifact `pre-evidence.json` and separate `post-evidence.json`; prove target event info is absent from pre pack. PASS source-gate test and source matrix.
- [ ] **A07** Verify API key and model through server-only one-line schema test (do not log credentials). PASS: response parseable by Zod. Log model ID and latency only. Do NOT silently switch models.
- [ ] **A08** GO/CHANGE/KILL checkpoint: G1–G3 real. If fails, change event or narrow scope; notify user of blocker before large UI effort.

## PHASE B — Contracts and platform
- [ ] **B01** Scaffold Next.js App Router, TypeScript strict, ESLint, scripts build/test/e2e/verify, Vercel preview.
- [ ] **B02** Implement Zod contracts in `lib/types/**`, case manifest validation with status READY only on verified sources and market.
- [ ] **B03** Implement `lib/env.ts` validates required env on server; create `.env.example` with placeholders, Vercel project env mapping; no `NEXT_PUBLIC_OPENROUTER_`.
- [ ] **B04** Implement typed Bitget MCP and public-market adapters; instrumentation errors and date normalization; server-only.
- [ ] **B05** Implement independent `getPrePack` and `getPostPack` loaders in physically separate modules, lint/import test forbids future loader use in agents/pre-routes.
- [ ] **B06** Implement secure source record extraction, checksum, eligibility and evidence memoization.
- [ ] **B07** Implement optional Neon/Vercel managed Postgres storage + migrations (or documented signed-session fallback), run-id generation, transactions and idempotency.
- [ ] **B08** Implement server-side request quotas / provider spend guard; no secret leakage, no arbitrary URLs or prompt injection commands.
- [ ] **B09** Implement exact stage transition machine with invalid-transition tests.

## PHASE C — Actual AI passes
- [ ] **C01** Implement server OpenRouter adapter, timeout/abort, role prompt versioning, max tokens, bounded retry of malformed JSON, no hidden model fallbacks.
- [ ] **C02** Implement ATLAS role with source-grounded claims; Zod parser and citations validator; unit test on fixture.
- [ ] **C03** Implement VEX role with attacks targeted to ATLAS claim IDs, source-grounded concessions/criticisms; parser and test.
- [ ] **C04** Implement SEAL role with dispositions of all ATLAS claim IDs and transparent unknowns; parser and test.
- [ ] **C05** Build deterministic evidence validator for claims/citation existence/eligibility; no self-certifying model claims. PASS unknown source ID rejected/EXCLUDED.
- [ ] **C06** Canonicalize pre-record, compute SHA-256, persist immutable `sealed` artifact and sealedAt; tests for tamper invalidation and ordering.
- [ ] **C07** Implement stage API endpoints `/api/runs/**`, session recovery, idempotent retries, explicit errors and partial-run UX.
- [ ] **C08** Implement post-route forbidden until seal, then real post pack fetch; tests on direct URL access and network calls.
- [ ] **C09** Add deterministic market observation comparison; avoid comparing underlying/Bitget different units; legend + source semantics.
- [ ] **C10** Capture one complete role run from actual model, actual data and digest. Save sanitized receipt in `evidence/` and identify it as a recorded run if replayed later.

## PHASE D — Crossfire-inspired ORIGINAL visual system
- [ ] **D01** Implement design tokens, font system, no-generic-template layout; evaluate mobile contrast early.
- [ ] **D02** Produce 3 original consistent portraits matching `18_PORTRAITS_AND_BRAND_ASSETS.md`; log source/usage rights; compress to AVIF/WebP. This is future art work; the current original SVG silhouettes are the approved functional fallback.
- [ ] **D03** Build reusable `AgentSeat`, `ChamberArena` triangular layout and role-state choreography, reduced motion fallbacks.
- [ ] **D04** Build stage transcript containing only actual returned text and claim IDs; source hover/click highlights.
- [ ] **D05** Build interactive evidence drawer with timestamps, eligibility, source URL, refs, excerpts.
- [ ] **D06** Build immutable seal card using actual returned sha256; copy + download verified raw record.
- [ ] **D07** Build reveal transition and data chart or two-point interval with honest sourced numbers and session marker.
- [ ] **D08** Build claim-vs-challenge comparison view + concise actionable takeaway; mark causal uncertainty.
- [ ] **D09** Screenshot desktop/mobile in docs design ledger, one skill-guided anti-slop review; remove fake UI analytics. Legit original SVG portrait fallbacks allowed until owner supplies approved art.
- [ ] **D10** Original ATLAS/VEX/SEAL art integration slot: use `18_PORTRAITS_AND_BRAND_ASSETS.md`; generate/commission when authorized and available, otherwise polished original vector silhouettes with final filename contract; this does NOT block core research.

## PHASE E — Route completion
- [ ] **E01** Build `/` full sections as specified; connect CTA to an actually READY case.
- [ ] **E02** Build `/chamber` with selected case, optional user thesis, READY/limited handling.
- [ ] **E03** Build `/chamber/[caseId]` with full user journey, agent request flow and recovery.
- [ ] **E04** Build `/chamber/[caseId]/reveal` with server gating and interpretation/limits.
- [ ] **E05** Build `/proof` with real artifacts, integrity verifier steps, Bitget source chain, limitations.
- [ ] **E06** Responsive nav, zero-state/error pages, keyboard/evidence accessibility.
- [ ] **E07** Add SEO/page title/open graph preview and stable no-login URL.

## PHASE F — Batched release testing (once main journey is wired; **not per-edit**)
- [ ] **F01** Run `npm run typecheck`, lint, and the **small focused invariant suite** at release checkpoint; do not repeatedly run whole repo after every UI commit.
- [ ] **F02** Cutoff/case leakage tests incl. source published 1 second late, UTC/ET DST, mixed-time candles.
- [ ] **F03** Role schema/citation/abstention tests and failures. Simulate provider 429, timeout, invalid JSON.
- [ ] **F04** Stage concurrency, repeated seal, idempotent reveal, immutable receipt, tamper-detection tests.
- [ ] **F05** Underlier vs Bitget symbol/type staleness/price-comparison tests.
- [ ] **F06** One Playwright complete judge flow using an actual tested model or clearly labeled real recorded run; screenshot desktop 1440 and mobile 390 first, inspect other widths **only if relevant**.
- [ ] **F07** Mobile keyboard/screenreader sanity, reduced-motion and color contrast.
- [ ] **F08** Vercel preview env check, API call log redaction, production no-login independent-browser walkthrough.

## PHASE G — submission and final lock
- [ ] **G01** Final source README: what is real, how Bitget is used, reproducible setup, historical knowledge caveat, architecture, routes, proof.
- [ ] **G02** Capture 90–150s continuous demo and screenshots including one real citation and one real hash verification; no fake data, avoid financial claims.
- [ ] **G03** Complete full 6-part project description per S2 form; explicitly identify target trader segment and observed vs future validation.
- [ ] **G04** Publish compliant X promotional quote post, with `@Bitget_AI`, `#BitgetHackathon` and required official quoted announcement link, retain URL.
- [ ] **G05** Check public GitHub permission/licence of *our own* repo, dependency asset rights and zero copied Crossfire code/art.
- [ ] **G06** Test in anonymous browser exact live domain and inspect all submission materials links.
- [ ] **G07** Freeze code, record commit hash and deploy, submit before conservative time. Record form success evidence.

## STOP CONDITIONS
Do not bury critical failures under design polish. A demo with fake historical consensus, unsupported rToken observations, missing reveal lock, fabricated speeches, or inaccessible URLs is NOT acceptable. If time is short, eliminate secondary pages and motion before eliminating evidence honesty.

## Agent-proof reporting template
`Task ID | status | changed files | command/test result | artifact URL/path | blockers | commit SHA`. One owner per file per phase; merge through orchestrator.
