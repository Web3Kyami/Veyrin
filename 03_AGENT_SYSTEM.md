# 03 — Three functional AI roles and the deterministic referee

## Product behavior

VEYRIN runs three sequential, specialized research passes against one historical pre-event packet. All three use the configured model with distinct instructions and strict role schemas. Google AI Studio is the default provider; OpenRouter is available only through explicit provider selection. One model across three roles is not three independent models. No role can certify its own citations or the seal.

### ATLAS — evidence analyst

ATLAS builds a conditional thesis from the eligible pre-event packet. Its structured result includes a stance, thesis and citations, three to five source-linked claims, unknowns, falsifiers and watch items. User-entered text is labeled as a hypothesis, never evidence.

### VEX — countercase examiner

VEX receives the same pre-event packet and validated ATLAS result. It challenges specific claim IDs with citations, records concessions, and identifies missing evidence or alternative hypotheses. It must not manufacture disagreement or force a bearish conclusion.

### SEAL — drafting auditor

SEAL receives the same pre-event packet and both earlier outputs. It drafts a disposition for each claim with a reason and citations, plus a finding, missed risk and forward checklist. Deterministic server code checks source IDs, time eligibility, role shape, stage signatures and receipt integrity. SEAL does not verify itself.

## Implemented request sequence

The browser starts each stage only after the previous response validates. The server is stateless between requests; the browser passes signed stage tokens forward.

1. POST /api/preflight loads and validates the pre-event evidence and Bitget pre-cutoff candle, computes the pre-packet SHA-256 and returns a signed preToken.
2. POST /api/atlas receives preToken and optional userThesis, validates the token and packet again, calls ATLAS, validates its schema and citations, then returns atlasToken.
3. POST /api/vex receives preToken and atlasToken, verifies their signatures and matching packet hash, calls VEX and validates citations and claim references, then returns vexToken.
4. POST /api/seal receives all prior tokens, verifies and revalidates them, calls SEAL, validates its draft, creates a portable veyrin-receipt-v1 record, computes its canonical SHA-256 digest and returns sealToken.
5. POST /api/verify checks the server signature and digest. POST /api/reveal repeats those checks before importing and calling the post-outcome loader.

No post-outcome loader is imported by preflight, ATLAS, VEX or SEAL. The only loader import is in api/reveal.js, after the signature and digest checks. A historical replay cannot establish that a model lacked prior knowledge of the outcome.

## Output and citation rules

The enforced schemas live in lib/role-output-schemas.js and deterministic checks in lib/case-validation.js. ATLAS claims require source IDs; its thesis has separate thesis citations. VEX challenges target known ATLAS claim IDs and require source citations. SEAL dispositions reference known claims and require source citations. The server rejects unknown citations, ineligible time evidence, invalid structure and mismatched stage tokens. Model text is not displayed as a completed role until server validation succeeds.

Prompts and the bounded provider adapter live in lib/openrouter.js. Google AI Studio uses `GEMINI_API_KEY` and exact `GEMINI_MODEL` with `VEYRIN_AI_PROVIDER=google-ai-studio` (the default); OpenRouter uses its existing variables only with `VEYRIN_AI_PROVIDER=openrouter`. Both pass verified evidence directly in the role context and make no tool calls. Google sends JSON MIME type and the role schema through `generationConfig.responseFormat.text`; OpenRouter uses `response_format`. Output is capped at 1,200 tokens and the total request deadline is 22 seconds. If a provider explicitly rejects JSON Schema with a capability error, the adapter makes one JSON-only retry within that same deadline. Both paths require parseable JSON, then the API route applies the existing strict role, source and citation validators. Malformed output, timeouts and provider failures produce explicit errors. There is no provider or model fallback, canned transcript or silently repaired output. Sanitized server diagnostics record provider, role, model ID, HTTP status, provider code/message, request ID when supplied and timestamp; API keys, authorization headers and full prompts are excluded. Role endpoints have a best-effort in-memory rate limit per warm function instance; it is not a durable abuse barrier.

## Seal and storage limits

Canonicalization sorts object keys and preserves array order. SHA-256 covers UTF-8 canonical JSON. Signed stage and receipt tokens use HMAC-SHA-256 with a signing key derived from OPENROUTER_API_KEY when present, otherwise GEMINI_API_KEY. The signed pre-packet binds the investigation to one provider and model, and the receipt contains the pre-evidence packet and all three signed stage outputs.

The server does not persist runs or seals in a database. The portable receipt is held in browser sessionStorage and can be downloaded by the user. It is not a durable server archive, public share link, trusted timestamp, blockchain record or proof that a model was unaware of the outcome. Changing or removing the credential currently used as the signing source invalidates existing signatures.

## Current live gate

On 2026-10-10, two no-tool probes for the previous model `qwen/qwen3.8-27b:free` returned a provider 404 for both plain text and JSON Schema. The latest Preview now reports `google/gemma-4-26b-a4b-it:free`; one real ATLAS request returned `MODEL_RATE_LIMITED` and produced no accepted output. No later stage was called. See STATE.md for the current deployment, the configured model string, request evidence and remaining provider blocker.

