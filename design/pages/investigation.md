# THE CHAMBER `/chamber/<caseId>`

**Job:** see independent research, confront challenges and understand evidence. This is the core product, not a debug console.

## Desktop 1440×900
- Header breadcrumb + ticker/company/event + one small status badge; no duplicate page title block.
- 12-column stage: ~8 columns `InvestigatorStage` + ~4 columns source rail. Stage height bounded ~480–560px so transcript begins close to first fold; no massive empty panel.
- Stage composition: ATLAS top left, VEX top right, SEAL bottom offset; real original portraits, lit according to role status. Central element shows event subject and **outcome still hidden**.
- Inside stage, role name+function, output status and one *real* sentence pulled from validated result. If nothing yet, show descriptive idle duty text, not invented research output.
- Right rail: clickable source titles, publication times, pre-cutoff eligibility and real IDs. Each cite from claims can focus a source in this rail.
- Below stage: stacked `Research` / `Challenges` / `Audit` views tied to the actual roles, with visible cite chips and one-line summary plus expand detail. Avoid raw JSON dumps.
- Seal docking panel appears ONLY after real successful SEAL + deterministic checks. Show hash and what it verifies; dominant Reveal action.

## Work choreography
- Start (user explicit) → ATLAS active cyan → validated claims → VEX active coral with challenges → SEAL active warm gold → deterministic gate. A failed phase freezes its visual state and displays genuine failure/retry.
- Stage responds to state callbacks already provided in `public/app.js`; do not create a second orchestration source of truth. No fake timed "analysing source 1/4" unless actual source count/state supports it.
- Tabbed transcript must preserve full texts and role linkage. Human can read all evidence even when cinematic stage animation is off.
- Receipt controls `View receipt`, `Copy digest`, `Verify saved record` use already-available stored data; do not recalc by calling paid provider.

## Mobile 390×844
Top event strip, next the three roles as selectable 48px-min controls with cropped photo, name and real status; one larger central active portrait pane. Evidence collapses into accessible bottom sheet. Transcript directly follows active pane; changing tab updates focus and accessible label. Reveal sticky CTA only when sealed; do not let it cover content.

## Failure states
An agent fails → its seat shows explicit `Could not complete`, evidence stays, no synthetic speech. API rate limited → clear non-sealed status and recovery instructions, NO automated repeated retry. Invalid claim/source → visible SEAL caveat and no reveal. Refresh should preserve previously saved state if supported by app; no new request automatically.

## Asset/render details
Portraits must read at 120px and 240px widths. Never show the old `public/agents/*.svg` as the default characters after the final art is installed. Use `object-fit: cover` and authored crops per role, not uniform CSS masks that cut off heads.
