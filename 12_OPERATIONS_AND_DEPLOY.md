# 12 — Current operations and Vercel deployment

## Runtime and deployment target

VEYRIN is served as static HTML, CSS and browser JavaScript with Node.js serverless functions on Vercel. Vercel is the only deployment target. The anonymous demo target is Preview. No successful Production release has been made; do not deploy or promote to Production without explicit authorization.

The current READY Preview is:

- URL: https://veyrin-research-chamber-gyv87ou3g-web3kyamis-projects.vercel.app
- Deployment: dpl_56VPBh3hSPUXnaRzZKBPoyrUurnC
- Target: preview
- Project: veyrin-research-chamber in team web3kyamis-projects

The Google AI Studio provider changes described below are currently local and have not yet been deployed. The Preview listed above therefore still reflects the prior deployment and model configuration.

On 2026-10-10, the CLI identity was `web3kyami`, the `web3kyamis-projects` team was listed, and `vercel switch` reported no change. Explicitly relinking the existing `veyrin-research-chamber` project refreshed team-scoped credentials; the initial Preview deployment then succeeded as `dpl_54tdWrQPzXmjG1z3cHdxEx3qKqTy` with `target=preview` and `readyState=READY`. This is the existing project; no second project was created. See STATE.md for the current Preview, access and model evidence.

## Server-only environment

Google AI Studio is the prioritized provider for the next Preview deployment. Add these server-only Vercel Preview variables:

- `VEYRIN_AI_PROVIDER=google-ai-studio` (optional because this is the server default, but explicit in Preview is clearer).
- `GEMINI_API_KEY`: secret server-only credential from Google AI Studio.
- `GEMINI_MODEL`: exact non-secret Gemini model identifier selected by the owner.

OpenRouter remains selectable by setting `VEYRIN_AI_PROVIDER=openrouter`; that choice requires the existing server-only `OPENROUTER_API_KEY` and `OPENROUTER_MODEL`. Provider choice is explicit: a missing or failing Google configuration never switches to OpenRouter. Both keys may remain configured, and no API key is returned to the browser. Never print or copy either key into chat, logs, screenshots or repository files. GET /api/status and GET /api/readiness expose only the selected provider, non-secret model ID, configuration state and required variable names.

The previous Preview readiness reports `google/gemma-4-26b-a4b-it:free`, model configured, Bitget ready, and the RNVDAUSDT 15-minute pre-cutoff candle at 209.63 USDT. The ID surfaced by readiness includes `:free`, while the value supplied in chat omitted that suffix. Fresh preflight returned four eligible pre-event sources and canonical hash `d19c65ec450d96735d38f88a9f397cab781e637e697107ff8bfdb237f7cd7f16`. One real ATLAS request returned `MODEL_RATE_LIMITED`, with no role output accepted. No retry or later role call was made. The detailed provider message and request ID were not available from the returned API response, and the matching Vercel log query returned no diagnostic line. Earlier Qwen probes and their sanitized 404 are recorded in STATE.md. Do not describe configuration presence as proof that a model call succeeds.

## Local commands

- Build/static boundary check: npm run build
- Targeted trust tests: npm run test:trust
- Local server: PORT=48361 npm run dev

The local server does not inherit Vercel Preview secrets unless they are deliberately supplied in the environment. A local readiness panel with missing model configuration is expected in that case. Do not copy Vercel credentials into tracked or shared files.

## Data and trust behavior

The single curated case is NVIDIA FY2027 Q2. Four eligible pre-event documents retain their original timestamp precision. Preflight checks a live Bitget Reality stock-token instrument and a completed 15-minute candle ending at the fixed cutoff. The result is a historical reconstruction, not a contemporaneous forecast; model training leakage remains possible.

Pre-event data is loaded separately from outcome data. Only api/reveal.js imports the post-outcome loader, after verifying the signed receipt, canonical digest and case ID. No outcome candle was requested in the incomplete live journey. The revealed comparison, when reached, is the observed difference between selected Bitget candles; it does not prove causality or executable return.

The seal is portable and browser-held in sessionStorage or a downloaded receipt. No database, durable cloud archive or public share URL exists. HMAC signing derives from OPENROUTER_API_KEY when it is present, otherwise GEMINI_API_KEY. Removing the OpenRouter key while Google is selected or rotating the active signing source invalidates existing receipts. The signature and digest are not a trusted timestamp.

## Limits, errors and spend

Each role call uses the configured model, direct verified evidence, the role's existing JSON Schema, a 1,200 output-token limit and 22-second total deadline. Google uses `generationConfig.responseFormat.text`; OpenRouter uses `response_format`. Requests have no tools or tool choice. If the selected provider explicitly rejects JSON Schema support, one JSON-only retry may run within the same deadline; malformed JSON and all deterministic schema/citation failures are rejected. Sanitized server diagnostics include provider, role, model ID, HTTP status, provider code/message, request ID when present and timestamp, never credentials or full prompts. There is no alternate-provider/model fallback or fabricated transcript. A CLI query after the last ATLAS request returned no matching diagnostic line, so Vercel log retention for that event is unverified.

Role request limits are best-effort counters in each warm serverless instance. They do not guarantee a global spend cap. Set provider-side limits with the selected provider where available; the app itself does not claim a durable global quota.

## Preview release gate

Before calling the demo end-to-end or release-ready:

1. After code or approved configuration changes, deploy the latest build to Preview. Inspect the resulting deployment and confirm target=preview and readyState=READY.
2. Confirm anonymous access to landing, case, investigation, reveal and proof pages.
3. Run one short real ATLAS feasibility request. Require a structured response to pass validation before continuing; do not use synthetic transcripts.
4. Only after ATLAS validates, run VEX and SEAL against the same locked pre-event packet and require their real structured outputs to pass validation.
5. Verify the resulting receipt, confirm tampering is rejected, then request the post-outcome Bitget candle through reveal.
6. Inspect current Preview screenshots at 1440px and 390px.
7. Run the single release pass in 17_EXECUTION_AND_TEST_CADENCE.md and update STATE.md with actual results.

An invalid reveal request on the current Preview was rejected with REVEAL_SEAL_INVALID. That confirms the pre-seal guard only; it does not prove the valid seal/reveal journey.

## Current known gates

- Preview deployment access: resolved by relinking the existing project and refreshing team-scoped credentials; latest Preview is READY.
- Model execution: latest readiness reports `google/gemma-4-26b-a4b-it:free`; one real ATLAS request returned `MODEL_RATE_LIMITED`. No role output was recorded and no VEX/SEAL/reveal request followed. The provider's detailed 429 message and request ID are unverified because the public API response is generic and the matching Vercel log query returned no diagnostic line. The configured model string also has a `:free` suffix not present in the value supplied in chat. Earlier Qwen free-route 404 evidence is in STATE.md.
- End-to-end journey and release pass: not complete.
- Generated portraits: deferred. Original VEYRIN silhouette SVGs remain the current fallbacks, as intended by the portrait brief.

