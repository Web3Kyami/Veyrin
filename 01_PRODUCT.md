# 01 — Product specification, thesis, and experience

## Positioning
Name: **VEYRIN**. Feature name: **Research Chamber**. Human hook: **"Would your explanation still make sense before you knew the ending?"**

### User story
A tokenized U.S.-stock trader sees a company's financial event and reads confident online narratives afterward. The trader wants to recognize hindsight explanations, test their own rationale, and learn the specific evidence that would have mattered before the movement. VEYRIN stages a disciplined, sourced pre-event assessment, preserves it, then compares with genuinely recorded market reaction. It offers an auditable checklist for subsequent real trades without giving a trade recommendation.

### What people can do
1. Pick a supported historical event card, each with company, event type, market, official event date, and pre-event cutoff.
2. Read a 60-second event intro. Optionally enter a one-line personal thesis (e.g. "Demand momentum outweighs valuation concerns") with explicit label "Your hypothesis".
3. Launch investigation. ATLAS constructs case; VEX challenges; SEAL audits permitted references, flags unknowns and commits a final assessment.
4. Inspect each argument with source links, timestamps, scope, and supporting/refuting claim IDs.
5. Reveal measured price reaction and post-event facts, with controlled comparison to the sealed dossier.
6. Read a *Trader's Takeaway*: why one tempting argument was weak, how uncertainty should be stated, what signal to monitor in future. Export/share verified docket where backend storage exists.

## What makes this distinctive
A normal research chatbot knows the ending and can produce persuasive retrospective reasoning. VEYRIN externalizes the sequence: date-filtered evidence → adversarial role separation → immutable pre-reveal evidence docket → measured market reaction → explicit contradiction/uncertainty map. The focal interface is a theatrical 3-seat investigation chamber, not a standard chat window.

## Principal metric / demo promise
Not prediction accuracy or backtested alpha. Measure: evidence retrieval completeness, unsupported claim rejection count, replay completion rate, median research duration, judge ability to verify a source, and outcome comparison consistency. Honest numbers only; no imaginary user studies or usage counts.

## Primary walkthrough, screen by screen
**Landing /:** Strong dark broadcast hero; one-sentence research hook; central event preview; CTA "Enter the Chamber"; three agents explained; 3-step proof; actual trace/evidence examples; how it works; no login. Use a visible replay disclaimer before launch.
**Case selection /chamber:** Curated event hero, company symbol, event date, cutoff date/time, source count, market sessions covered, intro, optional thesis input. Event cards show availability tags: READY / LIMITED / NOT READY, never claim active data until checked.
**Investigation /chamber/[caseId]:** Three portraits around central event subject; current speaking agent visually emphasized; changing progress based on *actual completed model requests*, not timed fake dialogue; below arena, transcripts and evidence rail; stage progress ATLAS → VEX → SEAL. Users can drill evidence, toggle readable/full transcript, skip motion. Failures show explicit retry and never hide the status.
**Seal:** Both the short executive stance (supported/contested/unknown) and role differences; seal ID/hash, publication cutoff and excluded-after-cutoff counter; verified source count; specific missed risk the audit found. Clear button "Reveal What Happened".
**Reveal /chamber/[caseId]/reveal:** Scene changes from locked/noir to measured price display; before/after labeled observation windows; real, sourced underlier and Bitget market observations separately; divergence and outcome not conflated; compare to pre-reveal thesis + VEX challenge; lesson and citations. No claim this result validates trading profit or cause.
**Proof /proof:** Judge-friendly live example; how to verify docket hash, event sources and market observations; limitations and reproducible commands/requests; what is real, what is pre-recorded, what is not built.
**Case directory /cases** (P1): cases with event dates and readiness; otherwise landing directly to one curated case.

## Three-character purpose
ATLAS works from permitted facts, forms a reasoned hypothesis and names falsifiers. VEX searches for assumption failures, alternative interpretations and missing data. SEAL checks claims/citations, outputs supported/contested/unresolved and binds it into a pre-reveal structured docket. No voting gimmick. No forced majority.

## Examples of final insight (illustrative ONLY)
> "The selected company's prior guidance was verifiable, but historical analyst-consensus estimates were not available at this timestamp. ATLAS's bullish rationale leaned on an unsupported market expectation; VEX flagged the gap. Subsequent prices moved X% over the measured window; that outcome does not by itself prove the market's reason. Next time, obtain timestamped consensus before treating an earnings beat as a surprise."
This example must never appear with a numeric X as real data unless the evidence pipeline supplies it.

## Language and trust rules
- Prefer "suggests", "consistent with", "contradicts claim", "unknown" over "caused", "proved alpha", "guaranteed".
- UI must say "Historical reconstruction — not a genuine historical live prediction" when replaying a past event.
- Distinguish company's underlying NYSE stock from Bitget-traded representation, spot vs derivatives and issuer specifics; don't combine returns as if equal units.
- If market is closed, show session CLOSED/last quote timestamp and never brand stale quote as live.
- Show missing data prominently; absent analyst expectations is not a 0% consensus.
- No magic risk scores without a transparent method; no unsupported confidence 97.2%.

## Accessibility and safety
- Keyboard accessible; no essential info solely within a canvas/video or sound.
- Reduced motion mode substitutes static portraits and stage indicators.
- Mobile displays agent panels and source rail without horizontal overflow.
- Never request wallet keys, private API tokens, investment balances or trading authorization.
- Acknowledge study purpose; no financial advice.

## Out of scope for S2
Live agent wallets, strategy execution, social profiles, portfolios, profit charts, subscriptions, notifications and real-time outcome-watch daemons. No claims that the product automatically made a trade or will improve returns.

## Success criteria
Skeptical reviewer can: identify the cutoff; name at least one ATLAS fact and a VEX challenge; inspect source published time; trigger Seal and verify hash; review authentic market reactions and the disclaimer; compare before/after; and do it without creating an account.
