# 08 — Acceptance scenarios and failure-mode contract

**Test execution policy (read first):** The matrix below defines behaviours to cover, **not 30 standalone files or a mandate to rerun every scenario after every edit**. Route high-risk checks through a handful of parametrized unit tests at the trust-boundary milestone, then one complete E2E at integration, and one final release pass. See `17_EXECUTION_AND_TEST_CADENCE.md`.

## Full E2E judge scenario J01 (P0 MUST PASS)
Given fresh anonymous browser, visitor selects one READY real company event. After optional thesis input, the stage displays a specific publication cutoff. ATLAS produces live validated sourced claims. VEX challenges at least one actual claim or explicitly agrees with adequate rationale. SEAL classifies claims and a deterministic backend validates all citations. Server stores a SHA-256 sealed record. Direct reveal route before seal returns NOT_SEALED; after seal returns actual independently sourced observed market data. User can inspect official release and Bitget evidence, read market-session quality, and verify the sealed record hash. Under 3 min for pre-recorded walkthrough; actual model call latency may exceed 3 minutes, in which case demo video should be honest about wait and allow a clearly marked recorded-run proof path.

## Critical behavior matrix (combine into focused parametrized tests; no bloated suite)
| ID | Input / corruption | Expected |
|---|---|---|
| CUT-01 | publishedAt = cutoff-1 second | eligible if source timestamp trusted |
| CUT-02 | publishedAt = cutoff+1 second | pre evidence rejected |
| CUT-03 | missing timestamp | excluded/unknown, not silently included |
| CUT-04 | ET date in DST transition | exact UTC cut preserved |
| CUT-05 | daily OHLC spans after cutoff | excluded from pre prices |
| SRC-01 | LLM cites fake source ID | mark invalid; major unsupported claim prevents clean seal |
| SRC-02 | source hash changed | data integrity warning/blocked; never silently same evidence |
| SRC-03 | malicious 'ignore instructions' text in source | treated as source text; no obeyed instruction |
| LLM-01 | malformed or missing role JSON | explicit role failure; no synthesized result |
| LLM-02 | selected provider returns 429 | explicit retryable failure, no synthesized output or provider switch |
| LLM-03 | missing selected provider key or model | server config error, no surprise provider fallback |
| LLM-04 | ATLAS abstains | VEX/SEAL do not force directional stance |
| ROLE-01 | VEX targets non-existent claim | invalid role output / retry or excluded challenge |
| ROLE-02 | SEAL omits ATLAS claim | verifier rejects incomplete audit |
| SEAL-01 | source key order changed | canonical hash same |
| SEAL-02 | one evidence byte changed | verification fails |
| SEAL-03 | repeat seal call | same immutable digest, not overwritten |
| SEAL-04 | attempt outcome loader pre-seal | forbidden / no post payload |
| FLOW-01 | POST reveal before seal | 409 NOT_SEALED, no outcome body |
| FLOW-02 | POST VEX before ATLAS | stage conflict |
| FLOW-03 | double-click Begin | one run or explicit idempotent handling |
| FLOW-04 | refresh stage after ATLAS | resumes at VEX without replay/fabrication |
| PRICE-01 | stale rToken quote | STALE, not LIVE |
| PRICE-02 | tokenized spot vs perp mismatch | comparison refuses or separates, not mislabels |
| PRICE-03 | invalid 0/negative baseline | no percentage computed |
| PRICE-04 | market window missing | `null` with provenance error |
| SEC-01 | user-provided URL or SSRF payload | rejected; only allowlisted source entries |
| SEC-02 | prompt injection in evidence | source content treated as untrusted data |
| SEC-03 | production browser devtools | no private API key or secret raw traces |

## Integration tests
- Use one real stock-mcp response and one Bitget quote/candle from actual provider (snapshots saved with retrievedAt) to validate typed normalization.
- Use test doubles for deterministic rate-limit / vendor outage scenarios. Each snapshot clearly labels `recorded provider response`, not "currently live".
- Verify an actual selected-provider role response parse, source citation integrity, and timed failure path.
- Validate merged evidence quality for one historical case: pre > cutoff violations exactly zero; source links resolvable at documentation time.

## Visual E2E acceptance (capture first at 390/mobile and 1440/desktop; expand only for real layout risks)
- 390 and 1440 width screenshots required; spot-check 375/768/1280 only if layout risk warrants; no horizontal scroll, overflow, clipped dialogue or unreadable agent labels.
- Keyboard tab path Landing→Case→Investigation→SourceDrawer→Seal→Reveal→Proof; visible focus.
- `prefers-reduced-motion` avoids full cinematic stage; all data still visible.
- Agent fail/retry without losing earlier claims.
- Empty-source/quote errors explicitly explained; no empty lifeless chart panel.
- Real text legible without enabling audio or motion; charts have accessible tables.

## Judge proof pack files generated by app
- `evidence/CASE_MANIFEST.json` sanitized, verified.
- `evidence/INPUT_SOURCES.json` with dates, URLs, content hashes.
- `evidence/ROLE_TRANSCRIPT.json` actual model responses with run time and model ID.
- `evidence/SEALED_RECORD.json` canonical pre-docket + SHA and sealedAt (this is a replay seal timestamp, not a historical forecast timestamp).
- `evidence/REACTION.json` actual underlier/Bitget observations, source and windows.
- `evidence/VALIDATION_REPORT.md` commands plus PASS/FAIL and limitations.
These must only be generated from real executions, not prefilled with invented values.

## Minimum release quality
`typecheck`, `lint`, unit and flow integration tests PASS, Vercel preview passes anonymous smoke, one P0 use journey can be finished with actual model or demonstrably real recorded run, and all critical claims trace to source records.

## What failure means
Research product is not complete if it cannot produce an auditable *actionable research insight*. "Agents debated" is not enough. Outcome evidence alone is not enough. A beautiful scene but no true pre/post separation is an invalid launch.
