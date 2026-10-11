# VEYRIN

**Market research deserves a second opinion.**

VEYRIN runs a historical research case through three different AI roles. ATLAS builds the sourced thesis. VEX challenges the claims. SEAL audits the evidence. The server validates and seals the research before allowing the selected Bitget market comparison.

The first supported event is NVIDIA fiscal Q2 2027 earnings. VEYRIN is currently a research prototype for that event. It cannot establish a contemporaneous forecast because the model may have learned the historical outcome during training.

## Requirements and setup

- Node.js 22 or newer
- npm
- No third-party package install is needed for the current implementation

```sh
cp .env.example .env.local
npm run dev
```

Open <http://127.0.0.1:3000>. Browsing the landing, case, chamber and Evidence routes does not call research or market APIs. Availability checks, investigations and reveal requests are explicit user actions. Do not add credentials to browser code or commit `.env.local`.

To start a new investigation, configure a server-side AI provider. For the intended Qwen submission, select OpenRouter and your chosen Qwen model ID:

```dotenv
VEYRIN_AI_PROVIDER=openrouter
OPENROUTER_API_KEY=your_server_side_key
OPENROUTER_MODEL=qwen/your_chosen_model
```

The backend also supports an earlier provider adapter, but it does not switch providers silently. The previous completed run is not a verified Qwen run. Bitget market observations come from server routes when a user explicitly checks availability or requests a verified reveal.

## Architecture

- `public/` contains the responsive interface, local portrait and font assets, and client-side navigation.
- `api/` contains Vercel Node.js serverless routes for readiness, preflight, ATLAS, VEX, SEAL, receipt verification, and post-event reveal.
- `lib/data/pre-case.js` and `lib/data/load-pre.js` build the pre-event evidence packet. `lib/data/post-outcome.js` is imported only by `api/reveal.js`.
- `lib/openrouter.js` handles the explicitly selected model provider. `lib/case-validation.js` checks sources, citations, and market observations. `lib/receipt.js` and `lib/security.js` canonicalize and sign the sealed record.
- The current design revision and release README are being prepared on the `design/agent-led-v4` branch.
- `tests/` contains trust-boundary, provider-configuration and evidence validation checks.

The server keeps provider credentials out of browser code. It validates citations and role output deterministically, then seals a canonical receipt with SHA-256 and an HMAC-derived signature. The reveal route verifies the record before it loads post-event market data. The receipt is portable, but there is no database or durable shared-run URL. Changing the signing source can invalidate older signatures.

## Case and evidence boundaries

The currently supported case is NVIDIA fiscal Q2 FY2027, August 26, 2026. Its evidence cutoff is 19:45 UTC. The pre-event packet includes four dated sources and a Bitget Reality SPOT 15-minute candle; the selected reveal window is 20:30 to 20:45 UTC. Timestamp precision is preserved as published. Current instrument identity and candle values are checked at runtime. See [case provenance](data/cases/nvda-2026-q2-fy27/EVIDENCE.md).

## Checks

```sh
npm run build
npm run test:trust
```

The build check validates the local static assets, viewport, brand and pre/post route boundaries. The trust suite covers source cutoff eligibility, citation rejection, Bitget candle identity and windows, role shape, receipt tampering and the pre/post import boundary. These checks do not call live providers. A real investigation requires explicit UI actions and configured server credentials.

## Vercel deployment

The existing project is linked in `.vercel/project.json`. Authenticate the Vercel CLI, then create a Preview deployment:

```sh
vercel deploy . -y
```

This command creates a Preview. Production deployment is separate and requires explicit owner approval:

```sh
vercel deploy . --prod -y
```

Configure only the selected provider's variables in the Vercel project settings. Keep credentials in Vercel's server-side environment configuration. Do not put them in repository files.

**Current status (October 2026):** the UI v2 and final visual cleanup are deployed to Preview at [veyrin-research-chamber-ql8gm4430-web3kyamis-projects.vercel.app](https://veyrin-research-chamber-ql8gm4430-web3kyamis-projects.vercel.app). Production has not been deployed. The `design/agent-led-v4` branch contains the newer release candidate and detailed documentation.

## Sources and rights

Market facts link to NVIDIA Investor Relations, SEC EDGAR, S&P Global Market Intelligence and Bitget. VEYRIN's three fictional investigator portraits were generated for this project with owner authorization. Portrait provenance is in `public/assets/agents/manifest.json`. Barlow Condensed and IBM Plex are bundled with their SIL Open Font Licenses. This project is MIT licensed; see [LICENSE](LICENSE).
