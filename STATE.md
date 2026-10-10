# VEYRIN build state

Updated 2026-10-10. The verified Preview investigation below is retained. A subsequent local UI overhaul is awaiting owner visual approval.

## Current Preview and completed investigation

The existing Vercel project `web3kyamis-projects/veyrin-research-chamber` is deployed to Preview and reports `target=preview`, `status=Ready`.

- Preview: https://veyrin-research-chamber-2ykg696hm-web3kyamis-projects.vercel.app
- Deployment: `dpl_7dhfkxKXfYM1GEdiA7WnFUQ82QK7`
- Model: `google-ai-studio` / `gemini-3.5-flash-lite`
- Final fresh pre-packet hash: `0f72ccdac327cb7c5afb9594e7c7cf51b978db804621887fba306303b97ba8d2`
- Final receipt digest: `d03b17a5016a9308fd6e6c17957277bab952b229a38faefe08d570621dab9309`

The genuine anonymous journey completed on that deployment. Readiness and preflight confirmed four eligible pre-event sources and Bitget Reality stock instrument `RNVDAUSDT`. Its completed 15-minute candle ended at the cutoff `2026-08-26T19:45:00.000Z` at 209.63 USDT.

ATLAS returned a `MIXED` thesis, three claims and two thesis citations. VEX returned two minor challenges and conceded C1. SEAL classified all three claims as supported. The canonical receipt's deterministic checks passed for citations, source-time eligibility, the Bitget instrument and the pre-cutoff candle; `/api/verify` returned `valid=true` for the receipt digest above.

Only after receipt verification, `/api/reveal` returned the actual Bitget `RNVDAUSDT` candle at 2026-08-26 20:45 UTC: 207.262 USDT. That is a 1.1296% observed decrease from the selected pre-cutoff candle. The linked outcome source is NVIDIA Investor Relations' Q2 FY2027 results release, published with date-only precision on 2026-08-26. This price comparison is not a causal estimate, executable return, proof of thesis accuracy, or contemporaneous prediction. The case is a retrospective reconstruction and model-training leakage remains possible.

## Provider request and safeguards

Google AI Studio is the default provider. OpenRouter remains selectable with `VEYRIN_AI_PROVIDER=openrouter`; there is no silent cross-provider fallback. The API key remains server-side. Role requests contain no tools, `tool_choice`, or provider-routing restrictions. The application fetches and verifies pre-cutoff evidence itself and passes that packet directly to each role.

The first deployed Google request used `generationConfig.responseFormat.text.mimeType: "application/json"`. Vercel's sanitized diagnostic showed HTTP 400 `INVALID_ARGUMENT`: `application/json` was rejected at `generation_config.response_format.text.mime_type`. `lib/openrouter.js` now uses the documented GenerateContent REST fields `responseMimeType` and `responseSchema` ([Google API reference](https://ai.google.dev/api/generate-content)). The role schemas' `additionalProperties` field is rejected with HTTP 400 `INVALID_ARGUMENT`; the existing single JSON-only retry then runs. JSON is still parsed strictly and role shape, source citations, cutoff, signatures and instrument allowlisting are checked deterministically. Malformed JSON is rejected and never sealed.

On the final deployment, ATLAS and VEX each completed after that bounded JSON-only fallback. SEAL's first fallback response was malformed and produced no record; one repeat on the same signed inputs returned valid JSON and passed deterministic validation. A separate guarded ATLAS attempt on an earlier deployment returned HTTP 200 with finish reason `MAX_TOKENS` at the former 1,200-token cap. This was not a timeout: the application deadline is 22 seconds and Vercel's function limit is 30 seconds. Google ATLAS alone now has a 1,600-token cap. VEX, SEAL and OpenRouter retain 1,200; the 22-second deadline is unchanged.

One exploratory ATLAS response included the unsupported ticker-like text `RNRNAUSDT` in a watch item. It is excluded from the final proof. `lib/case-validation.js` now rejects USDT instrument symbols outside the verified packet's Bitget symbol across ATLAS, VEX and SEAL output. The fresh final run contained no unverified USDT symbol. This closes a gap that claim citation validation alone did not cover.

Server logs contain only role, provider, model, HTTP status, sanitized provider error code/message, request ID when available and timestamp. The observed Google errors had no request ID. Keys, authorization headers and prompts were not exposed.

## Verification in this session

- `node tests/trust.test.js`: 11/11 passed, including the new unknown-instrument rejection check.
- `node tests/google-ai-studio.test.js`: 6/6 passed after the Google request-format and ATLAS token-cap changes.
- `node tests/openrouter-diagnostics.test.js`: 5/5 passed; explicit OpenRouter selection remains covered.
- `npm run build`: passed locally and in the final Preview build.
- `vercel inspect <final-preview-url>`: `target=preview`, `status=Ready`.
- Real Preview calls: readiness, preflight, ATLAS, VEX, SEAL, receipt verification and guarded reveal all succeeded on the final journey. The first SEAL response was correctly rejected; one bounded repeat succeeded.
- No production deployment was made. No broad test suite was run.

## UI overhaul, local review candidate

DIRECTION: 7. Cinematic Sportsbook / Fight-Night, adapted to historical market research. The owner authorized the supplied VEYRIN_UI_OVERHAUL_v2 design contract and then explicitly permitted image generation for the three portraits only.

Completed locally: original ATLAS/VEX/SEAL portraits; self-hosted licensed Barlow Condensed and IBM Plex fonts; broadcast hero and featured case rail; accessible mobile navigation; case entry before expandable sources; responsive three-seat chamber with mobile role selection; expandable actual role records; seal/reveal layout; curated Evidence page; reduced-motion fallbacks. Existing routes, token schemas, receipt format and API request payloads remain.

Browsing no longer checks readiness, verifies receipts or requests outcomes automatically. Availability is an explicit user action in the chamber or Evidence appendix. Reveal requests require the existing explicit reveal/retry controls; previously saved outcome data renders from session storage. This frontend scheduling change prevents incidental API consumption during browsing. Backend handlers and data loaders are unchanged.

Verification actually performed:

- Inspected prior desktop/mobile screenshots and captured a local landing baseline.
- Local static-only server refuses every API request. Chromium CDP blocks API paths and external requests; the QA fetch shim records attempts and rejects them.
- Local UI navigation, keyboard menu/role selection, source disclosures, empty/locked states, reduced motion and overflow checks: 75 checks passed at 1440x900, 1024x768, 390x844 and 375x812. No backend tests. The initial keyboard failure was a background-tab harness issue, resolved by explicitly focusing the CDP target; no product workaround was used.
- `node --check public/app.js`: passed.
- One `npm run build`: passed, 16 required files and existing brand, viewport and pre/post-boundary checks. The build script was inspected and performs no network activity.
- SHA-256 comparisons of all 18 existing `api/` and `lib/` files: unchanged.
- Core text/role/button contrast combinations: 6.31:1 or greater, with primary text 18.27:1.
- Research, readiness, receipt-verification and market API calls during overhaul: **0**. One authorized portrait-generation call. No investigation was rerun.

Local screenshots: `docs/screenshots/ui-v2/`, including all five primary routes, tablet/narrow views, a labelled recorded-data reveal and a labelled failure-presentation fixture. The reveal fixture reproduces the prices, digest and aggregate role summary already documented above, with no invented model text, signature token or verification. It exists only in the local screenshot harness, outside the public frontend. Full stored role payloads from the successful run were not available, so populated transcript layout and actual completed-call choreography have not been re-exercised. API integration was deliberately not re-tested.

No new Vercel Preview or Production deployment. Existing Preview above still serves the previous frontend. Owner must approve the new visual captures before Production deployment.

## Remaining functional limits

The seal is a portable signed receipt, not a database-persisted record or trusted timestamp. The browser stores it in session storage. Rotating the signing key invalidates prior receipts. Historical model leakage remains possible.

`docs/DESIGN_LEDGER.md` records the visual comparison, changed files, assets and review limits. Skills used in this UI session are appended to `docs/SKILL_EXECUTION_LOG.md`. Root `DESIGN.md` is now the v2 identity; its prior version is retained privately at `docs/design/DESIGN.before-veyrin-ui-v2.md`. `.env*` and `.vercel/` were untouched. The project workspace has no usable Git metadata, so no commit or staged-path review was performed.

### Final approved-direction cleanup, 10 October 2026
Decorative numbering and duplicate role explanations removed. CTA arrows use an 8px inline-flex gap. Essential evidence and uncertainty remain intact. Final captures use `docs/screenshots/ui-v2/cleanup-*`; details in DESIGN_LEDGER. JS syntax and local desktop/mobile capture metrics passed; all 18 backend hashes unchanged. No APIs called, no suites rerun, no deployment. Production candidate awaits explicit deployment approval.

Preview deployment completed READY on 10 Oct 2026: https://veyrin-research-chamber-ql8gm4430-web3kyamis-projects.vercel.app. Existing build check passed on Vercel. Preview only; Production not deployed. No research, market-data or inference API calls. Wait for owner's visual feedback before changes or Production.
