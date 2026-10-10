# 04 — Current architecture and hosting

## Runtime that exists

VEYRIN is a small static HTML, CSS and browser JavaScript application backed by Node.js serverless functions on Vercel. It is not a Next.js, React, TypeScript, Neon or database-backed application.

- Browser surface: public/index.html, public/styles.css and public/app.js.
- Server routes: api/*.js, with shared code in lib/*.js.
- Static output: public. Vercel rewrites /chamber paths and /proof to index.html; the client selects the visible route.
- Local preview: PORT=48361 npm run dev. The port can be changed through PORT.
- Feasibility/build gate: npm run build.
- Targeted trust gate: npm run test:trust.

The deployed Vercel Preview uses Node.js 24.x serverless functions. The provider selector and credentials are read only by server code. Google AI Studio is the default (`VEYRIN_AI_PROVIDER=google-ai-studio`, `GEMINI_API_KEY`, `GEMINI_MODEL`); OpenRouter remains available with `VEYRIN_AI_PROVIDER=openrouter`, `OPENROUTER_API_KEY` and `OPENROUTER_MODEL`. No key is shipped to the browser. The current Preview has not yet been redeployed with this local provider change.

## Data and trust boundaries

Pre-event material is assembled in lib/data/load-pre.js from lib/data/pre-case.js and the live Bitget pre-cutoff candle. Only api/preflight.js and api/readiness.js load this packet for server routes. Agents receive only the signed pre-packet token and prior validated role tokens.

The post-outcome module is lib/data/post-outcome.js. Only api/reveal.js imports it, and that route verifies the receipt signature, canonical digest and case ID before asking the loader for the post-event Bitget candle. Do not move post-outcome imports into shared pre-analysis code.

Bitget instrument identity and candle validation live in the data adapter and lib/case-validation.js. Preflight checks the source policy and cutoff. Readiness is informational and never requests post-outcome prices. Invalid or altered receipts do not reach the outcome loader.

## Stateless stages and portable receipt

There is no configured database, durable run store or server-side seal persistence. Each route verifies signed stage tokens supplied by the browser. The receipt includes the pre-evidence and signed outputs and can be verified by the server while its HMAC key remains stable. The browser stores the current run in sessionStorage; leaving the session can discard it. Users can download a receipt, but there is no durable shared URL or server archive.

HMAC signing uses a derived key from the existing server-only OpenRouter key when present, otherwise from the Google key. This preserves current signatures while both credentials remain configured, but removing the OpenRouter key or rotating the signing source invalidates existing stage and receipt signatures. The signature is not a trusted timestamp or third-party notarization.

## Hosting and operational limits

Vercel is the only deployment target. Use the Vercel CLI for Preview deployments and inspect the resulting target and ready state. Do not promote to Production until the actual anonymous ATLAS → VEX → SEAL → verify → reveal path succeeds and the release gate passes.

The role endpoints have a best-effort per-warm-instance rate limit. Serverless parallel instances can each have a separate counter, so this is not a spend-control guarantee. Google AI Studio `generateContent` is the default route and OpenRouter Chat Completions is the explicit alternative. Both receive the verified packet directly without tools; output is limited to 1,200 tokens and 22 seconds. Failures remain visible and do not fall back to fixtures or another provider.

A successful build proves static checks and packaging only. It does not prove the model can complete a role call, the receipt can seal, or the post-outcome route works. See STATE.md for current environment results and blocked gates.

