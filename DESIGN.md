# VEYRIN — Product Design Contract · V3 light research workstation

**Implementation:** `design/light-workstation-v3`. Supersedes the theatrical broadcast UI proposal on this branch. Product trust boundaries and backend interfaces remain authoritative in `11_API_AND_SCHEMA_CONTRACTS.md`, `STATE.md`, and tests.

## Core design decision

Build a **serious, unmistakably useful research workspace**, not an editorial homepage or a three-character poster. Users must understand the *tool* within five seconds: examine dated sources, let ATLAS build the case, let VEX challenge it, let SEAL audit it, verify a sealed record, and compare real selected Bitget market observations.

The primary judge journey: **Home → workspace → inspect dated sources → see the three roles and explicit start controls → separate recorded study / evidence method**. The user can browse all of those pages without provider API calls. Launching a fresh investigation is separately gated by explicit user actions.

## Visual system

Light-mode native:
- Canvas `#F4F7F9`
- Panel `#FFFFFF`
- Section background `#F8FAFB`
- Ink `#172734`
- Muted `#637785`
- Hairline borders `#DFE7ED`
- Primary interactive teal `#067F8B`
- Cyan ATLAS `#168BAD`, coral VEX `#C56B55`, gold SEAL `#A37B29` — role identity accents, **not** stock-direction signals.
- Typography: locally licensed IBM Plex Sans for interface; IBM Plex Mono sparingly for figures, receipts and timestamps. Semibold 11–14px controls, readable 13–16px copy, proportional 30–62px hierarchy rather than 88px posters.
- Functional radii 7–12px; soft purposeful boundaries. No fake glass, gradients for decoration, magazine serifs, paper textures, neon glow, soft cream/beige editorial, huge uppercase page titles, or repeated character introductions.

## Page architecture

### Home `/`
First fold has a clear promise and an actual **UI composition**: research question, source library, three agent roles and explicit gate. The preview is labelled a non-live illustration of the actual workflow; no fake progress bars or fabricated transcripts. Next to that is the primary CTA opening the supported NVIDIA case. Secondary action opens the archived verified-run **summary**, without consuming API credits. A narrow factual metrics rail reflects actual implementation only. Bottom has four specific steps, not stacked slogans.

### Available investigations `/chamber`
One real case. Identified as NVIDIA Q2 FY2027 earnings dated 26 Aug 2026. Shows pre-cutoff, source count, market instrument and a direct workspace action. The case catalogue is static until a user explicitly checks availability; source eligibility is not asserted before validation. No decorative cards for hypothetical stock tickers. Case source list is inspectable.

### Research workspace `/chamber/nvda-2026-q2-fy27`
Compact working header and event cutoff stamp. Research steps form a real-state indicator tied to the existing request stages; a tab click by itself does not call the model. Three small portraits and roles, not giant theatrical characters. Event context, actual case facts, optional thesis input, explicit availability check and run button. Research transcript renders only genuine server-returned payloads, citations are source-linked, errors and retries visible. Dated source rail stays accessible at desktop width; mobile collapses natively, preserving keyboard semantics.

### Recorded study `/sample`
A *static documented run summary* intended for judges who should not have to buy API requests to see meaningful past results. RNVDAUSDT 209.63 → 207.262 USDT with measured −1.1296% over the selected completed candles. ATLAS 3 cited claims, VEX 2 minor challenges, SEAL supported 3 claims, and digest `d03b17a5016a9308fd6e6c17957277bab952b229a38faefe08d570621dab9309`, as recorded in earlier STATE notes. Display the provenance carefully: **not a fresh verification, not a replay of absent detailed messages**, not a continuous chart, not a return claim, and no proof of model blindness. Do not invent per-claim output or purported model transcripts.

### Market reveal `/chamber/nvda-2026-q2-fy27/reveal`
Still gated by the existing signed state. On valid user-triggered reveal, display two real Bitget 15-minute candle observations and the computed percentage, no made-up interpolated graph. Research assessment beside the data, source/limits below. Locked screen makes the required action clear. Do not automatically query market data on an ordinary page visit.

### Evidence & method `/proof`
Concise explanation of source timestamps, Bitget instrument validation, agent roles and signatures, plus true limitations. Actual receipt functions are user-triggered, and technical readiness is in an expandable appendix rather than global chrome. Provide a reviewer/developer block with the offline check commands and link to the recorded study.

## Motion and details
- Hover only changes a surface if that surface does something. Tight text-arrow grouping in buttons, links and case entries.
- Page entrance 280ms; selected agent state crossfade and focused outline; real stages update step indicator only after actual callbacks.
- No synthetic spinners while nobody is running a job; no invented progress percentages or animated price curves.
- Keyboard focus visible and accessible on all nav, roles, source links, disclosures and controls. Reduced-motion eliminates animations.
- One-column layouts from ~800px; 44px touch targets; scroll-free sideways at 320/375/390px.
- Clear visual labels for `catalogued` versus `verified` and archived sample versus newly produced signed record.

## Content voice
Write like a developer presenting something they actually built. Prefer:
- “Four dated documents”
- “Evidence cutoff: 26 Aug 2026 · 19:45 UTC”
- “No research recorded in this session”
- “Start a research session”
- “Two selected market observations”
- “Receipt verifies record integrity; it does not prove historical foresight”

Avoid marketing abstractions and empty drama:
- “Three minds. One market event.”
- “Hindsight last.”
- “The market responded.”
- Claims of autonomous trading, price prediction, universal multi-stock support, live alpha or phantom backtests.

## Approval / build boundary

Only frontend (`public/index.html`, `public/styles.css`, minimal `public/app.js` routing and display state) and direct-load rewrite for `/sample` change here. `api/`, `lib/`, credentials, tokens, validator logic and provider configuration are frozen.

Perform only offline source review, syntax check, accessibility and screenshot QA with routes to research and market providers blocked. No new investigation or model request. Do not push to `main` or Production until explicitly approved. Create a fresh Preview separately after review; do not substitute archived example data for a real live research run.

## Visual QA still owed

At least 1440x900 and 390x844 screenshots for `/`, `/chamber`, `/chamber/nvda-2026-q2-fy27`, `/sample`, `/proof`, and locked `.../reveal`. Check desktop source-rail density, typography, source links, readability, mobile overflow, documented sample labels, focus states and action affordances. Screenshots have **not yet been captured from this GitHub editing session**.
