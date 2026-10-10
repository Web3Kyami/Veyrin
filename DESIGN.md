# VEYRIN — DESIGN.md · Cinematic research broadcast v2

**STATUS:** New binding visual contract. Supersedes early research-editorial visual treatment, but not product integrity or backend contract.

**STYLE ROUTER:** `DIRECTION: 7. Cinematic Sportsbook / Fight-Night` (from `adaptive-product-design/references/style-router.md`) **adapted ethically to investigative financial research:** broadcast typography, dramatic portrait staging, graphic rails and restrained live-data treatment. **No gambling metaphors, betting odds, fabricated trading performance or game-like claim accuracy.** Do not mix a competing editorial/SaaS direction.

## Product design read
> A theatrical but trustworthy evidence investigation for a first-time trader/judge, with dramatic three-character staging and a professionally designed control-room interface. Users choose one verified historical stock case, watch the roles perform independent jobs, inspect sources, then reveal authentic subsequent market movement. The visual hierarchy leads to the action—not to an essay about methodology.

**Visual dials:** DESIGN_VARIANCE 8, MOTION_INTENSITY 6, VISUAL_DENSITY 6 on landing / 8 inside chamber; denser evidence, not more cards.

## Identity
- Product: **VEYRIN** (not BLINDSPOT). Descriptor: `THE RESEARCH CHAMBER` small only where context helps.
- Verbal identity: confident, precise, plain English. Avoid pseudo-philosophy, slow editorial intros, buzzwords, prophecy language, "AI never sleeps" clichés.
- Hero promise: **“Three investigators. One market event. Then the reveal.”** This is a historical research reconstruction, NOT a real contemporaneous prediction.
- Role labels: **ATLAS — The Analyst**, **VEX — The Challenger**, **SEAL — The Auditor**.
- Distinctive visual motifs: 3-seat scene, central obscured market outcome shutter, timestamp/evidence strip, source ties, physical stamp/seal panel. Avoid generic glowing brain, robot heads, shapes pretending to be data.

## Design tokens — implement in existing `public/styles.css`
```css
:root {
  --bg: #08090C;               /* near-black theatre */
  --bg-raised: #11151B;        /* one elevation above canvas */
  --panel: #151A20;
  --panel-strong: #1D242B;
  --line: #303B43;
  --line-soft: rgba(223,232,237,.12);
  --text: #F7F5F0;
  --muted: #B0B7BA;
  --subtle: #79858D;            /* decorative metadata ONLY */
  --role-atlas: #70C8DA;
  --role-vex: #E37971;
  --role-seal: #F3B760;
  --positive: #A2D5BB;         /* positive verification, not stock gain */
  --negative: #F0908A;
  --display: 'Barlow Condensed', 'Arial Narrow', Impact, sans-serif;
  --ui: 'IBM Plex Sans', 'Segoe UI', sans-serif;
  --mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
  --max-content: 1380px;
  --radius-xs: 3px;
  --radius-md: 8px;
  --radius-stage: 14px;
  --motion-quick: 160ms;
  --motion-state: 330ms;
  --motion-reveal: 850ms;
}
```
Tokens are art direction, not an excuse to discard existing working status colors. Audit and map previous variables to these semantic roles, keeping readable contrast. Stock downward movement uses numerical `−` + arrow/down and text, never colour alone. Role accent colours are identity, not bullish/bearish signals.

## Fonts — fix actual loading
The deployed CSS names fonts but HTML snippet had no font import. Add legal Google Fonts stylesheet in `public/index.html` or self-host project-owned WOFF2 via `@font-face`, with good fallbacks and `font-display: swap`. Load `Barlow Condensed` weights 600–800, `IBM Plex Sans` 400–600, `IBM Plex Mono` 400–600. Font licensing must be verified. Do not just write font-family declarations then claim typography done. On UI-only QA screenshots inspect *computed* font family and loading status. No font files are bundled in this pack.

## Composition: HERO MUST BE A BROADCAST SCENE, NOT AN ARTICLE
1440px / desktop first screen:
- Header (64–72px): icon/VEYRIN left; `Chamber`, `How it works`, `Evidence` center/right; distinct `Enter the Chamber` action. **Remove "Refresh status" from global navigation.**
- Hero visible after header, near full-bleed dark scene ~620–690px high. **40% left** title/2-line explanation/CTA; **60% right** cinematic three-investigator scene around a masked stock-event core. No giant full-width centered headline / excessive word-count.
- Top micro-ribbon `MARKET INTELLIGENCE / HISTORICAL RECONSTRUCTION` (secondary). Hero title uppercase condensed 58–88px desktop; max three lines, not an editorial serif.
- A real `FEATURED INVESTIGATION` edge-rail near bottom of stage: instrument, source count/cutoff, unknown outcome icon, `VIEW CASE` action. **Never show post-event price on unrevealed preview.**
- One small factual status line near CTA: `Historical case · Outcome hidden until the research record is sealed`.
- Clear visual seam to next content; 1–2 considered sections below fold, not repetitive card sections.

Mobile 390px: header wordmark + accessible menu; headline 38–48px with intentional wrapping, 2-line explanation, single large CTA; no crushed triangle of characters. Stage becomes one primary active portrait above horizontal investigator portrait selector or 3 compact bust slots (never 3 tiny full images). Featured case visibly selectable; no horizontal overflow, no CTA underneath fixed bars.

## Signature agents — premium imagery, real roles
- Use separate original raster **PNG/WebP portrait busts** for ATLAS/VEX/SEAL, same camera distance and face size, same light direction and rendering finish. NO hand-drawn polygon SVG impostors, emoji avatars, random mismatched image-generator styles, stock images of unrelated people, placeholder gradients or portraits copied from Crossfire.
- Desktop stage: ATLAS upper-left, VEX upper-right, SEAL lower-centre/offset as a curated triangle; each has a large portrait panel and role strip. Do not make three equal rounded SaaS cards.
- Landing state: non-functional idle preview, clearly labelled preview; no fake streaming messages or animated fake accuracy stats. Stage UI during actual run highlights active role and evidence source; other roles remain visible.
- **SEAL verifies, not adjudicates market causation.** The actual deterministic validator/hash is the source of truth.

## Component design system
- `BroadcastHeader`: minimal nav and one action; status refresh moved to diagnostics under `/proof` only if relevant.
- `CaseSpotlight`: market event + source count, cutoff, Bitget instrument, case entry CTA.
- `InvestigatorStage`: positioned trio, central event shutter, role status accent, reduced-motion static fallback.
- `InvestigatorBadge`: name, specific task, current state (idle/working/validated/error). No pretend % complete.
- `EvidenceRail`: tight documented source list with timestamp/ID, click-to-inspect; default collapsed on mobile.
- `LiveTranscript`: ATLAS case/ VEX rebuttals / SEAL audit, only from actually validated saved output.
- `SealPanel`: checksum + what it means, show verified/contested claims.
- `OutcomeReveal`: two-point price comparator or real chart if enough data, claim assessment and explicit uncertainty.
- `MethodPanel`: readable evidence provenance, collapsible technical extras.
- No card on top of card on top of card. Prefer editorial *information clarity* without editorial *marketing aesthetic*: juxtaposition, large portrait scene, aligned data rows, hairline rules.

## Spacing and density
Spacing scale 4/8/12/16/24/32/48/64. Desktop 52–72px between major blocks; within control room use 12–24px. Public data text >=14px; body 16px. Border radius 3–8px on data surfaces; stage frame 14px. Button height >=44px. The portal should feel like a proper product, not a magazine.

## Motion limits
- Enter scene 400–600ms max; CTA actionable immediately.
- On real role progress: active portrait sharpens / edge lights, source ribbon shows citations; use the actual role response as the trigger, not elapsed fake percentages.
- VEX challenges: tasteful connection line to a specific challenged claim. SEAL: receipt physically seats into a dock; hash uses actual returned digest.
- Reveal: **one premium shutter/wipe ~850ms max**; never animate fake market candles. If only two price observations, display an honest two-point change, not an invented timeseries.
- No autoplay narration, constant particles, stock footages, scroll-jacking, blurred nebula, bouncing rounded buttons.
- `prefers-reduced-motion`: static immediate results, never missing info or actions.

## Anti-slop veto list
Reject: beige/paper/serif magazine hero; huge centered paragraphs; three equal "feature cards" underneath; randomly glowing circular robots; unreadable 10px labels; blue-purple glass gradients; a line drawing substituting for portrait artwork; busy role-gambling UI; false streaming thought bubbles; fake testimonials, data or judge badges; filler "Powered by AI" sections; exposed debug switch/refresh status on hero; primary UI dominated by `Proof` rather than an investigation action.

## Preserve truthful product claims
Historical replay only. A dated document packet is not proof the LLM had zero outcome knowledge via training. Hash proves integrity **since record sealing**, not advance timestamped prediction. A market price delta doesn't establish causality or profits. Never expose API secrets or providers in public UI. This is research assistance, not executing trades. UI rewrite must never bypass reveal gating.

## Signoff
At 1440×900 and 390×844 first screenshot, a fresh person should see: brand, what it does, *three recognisable characters*, real selectable case and primary CTA. Under 15 seconds they can explain the sequence. Visual capture must compare current vs redesigned at both sizes, with no AI or market-data calls; see `operations/NO_API_QA.md`.
