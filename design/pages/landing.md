# LANDING `/` — highest-priority redesign

**Goal:** make the product desirable and understandable in 5 seconds; convince the visitor to enter a real investigation. Not a research white paper.

## Desktop initial fold, 1440×900 concept
```
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│  VEYRIN / mark                     Chamber   How it works   Evidence          [ ENTER CHAMBER ]│
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                              │
│  ┌─────────────────── LEFT 40% ───────────────────┐ ┌──────── RIGHT 60% ──────────────────┐ │
│  │ HISTORICAL MARKET INTELLIGENCE               │ │  ATLAS        [CASE OUTCOME LOCKED]│ │
│  │                                              │ │  portrait         event core       │ │
│  │ THREE MINDS.                                 │ │            ───────────         VEX │ │
│  │ ONE MARKET EVENT.                            │ │                NVDA          portrait│ │
│  │ THEN THE REVEAL.                             │ │                              ┌───┐ │ │
│  │                                              │ │           SEAL portrait       │  │ │ │
│  │ Three independent roles examine dated       │ │         SOURCE 1   SOURCE 2      │ │ │ │
│  │ evidence before the market outcome appears. │ │         SOURCE 3   SOURCE 4      │ │ │ │
│  │                                              │ │                               └───┘ │ │
│  │ [ ENTER THE CHAMBER → ] [ HOW IT WORKS ↗ ]  │ │ [FEATURED CASE   | 4 SOURCES | LOCK]│ │
│  │ Historical reconstruction. No live trading. │ │                                         │ │
│  └──────────────────────────────────────────────┘ └─────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```

Not literal ASCII boxes in UI. Draw one composed scene with carefully placed portrait panels, layered event card and thin graphic connector paths that have meaning. The screenshot at 1440 width must show both all three investigators and the clear CTA *without scrolling*. Do not over-darken portraits.

## Visible strings — baseline copy
Eyebrow: `A MARKET INVESTIGATION ENGINE`
H1: `THREE MINDS. ONE MARKET EVENT. THEN THE REVEAL.`
Deck: `ATLAS builds the case. VEX challenges it. SEAL checks the evidence. Only then do you see how the market moved.`
Primary CTA: `Enter the Chamber`
Secondary link: `See how it works`
Microdisclosure: `Historical reconstruction · No trading or price prediction claims`
Scene central: `OUTCOME LOCKED` — this is the *preview* state, not evidence that any new run was sealed.
Featured case CTA: `Examine this case` with true case name, true instrument and true pre-cutoff source count from static/verified current app metadata. No spoilers.

## Interaction
- Primary CTA navigates to `/chamber` without calling any model.
- Clicking featured case selects that case and goes to prep; **no automatic role call**.
- Character focus on hover/keyboard briefly foregrounds name + actual role description; no synthetic dialogue or spinning indicator.
- Secondary link smoothly scrolls to 4-stage explainer; reduced motion jumps directly.
- Clicking small status/source labels opens static explanatory tooltip or evidence explanation; no `Refresh status` in header.

## Below the fold
A broad horizontal compressed flow, built like a broadcast rundown, with four steps and progress rails; not 4 giant identical rounded cards. Portrait-led role roster may follow, using larger meaningful agent art. Final proof strip shows `sourced data`, `challenged findings`, `sealed record`, and a plain-language limitation—only actual mechanisms, no invented statistics.

## Mobile 390×844
- Top 60px minimal header + hamburger.
- Copy first, with H1 wrapping in purposeful blocks (font 44/44 max), a readable 16px supporting line and 48px primary button.
- Hero stage immediately below with 3 cropped busts using intentional depth: center primary large, others smaller but identifiable. Alternative: tappable horizontal agent strip + selected large stage portrait if stage too cramped.
- Featured real case card is in the visible first ~1.5 screens; no unbounded blank areas.
- Hide only *decoration* on mobile, never the case action, investigation explanation or agent roles.

## Don't ship if
Only buttons are `Investigations`/`Proof`; no visible case; portrait assets are line drawings; headline is magazine-style essay; CTA only appears below fold; hero relies on hovering; background FX obscure reading; apparent live statuses are fabricated; frontend automatically runs an AI investigation on load.
