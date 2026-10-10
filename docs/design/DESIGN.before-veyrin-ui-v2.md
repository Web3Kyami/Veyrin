<!-- CANONICAL SOURCE OF VISUAL TRUTH: DESIGN.md. Page details live in design/pages/. -->
# 05 — DESIGN.md: VEYRIN visual system and motion choreography

## Direction record for the implementation
**DIRECTION: 3 — Research Workbench / Restrained Financial-Tool.** The interface is an evidence workbench whose numbers, timestamps and citations carry the story. This fits better than institutional fintech minimalism because the main task is comparing competing research claims, not completing a financial transaction. The graphite palette, source rail and three-role stage preserve VEYRIN's established identity.

Implementation parameters: `DESIGN_VARIANCE: 5`, `MOTION_INTENSITY: 4`, `VISUAL_DENSITY: 7`. Rules and alignment create structure; use containers only where a distinct state or interaction needs one. Motion belongs to role focus and the seal/reveal transition, never to decorative chrome. Keep text, source time precision and semantic role colors legible at mobile widths.

## DESIGN LOCK — original visual identity inspired by Crossfire's *behaviour*
**Creative direction:** "Midnight evidence broadcast" — a market research war room with original investigators, not a football arena or a generic AI SaaS dashboard. Reference: Nerom Crossfire's WarRoom transcript sync, multi-seat stage and active speaker aura. **Do not copy its character artwork, logos, trophy, source code, exact palette, slogans or marketing layout wholesale**; its repo does not expose a repository-wide licence. Re-implement mechanisms and compose new assets.

The goal is judge memorability through purposeful interface dramaturgy: *evidence is gathered → opposing views confront → a record is sealed → the market opens.* Each interaction advances the product's claim.

## Brand grammar
- Brand uppercase **VEYRIN**, uppercase technical micro-labels, humane explanatory copy.
- Hero headline candidate: **"What did the evidence say before the market answered?"** Avoid promising genuine historical prediction.
- Agent labels: ATLAS // Research Analyst, VEX // Countercase, SEAL // Evidence Auditor.
- Product lexicon: Evidence window, Case, Chamber, Challenge, Seal, Reveal, Verified source, Unknown, Market reaction. Avoid casino/war/betting language.

## Palette (authoritative starting tokens; adjustable in design ledger)
```
--ink-950: #080C11;     // canvas charcoal blue-black
--ink-900: #0D131B;     // panels
--ink-850: #121B25;     // elevated panels
--ink-700: #25313D;     // technical borders
--text-100: #F0EEE8;    // near-warm white
--text-400: #9CA6AC;    // secondary
--amber: #E9A85C;       // seal, pivotal action, primary accent
--ice: #85CAD8;         // sourced, analytical / ATLAS
--coral: #D87573;       // adversarial / VEX, issue
--sage: #91BC9E;        // verified state (not speculative finance gain)
--gold-muted: #9C814B; // decoration only
```
Avoid random blue/purple gradients, generic glass, entire page of identical rounded cards, fake candlestick sparkline backgrounds. No gradients as a substitute for layout. Use light texture/noise only if optimized and contrast-safe. Red/green never exclusively encode stock direction.

## Typography
- **Display:** `Syne` (distinctive geometric, slightly condensed); 700–800 hero and numbers.
- **Body:** `IBM Plex Sans` (legible, professional), 400–600.
- **Mono:** `IBM Plex Mono` for timestamps, hashes, market symbols and evidence labels.
- Fall back to local sans/monospace; preload/font-display swap via next/font; do not ship font files separately.
- Scale: 12px micro, 14px meta, 16px body, 19–22px section, 32–42px panel title, 54–76px desktop hero, 38–48px mobile hero. Avoid tiny 10px text for crucial information.

## Composition fundamentals
**Desktop wide:** fixed header 76–88px. Marketing content grid max 1320px. Chamber stage 55–65% central region, documentary source rail on right (28–34%). Three agent seats form a triangular constellation around glowing *event core*, not a literal pentagon. Agent seat shows portrait, name, role, stage state and active data receipt. A source rail includes highlighted citations bound to currently speaking agent. Below main fold a structured transcript + evidence table, never hidden behind a full-screen visual.

**Mobile:** change layout, don't scale canvas mindlessly. At top case title + current stage, horizontal compact agent chips (3), single central active portrait/event card, readable transcript below, source cards in a bottom sheet; sticky Reveal button only once sealed. Avoid 3 full character portraits crammed into 390px.

**Hierarchy:** event question → evidence window / time → agents at work → claim vs rebuttal → seal → observed outcome. This hierarchy must survive animations turned off. Empty/failed states never leave a large hollow black panel.

## Agent portrait art bible
Original character identities (not copied):
- ATLAS: methodical researcher, refined visor/glass instrumentation motifs, desaturated ice-blue edge light, angular but calm facial silhouette, no cowboy/robot clichés.
- VEX: forensic challenger, sharp coral light cut, asymmetric hair/hood/jacket or abstract humanoid, skeptical posture; no villain trope, optional female-presenting original character.
- SEAL: neutral impartial archivist, warm amber halo/faceplate with subtle concentric inscription forms; not a mystical oracle guaranteeing truth.
All three coherent same renderer/material/lighting, bust portraits with transparent / removable dark backing, 4:5 source ratio, min 1200px tall; consistent face size/eye line. Supply separate poster crops and mobile avatars. User rights/asset source must be logged; never lift Nerom's existing portraits.

## Choreography / animation ledger
1. **Entering chamber:** dark lens aperture opens (~450–650ms), event core snaps into focus; allow `prefers-reduced-motion` bypass.
2. **ATLAS active:** ice edge brightens, source rail accents relevant cited sources; real agent output appears only on validated response.
3. **VEX interruption:** brief directional line from VEX seat to disputed ATLAS claim, coral label "CHALLENGE #..."; may show multiple challenges not a forced vote.
4. **SEAL stage:** all three positions fixed, center shifts to documentary seal stamp; hash formed from real digest returned by server; never invent changing hexadecimal animation that looks like final hash.
5. **Reveal:** center shutters separate showing actual timeline; event cutoff line drawn before observed later candles; measured data linked to provenance; optional tasteful low-frequency particle effect.
6. **Error/offline:** animation freezes, stage explicitly failed with retry, never simulates thinking indefinitely.

Motion budget: 150–650ms for UI interactions; one intentionally dramatic 800–1100ms reveal maximum; no endless page-filling motion. Prefer CSS transforms and a single lightweight canvas2D center illustration; GSAP not necessary. Drop expensive effects first if mobile perf weak. Keyboard users must receive equivalent focus changes and ARIA live updates.

## Major component contracts
`ChamberArena`: props stage enum, agent outputs, activeRole, isReducedMotion, dataSourceCount, date cutoff; renders original positions/connecting rays; visual-only, aria-hidden for decorative canvas.
`AgentSeat`: portrait, role, status `IDLE|WORKING|COMPLETE|FAILED|CHALLENGE|CONCEDED`; no fake percentages. Role status comes from server job state.
`StageTranscript`: actual JSON-sourced summary/citations, one turn per verified role; optional streamed text only when actual provider supports it.
`SourceDrawer`: evidence ID, full source title, publisher, publication time, cutoff eligibility, URL, claim links; safe external anchor; loading/error.
`SealReceipt`: copyable hash, version, sealedAt, source count, warning "Hash confirms record integrity since sealing; not contemporaneous proof."
`BeforeAfterSplit`: the pre-reveal verdict immutably on left, observed market reaction and a cautious comparison on right.
`ReactionChart`: timeline with true prices/UTC and ET labels; empty state rather than fake bars; mark underlying vs Bitget separate series, no double-axis deception if units differ.

## Every page visual specification
### `/` — Landing
Header logo / The Chamber / How it works / Proof / Start; hero left narrative (~55%), right interactive dormant case vignette with three agent small portraits and a locked center label (not a mock trade result); proof breadcrumb; one featured READY event; 3-role explanation; how the chronological constraint works; real vs speculative disclaimers; CTA. Real links only.
### `/chamber` — Case Select
Compact large title, featured case card with cutoff and actual evidence count; optional user thesis input; research source readiness indicator; launch button. No 6 empty placeholder cases.
### `/chamber/[caseId]` — Stage
Focus stage: centered company event + triangular agent portraits and crisp role summaries; active role narrated in accessible transcript; right source ledger; beneath a conclusion timeline. No need for large sidebar in this route.
### Seal within Stage
Audit card expands under stage: supported/contested/unresolved counts computed from actual claims, final checklist, digest panel, real "Reveal" button.
### `/chamber/[caseId]/reveal`
Rich pre/post split with event-source panel, 1–2 honest line/candle charts (if backed by sufficient data), delta summary, claim-by-claim support table, prominent "What this proves / doesn't prove" note; small outcome-share graphic created from actual recorded values (optional).
### `/proof`
Evidence ledger, reproducibility walkthrough, raw record download, versioned hash verification, Bitget source mapping, limitations and known failures. Judge can get confidence without watching a video.
### 404/error
Friendly noir empty view, original art motif, return to Case Select.

## Contrast and usability acceptance
- At 375/390/768/1280/1440 widths no horizontal page overflow.
- Main text WCAG AA contrast; color-coded stage also labelled.
- All dialogs focus-trapped, Escape to close, focus returned.
- Major action accessible with keyboard only; skip link; visible focus ring.
- Motion reduced-mode no essential effect missing; no autoplay audio.
- Charts offer tabular numbers and source links for screen readers.
- Agent portraits never substitute for displayed findings.

## UI anti-patterns / specific NOs
Generic Inter + lilac gradient homepage; floating six cards without hierarchy; blue-glass dashboards; template dashboards with fake revenue metrics; large empty on-air stage with no substance; decorative fake agent messages; huge page sections that duplicate the same pitch; emojis as primary product iconography; 3D gimmick replacing data integrity; multiple inconsistent orange/red/green meanings; excessive bloom obscuring charts.

## Signoff checklist
Screenshot each desktop/mobile page, annotate all reference-specific design decisions in `docs/DESIGN_LEDGER.md`, confirm stage screenshots correspond to actual valid run. If visual direction starts resembling literal CROSSFIRE (football/glowing pentagon/agent names), replace with original chamber-specific elements.


## Explicit skills and reference execution
Use `16_SKILL_ROUTING_AND_DISCOVERY.md` and `19_REFERENCE_IMPLEMENTATION_MAP.md`. Load actual `kyami-product-design`, `adaptive-product-design`, `design-md` and `ui-reference-loop` during design; original artwork slots are in `18_PORTRAITS_AND_BRAND_ASSETS.md`. Apply the original dark research-chamber visual system consistently. When page-specific docs conflict, `DESIGN.md` wins for brand identity.
