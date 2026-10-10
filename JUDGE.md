# VEYRIN — Judge / Developer Quick Tour

> **Track intent:** AI Trading Desk / Decision Stress Testing. Historical reconstruction, not a prospective stock-price prediction or trading bot.

## 60 seconds: inspect without spending API credits

1. Open the **Home** page. The first interface panel previews the actual structure of a research case (it is clearly labelled a product preview, not live agent activity).
2. Open **Workspace** / the NVIDIA fiscal Q2 FY2027 event. Examine the four catalogued pre-event documents and their precise or intentionally uncertain timestamps. This page does not automatically call the model or Bitget.
3. Open **Recorded study** (`/sample`). This uses the aggregate results recorded during a prior real end-to-end test: ATLAS returned **three cited claims**, VEX raised **two minor challenges**, SEAL supported all **three** claims; the receipt verified and the selected Bitget RNVDAUSDT spot candle closes moved from **209.63** to **207.262 USDT** (observed **−1.1296%**). This *is not* a dynamically re-verified receipt or full persisted transcript.
4. Open **Evidence & method** (`/proof`). Check the information-boundary design, signature checks, source eligibility and limitations.

This is one real supported historical event, not a generalized symbol picker. The market change does **not** establish that the model predicted it, that a trade would have captured it, or that the release caused it.

## Optional: start a new real investigation

This consumes an explicitly configured Google AI Studio or OpenRouter model API; it may contact Bitget for historical observations.

In the NVIDIA workspace:
1. Click **Check availability** (explicit API call). Wait for readiness before proceeding.
2. Enter an optional research question and click **Run investigation**. Preflight, ATLAS and VEX run, with actual source-linked outputs appearing in the transcript.
3. Click **Audit and seal** to invoke SEAL and commit the validated record.
4. Download and/or verify the signed receipt. Click **Reveal outcome** only after sealing to load the post-event Bitget candle and company outcome source.

An LLM may already know the historical event from training. The cutoff applies to the packet *provided to the roles* and is not genuine prospective blindness.

## Source / architecture

- `public/index.html`, `public/styles.css`, `public/app.js`: client-side routes, input and transcript UI, role selection, source navigation.
- `public/case-sources.js`: saved source catalogue shown before a user makes any API request. “Catalogued” is not the same as live verified eligibility.
- `lib/data/pre-case.js`, `lib/data/load-pre.js`: static source definitions and server-side pre-event packet.
- `lib/case-validation.js`: deterministic source, citation, instrument, candle and timing validation.
- `api/atlas.js`, `api/vex.js`, `api/seal.js`: role stages.
- `lib/receipt.js`, `lib/security.js`, `api/verify.js`: canonical record and signature verification.
- `api/reveal.js`, `lib/data/post-outcome.js`: separated post-event data access.

Public contract: [11_API_AND_SCHEMA_CONTRACTS.md](11_API_AND_SCHEMA_CONTRACTS.md). Evidence provenance: [data/cases/nvda-2026-q2-fy27/EVIDENCE.md](data/cases/nvda-2026-q2-fy27/EVIDENCE.md).

## Offline technical checks (no AI/market calls)

Run from the repository:

```bash
node --check public/app.js
npm run build
npm run test:trust
npm run test:ui
```

`test:ui` is static markup/route integrity only. These commands do not contact Google, OpenRouter or Bitget. They do not substitute for a live integration test.

## Evidence limits and claims

- The documented end-to-end example was completed previously; the `/sample` page is a static reported summary, not proof that a visitor can cryptographically verify the old session.
- Full agent message payloads were not retained as an accessible shared-run history. They are not invented in the archived study.
- The integrity digest was reported as `d03b17a5016a9308fd6e6c17957277bab952b229a38faefe08d570621dab9309`. Digest text by itself cannot independently authenticate the full record without the original signed receipt and signing context.
- Two Bitget completed candle observations do not justify a continuous intraday price curve. No synthetic PnL, backtest, annualized return or causal earnings attribution is represented.
- The application has no durable database-backed case history and no wallet or trading execution.
- The signing key must be stable for old signatures to verify; key rotation may invalidate prior receipts.
- The v3 light interface is a separate UI branch and must be visually inspected on desktop and mobile prior to Production. Backend handlers and validators were deliberately not changed.

## Contribution and operational boundary

The new interface is developed on `design/light-workstation-v3`. Production and `main` are not altered until the owner approves. Public releases must never include `.env` files, API keys, private test fixtures or inaccurate descriptions of provider availability.
