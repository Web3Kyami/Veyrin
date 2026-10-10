# 11 — Implemented API and token contracts

This document describes the current JavaScript serverless routes in api/*.js. It replaces the earlier TypeScript/Zod, persisted-run API proposal. There is no /api/runs service, database-backed run ID, or durable server-side seal.

## Public read routes

- GET /api/status returns brand, caseId, historicalReconstruction, modelConfigured, the selected provider, the non-secret model ID, and secretServerOnly. It never returns the API key.
- GET /api/readiness returns configured model state, the non-secret model ID, live Bitget pre-cutoff instrument and candle fields, and eligible pre-event sources. It returns bitget.ready=false when the check fails. It never loads post-outcome data.
- The browser routes /, /chamber, /chamber/nvda-2026-q2-fy27, /chamber/nvda-2026-q2-fy27/reveal and /proof are static views served from public/index.html.

## Stage requests

Request bodies are JSON. A missing or malformed body is rejected. The shared reader accepts up to 60,000 bytes. The optional userThesis is trimmed and limited to 1,200 characters.

| Route | Request | Successful response |
| --- | --- | --- |
| POST /api/preflight | Empty JSON object | { preToken } |
| POST /api/atlas | { preToken, userThesis? } | { atlasToken, claimCount } |
| POST /api/vex | { preToken, atlasToken } | { vexToken, challengeCount } |
| POST /api/seal | { preToken, atlasToken, vexToken } | { sealToken, digest, sealedAt } |
| POST /api/verify | { sealToken } | { valid, digest?, sealedAt?, message } |
| POST /api/reveal | { sealToken } | { caseId, digest, pre, post, observedChangePercent, outcomeSource, interpretation } |

Preflight validates the evidence packet and cutoff before it signs the preToken. Each role route verifies prior token signatures, matches the pre-packet hash and validates role output and citations. Seal returns a portable record token only after deterministic checks. Verify reports invalid receipts with valid=false and a message. Reveal checks the seal signature, record digest and case ID before loading post-outcome data.

The browser persists stage tokens for the current tab in sessionStorage and offers receipt download. The server does not retain a run or receipt.

## Role output schemas

The enforced JSON Schemas are in lib/role-output-schemas.js.

- ATLAS: stance, thesis, thesisCitations, three to five claims with IDs C1–C5, source citations, strength and caveat, then unknowns, falsifiers and watchItems.
- VEX: claim-targeted challenges with citations and severity, concededClaimIds, missingEvidence and alternateHypotheses.
- SEAL: per-claim dispositions with rationale and citations, executiveFinding, missedRisk and forwardChecklist.

Additional semantic and citation checks are implemented in lib/case-validation.js. A JSON-schema-valid response can still fail the deterministic checks and is not displayed as accepted output.

## Token and digest format

A token has kind, payload and signature fields. The signed preflight packet binds the investigation to its provider and model; later role requests reject a changed configuration. Stage tokens are signed with HMAC-SHA-256 using the server-only OPENROUTER_API_KEY when configured, otherwise GEMINI_API_KEY. The seal token contains a veyrin-receipt-v1 record with case ID, cutoff, preHash, pre-evidence, user thesis classification, signed ATLAS/VEX/SEAL outputs, deterministic check summary, provider, model ID, prompt version and historical limitation.

Canonical JSON sorts object keys and preserves array order. SHA-256 is computed over UTF-8 canonical JSON. Receipt verification checks the receipt signature, receipt digest, pre-evidence hash and all three role-token signatures and packet hashes. This establishes integrity relative to the server signing key, not a trusted timestamp or historical model state. Changing or removing the credential currently selected as the signing source invalidates old tokens.

## Errors and rate limits

Errors use { error, message }. Method errors use 405; oversized bodies use 413; invalid stage or input errors use their route status; rate limits use 429; model failures generally use 502 or configuration failures 503. Error messages do not include the provider secret. No critical model error is replaced by a successful dummy response.

Role limits are in-memory per warm function instance. They limit accidental repeated calls but do not provide a durable global quota across Vercel instances.

## Outcome boundary

api/reveal.js is the only route that imports lib/data/post-outcome.js. It verifies the seal signature and digest before requesting post-cutoff data. The comparison is the observed change between two selected completed 15-minute Bitget Reality stock-token candles. It does not establish causality, executable return, or that a thesis was correct. Pre-analysis must never import the outcome loader.

