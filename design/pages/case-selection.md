# CASE SELECT `/chamber`

**Job:** prepare one verifiable historical investigation and make the start action crystal clear, even to a non-trader.

## Desktop layout
Header includes breadcrumbs `Chamber / Choose a case`. Main panel split: left 60% large featured-case preview with company, event type, cutoff timestamp, data-eligibility explanation, portrait strip; right 40% `RUN BRIEF` with the real pre-event sources count, instrument `RNVDAUSDT` if same verified case, and 1 simple primary button. If only ONE case is available, **do not render fake filter dropdowns, multiple empty case cards, rankings, numbered investigations or artificial pagination**.

Exact content sections:
- `FEATURED INVESTIGATION` name derived from actual case metadata.
- Date/time of evidence cutoff and timezone.
- `EVIDENCE AVAILABLE`: true count and list of pre-cutoff sources with publisher/date; no later market movement.
- `THE QUESTION`: “What did the available evidence support before the selected market reaction?”
- A small `HISTORICAL RECONSTRUCTION` banner explaining that pretrained models may have outcome knowledge.
- `BEGIN INVESTIGATION` button and secondary `Inspect sources`. Do not request login or wallet.

A 3-agent assignment row explains *what will happen next*: ATLAS builds argument, VEX challenges cited claims, SEAL checks defensibility. This doubles as reassurance that it is more than chat.

## Interactive states
Ready; evidence not ready; offline; selected case details; no case; explicit Start; role-request-in-flight; error/retry. On Start show role state and lock double-submit; never trigger on page load. Never quietly regenerate on refresh. If there is a saved completed receipt, show `View saved result` separate from `Begin new investigation` and clearly distinguish whether it triggers AI calls.

## Mobile
One case panel followed by fixed-height source drawer and a visible primary button. Avoid footer-heavy regulatory information above CTA. No hidden second-action menus for basic flow.
