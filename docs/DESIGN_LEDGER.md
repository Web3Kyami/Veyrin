# VEYRIN UI overhaul review

Local visual candidate, 2026-10-10. Awaiting owner approval. No Preview or Production deployment.

## Direction and user job

DIRECTION: 7. Cinematic Sportsbook / Fight-Night, adapted to evidence-led historical research. This replaces the earlier workbench direction with the owner-supplied v2 contract. The primary visitor is a research-curious trader or judge. Their first action is to choose the NVIDIA case, inspect its dated sources, and enter the chamber. Entering does not start the research flow.

The visual thesis is a three-investigator broadcast: cyan ATLAS builds the case, coral VEX challenges it, amber SEAL audits evidence support. The outcome is visually withheld until the existing signed-record gate permits reveal. Role identity colours do not communicate stock direction. No gambling copy, simulated dialogue, invented chart points or false live status.

## What changed and why

| File or group | Change |
| --- | --- |
| `public/index.html` | Broadcast hero, prominent case rail, mobile menu, chamber role selector, case entry before expandable source detail, curated Evidence copy, readable seal and reveal layout. Existing route/view and control IDs retained. |
| `public/styles.css` | v2 colour/type tokens, asymmetric investigator scene, responsive portrait presentation, reduced-motion rules, accessible focus and selected states. |
| `public/app.js` | UI navigation/focus, mobile menu, portrait selection tied to real role callbacks, native transcript disclosures, explicit availability/reveal/verify actions. Research request bodies, validators and token formats unchanged. |
| `public/case-sources.js` | Static catalogue copied from the already saved pre-event packet. Labels say CATALOGUED until actual checks occur. Contains no outcome, market price or signed token. A restored pre-packet retains its own source list and verified eligibility labels. |
| `public/assets/agents/` | Three original generated investigator portraits and matching 240px WebP thumbnails. Manifest includes exact dimensions, byte sizes and provenance. |
| `public/assets/fonts/` | Locally bundled Barlow Condensed and IBM Plex fonts, with their SIL OFL licenses. No remote font request on page load. |
| `DESIGN.md`, `design/pages/*.md` | Adopted the supplied v2 visual contract and corresponding route specifications. The previous identity is retained at `docs/design/DESIGN.before-veyrin-ui-v2.md`. |
| `README.md`, `STATE.md`, this ledger, skill log | Updated asset provenance, explicit availability behavior, actual offline QA and remaining limits. Prior successful backend evidence retained. |

Removed the public configuration/readiness strip from the landing. Diagnostic availability detail is now an explicit, collapsed Evidence appendix. Browsing no longer triggers readiness checks, receipt verification or market reveal. The existing user-triggered investigator, seal, verification and reveal controls are retained. No server API handler, data loader, provider configuration, environment or receipt was edited.

## Baseline inspected

Inspected the actual existing desktop/mobile landing screenshots, chamber desktop, and locked reveal desktop under `screenshots/current-preview/` before editing. Captured a further API-blocked local landing baseline at 1440x900 and 390x844. Observed tiny outline avatars, unsupported font family declarations with no loaded font faces, a dominant paragraph-like heading, and public provider configuration details.

- Before desktop: [local baseline](screenshots/ui-v2/baseline-landing-desktop.png)
- Before mobile: [local baseline](screenshots/ui-v2/baseline-landing-mobile.png)
- Existing chamber: [desktop](screenshots/current-preview/investigation/desktop.png), [mobile](screenshots/current-preview/investigation/mobile.png)

## Final visual captures

All captures are local, with APIs and external requests blocked. Viewport PNGs use device scale factor 1; full-page variants retain the same CSS viewport width.

| Route/state | Desktop | Mobile |
| --- | --- | --- |
| Landing | [1440x900](screenshots/ui-v2/landing-desktop.png), [full page](screenshots/ui-v2/landing-desktop-full.png) | [390x844](screenshots/ui-v2/landing-mobile.png), [full page](screenshots/ui-v2/landing-mobile-full.png) |
| Case selection | [1440x900](screenshots/ui-v2/case-desktop.png), [full page](screenshots/ui-v2/case-desktop-full.png) | [390x844](screenshots/ui-v2/case-mobile.png), [full page](screenshots/ui-v2/case-mobile-full.png) |
| Investigation, idle | [1440x900](screenshots/ui-v2/investigation-desktop.png), [full page](screenshots/ui-v2/investigation-desktop-full.png) | [390x844](screenshots/ui-v2/investigation-mobile.png), [full page](screenshots/ui-v2/investigation-mobile-full.png) |
| Reveal, locked | [1440x900](screenshots/ui-v2/reveal-locked-desktop.png) | [390x844](screenshots/ui-v2/reveal-locked-mobile.png) |
| Reveal, recorded-data UI fixture | [1440x900](screenshots/ui-v2/reveal-recorded-desktop.png), [full page](screenshots/ui-v2/reveal-recorded-desktop-full.png) | [390x844](screenshots/ui-v2/reveal-recorded-mobile.png), [full page](screenshots/ui-v2/reveal-recorded-mobile-full.png) |
| Evidence | [1440x900](screenshots/ui-v2/evidence-desktop.png), [full page](screenshots/ui-v2/evidence-desktop-full.png) | [390x844](screenshots/ui-v2/evidence-mobile.png), [full page](screenshots/ui-v2/evidence-mobile-full.png) |

Additional inspected compositions: [landing 1024px](screenshots/ui-v2/landing-extra-tablet.png), [landing 375px](screenshots/ui-v2/landing-extra-narrow.png), [chamber 1024px](screenshots/ui-v2/investigation-extra-tablet.png), [chamber 375px](screenshots/ui-v2/investigation-extra-narrow.png). The additional chamber captures predate the final source-ID and control-spacing corrections; primary desktop/mobile captures are newer.

[Failure presentation](screenshots/ui-v2/investigation-failure-mobile.png) is explicitly labelled UI FIXTURE. No real role failure or new investigation occurred during the overhaul.

The recorded reveal reproduces 209.63 and 207.262 USDT, the resulting 1.1296% decrease, the documented digest, and the aggregate role summary from existing STATE.md. It includes no fabricated role text, token, signature or fresh verification. Its injection script lives in scratch only, not the deployed public directory.

## Intended versus observed

| Intended | Observed in final local captures or computed styles |
| --- | --- |
| Condensed broadcast display, 58-88px desktop / 38-48px mobile | Barlow Condensed 700 loaded; landing heading 80px at 1440 and 43px at 390. |
| Plex body and mono utility type actually load | IBM Plex Sans body and Plex Mono utility faces loaded locally. Unused declared weights remain unloaded by design. |
| Near-black #08090C, warm #F7F5F0 text | Computed body background rgb(8,9,12), heading rgb(247,245,240). |
| Readable hero description | Computed 17px desktop / 15px mobile. This compact mobile value is a deliberate deviation from the nominal 16px body default. |
| Clear touch action, small functional radius | Main hero CTA 50px desktop / 48px mobile; computed radius 3px. |
| Framed chamber rather than nested card soup | Computed chamber radius 8px. This uses the contract's data-panel radius rather than the optional 14px stage radius. |
| Three recognizable original characters | All three portrait images load; large staggered desktop portraits and a compact three-bust mobile hero. The chamber mobile selector brings one portrait and its duty forward. |
| Case identifiable with immediate entry | Featured NVDA case visible on the first 390x844 screen. Case page entry precedes detailed source information. |
| No horizontal scroll | Measured document width equals viewport at 1440, 1024, 390 and 375 for all primary routes. Recorded reveal fixture also measures 1440 / 390 after hash wrapping correction. |
| Truthful outcome and market comparison | Unsealed route says outcome withheld. Recorded reveal fixture shows the actual two observations, a signed-record summary and an adjacent causality warning. No invented time series. |
| Responsive evidence | Mobile disclosure collapsed initially and reacts at the breakpoint; desktop source rail open. Native summaries are keyboard accessible. |
| Motion supports state | 420ms stage entry, 850ms outcome wipe, quick control transitions; reduced-motion removes stage/outcome animation. Real completed-call choreography was not exercised. |
| Legible contrast | Core token combinations range from 6.31:1 to 18.27:1. Screenshot pixel-level colour sampling, screen-reader review and live motion playback are unmeasured. |

Specific defects found and fixed: overlapping VEX/SEAL labels, inherited mobile stage minimum height, forced-line-break word concatenation, long digest overflow, a mobile flex basis that created blank space, duplicate old landing sections, and a static catalogue that could overwrite a restored pre-packet. The initial keyboard assertion failed because its CDP tab was in the background; bringing the target forward resolved the harness issue without changing product behavior.

## Original art provenance

Owner explicitly authorized portrait generation only after the initial no-AI restriction. One image-generation call produced a coordinated original contact sheet, 2172x724. Each final portrait is a separate 724x724 crop, without upscaling; thumbnails are 240x240. Main images are approximately 81-83 KiB each. Exact sizes and checksums are in `public/assets/agents/manifest.json`. Source art remains in the tool's generated-image directory; the file is named in the manifest. No Crossfire source or portraits were copied. Character art follows the package's original investigator brief; the original 1200x1500 target was not met, and the actual square source resolution is disclosed here.

Barlow Condensed and IBM Plex font downloads came from Google Fonts, with license files from the official google/fonts repository. Licenses ship with the assets. No model/provider pricing or tier is advertised.

## Verification and limits

- 75 offline frontend assertions passed: local navigation, focus, menu keyboard interaction, portrait selection, source disclosure, empty/locked state, reduced motion and route overflow at four widths. Output: `screenshots/ui-v2/ui-checks.json`.
- `node --check public/app.js` passed after final JS edits.
- One `npm run build` passed. The script was inspected first; it only checks files and source invariants, with no network call. Subsequent changes were limited to final frontend presentation and saved-source display; affected screenshots and JS syntax were rechecked, without rerunning suites.
- Hash comparisons of all 18 backend files show no changes.
- Final offline restored-pre-packet check confirmed the Bitget source and actual eligibility labels survive frontend initialization. No API call.
- Research/model investigation, readiness, market-data and receipt-verification calls: **0**. Portrait generation: **1 explicitly authorized call**.
- No backend tests or API end-to-end journey were run. Previous successful integration remains documented in STATE.md.
- Full saved role payloads were unavailable. Populated transcript and actual multi-role runtime choreography were therefore not re-exercised. Only actual saved pre-packet rendering and documented aggregate reveal values were used.
- No deployment was made. Existing Preview still serves the prior UI. Production requires owner's final visual approval.
- No usable Git metadata exists in the workspace; no commit was made. Private Markdown documents are not to be published.

## Continuation

Review the hero and chamber captures, then the labelled reveal and Evidence captures. On visual approval, deployment can proceed under the owner's explicit deployment authorization. Keep screenshot fixtures outside public and retain all no-API restrictions unless separately lifted.

## Final visual cleanup, 10 October 2026

The owner approved the v2 direction and requested a narrow cleanup, not a redesign. Removed decorative stage, case, method and portrait numbering; kept fiscal quarters, dates, source metadata and financial figures. Character names remain prominent, with role explanations introduced once in the hero. Shortened chamber and reveal instructions and replaced implementation wording with user-facing explanations while retaining verification and uncertainty disclosures. All action labels and arrows use inline-flex with an 8px gap; mobile header visibility is preserved. No event handlers or backend contracts changed.

Final Production candidate remains local and undeployed. No research, market-data, readiness or AI inference calls were made. Local capture blocks API and external requests. JavaScript syntax passed; hashes match all 18 original backend files. Desktop 1440×900 and mobile 390×844 captures for landing, case, chamber, Evidence and locked reveal show no overflow or JavaScript errors, and portraits loaded. Inspected landing desktop/mobile, case desktop, chamber mobile and locked reveal mobile. Recorded reveal captures remain explicitly labelled review fixtures using earlier recorded values, with no new verification or investigation. No broad suites were rerun.

| Surface | Desktop | Mobile |
|---|---|---|
| Landing | [Desktop](screenshots/ui-v2/cleanup-landing-desktop.png) | [Mobile](screenshots/ui-v2/cleanup-landing-mobile.png) |
| Case selection | [Desktop](screenshots/ui-v2/cleanup-case-desktop.png) | [Mobile](screenshots/ui-v2/cleanup-case-mobile.png) |
| Chamber | [Desktop](screenshots/ui-v2/cleanup-investigation-desktop.png) | [Mobile](screenshots/ui-v2/cleanup-investigation-mobile.png) |
| Locked reveal | [Desktop](screenshots/ui-v2/cleanup-reveal-desktop.png) | [Mobile](screenshots/ui-v2/cleanup-reveal-mobile.png) |
| Recorded reveal fixture | [Desktop](screenshots/ui-v2/cleanup-reveal-recorded-desktop.png) | [Mobile](screenshots/ui-v2/cleanup-reveal-recorded-mobile.png) |
| Evidence | [Desktop](screenshots/ui-v2/cleanup-evidence-desktop.png) | [Mobile](screenshots/ui-v2/cleanup-evidence-mobile.png) |

| Intended | Observed |
|---|---|
| Preserve approved display typography | Barlow Condensed 700, 80px desktop and 43px mobile landing heading |
| Preserve palette | Body rgb(8,9,12), heading rgb(247,245,240) |
| Preserve button sizing and radius | Hero CTA 50px desktop, 48px mobile; 3px radius |
| Responsive fit | Document width equals viewport width on every captured route |
| Group arrows | Final CSS uses inline-flex and 8px gap; visually inspected landing and case controls |

No live research playback, provider availability, receipt re-verification or Production deployment was exercised. Production requires explicit owner approval.


## Preview deployment

On 10 October 2026, the owner approved Preview deployment. The linked `veyrin-research-chamber` Vercel project completed with READY state at [https://veyrin-research-chamber-ql8gm4430-web3kyamis-projects.vercel.app](https://veyrin-research-chamber-ql8gm4430-web3kyamis-projects.vercel.app). Vercel ran the existing build check successfully. Deployment target is Preview; Production was not deployed. No research, market-data or inference endpoint was called. Wait for owner visual feedback before any further UI changes or Production deployment.
