# VEYRIN — Light Research Workstation (V3) / UI Implementation Plan

**Status:** proposal and implementation checklist. Not Production-ready. This replaces the theatrical/fight-night UI direction for new frontend work but does **not** supersede the working API, security contracts or the truthful historical-replay limitations.

## Non-negotiable constraints
- Work on `design/light-workstation-v3` only until owner reviews screenshots. Do not change `main` or deploy Production.
- No AI inference, Google AI Studio, OpenRouter, Bitget, market-data requests, readiness probes, live preflight, or reveal requests during visual redesign or QA. Only static/local frontend inspection and permitted offline checks.
- Do not change `api/`, `lib/`, tokens, receipt/signature logic, provider configuration, existing request/response contracts, or evidence cutoff rules.
- There is **one** implemented case: NVIDIA FY2027 Q2 earnings (`nvda-2026-q2-fy27`). Both frontend and validation explicitly bind it. No artificial case browser, dummy stock results, invented charts, fake agent dialogue, imaginary verified outcomes, simulated PnL or marketing claims implying multi-stock support.
- The past end-to-end run (digest `d03b17a5016a9308fd6e6c17957277bab952b229a38faefe08d570621dab9309`; RNVDAUSDT 209.63 → 207.262, observed −1.1296%) is a documented historical sample, not a new run and not proof of thesis accuracy or timestamped prediction. Full agent transcript is not currently a durable shared-run artifact; never present invented content as a saved transcript.

## Visual thesis
A light, precise **financial research workstation**, not a white adaptation of the current cinema/broadcast stage. Think usable software first, strong visual distinction through custom instrument/timeline/provenance components and polished agent interactions. Avoid editorial poster headlines, huge decorative portraits, paper textures, excessive labels, generic purple gradients, glassy card soup and gimmicky scrolljacking.

Working tokens to verify visually: canvas `#F6F8FA`, surface `#FFFFFF`, ink `#172631`, muted `#63727D`, lines `#DFE6EB`, action `#087D87`; ATLAS cool cyan, VEX warm coral, SEAL muted gold only as role accents. Prefer existing locally licensed IBM Plex Sans/Mono for readable utilitarian hierarchy. Use a compact numeric scale and clear information density. No hard dependence on new remote fonts or image services.

## Information architecture and specific work
1. `/` **Home / product overview**: compact navigation with `Research`, `Results`, `How it works`, `Evidence` where these actually navigate; one short value proposition, one functional product-preview composition (not fake live activity), current available case directly visible, action `Open NVIDIA investigation`. Show one real short result/provenance fact only if labelled `previously verified sample` and avoid revealing outcome on a page presented as pre-reveal.
2. `/chamber` **Available investigations**: make single-case scope clear, not pretend there is a stock screener. Case row shows NVIDIA, FY2027 Q2, pre-event cutoff and source count. `Open case` goes to existing fixed route. Secondary evidence disclosure should be collapsible and useful.
3. `/chamber/nvda-2026-q2-fy27` **Workspace**: compact contextual title and case overview; left rail of dated evidence with publisher and precise timestamp uncertainty; central question / stage / source-backed findings; right panel or lower region for the three named agents as 40–56px avatar identity chips, status and real per-stage output. After users explicitly initiate real steps, render only genuine returned messages. Distinct preflight/ATLAS/VEX/SEAL/seal states; initial page browsing must remain API-free.
4. `.../reveal` **Observed result**: show the two genuine time-anchored Bitget observations and computed percentage; no invented continuous price curve between two samples. Separate *observed market movement* from *research assessment*, causal claims and limitations. The underlying reveal remains gated by genuine sealed token; no static fixture is served as a real receipt.
5. `/proof` **Evidence & verify**: human-readable source provenance, cutoff logic, verify capability with existing user-triggered control, and a concise technical appendix including API overview / repo link / honest limits. Avoid developer jargon above the fold. Separate prior recorded example from verification of a live user-supplied receipt. Keep reproducible commands in README and optionally link them here.
6. Optional `/for-judges` only if it offers a distinct useful 60-second guide, not recycled marketing copy; otherwise include a focused `Judge guide` section in Evidence to avoid needless pages.

## Interaction contract
- Hover reveals an action only where actionable; keyboard/focus parity and reduced motion are mandatory.
- Clicking source opens its details and source URL without navigating away unexpectedly; maintain focus/scroll position.
- Role changes emphasize the active agent but do not trigger model calls by themselves. Use event-driven transitions after a genuine response, never fake progress or pretend to simulate activity.
- Arrow icons adjacent to their action text, never shoved to far edge. No decorative ordinal 01/02/03, no repeated role descriptions, no oversize all-caps essays.
- Mobile: case action immediately visible, single-column readable source list and results, no stacked giant portraits or hidden primary CTA; 44px touch targets.

## Implementation sequence
A. Inventory current `public/index.html`, `public/styles.css`, `public/app.js`, `public/case-sources.js` and screenshot fixtures. Map all IDs/data attributes required by app.js before replacing markup.
B. Redesign semantic markup and CSS; leave network methods and stage request flow unchanged; adapt any DOM selectors only as required to preserve controls. Retain original portraits but crop them down into role components.
C. Inspect responsive views, keyboard/focus, idle, locked and recorded-UI-fixture states with **all external/network routes blocked**. Screenshots must be clearly labelled local/static for any injected fixture. No provider/network tests.
D. Record visual decisions in `docs/DESIGN_LEDGER.md`, update `DESIGN.md` for new binding direction, and document caveats in README.
E. Offer the branch for owner review; no Production deployment. Preview deployment only after owner permission; it may load ordinary public frontend assets, but never trigger an investigation.

## Acceptance standard
On desktop or mobile, a visitor understands what VEYRIN does and how to open the one real case within ~5 seconds. Inside the workspace they can identify source, agent, claim/challenge/audit, reveal gate and provenance, with no misleading claims about live prediction or unsupported cases. The visual system feels like actual software designed by a competent financial-dev team, not an AI-generated editorial pitch.
