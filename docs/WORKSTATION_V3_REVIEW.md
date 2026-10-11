# VEYRIN V3 — review handoff

**Change state:** GitHub source branch only. The existing dark Vercel Preview and Production are **not** updated by these commits.

## What changed
- Entire dark theatrical CSS bundle replaced by a fresh light-interface design system using existing local fonts and image assets, without modifying the research backend.
- Home leads with the supported research task and an explicit UI preview labelled *not a live run*, not three giant portraits or a long editorial pitch.
- Case list honestly presents just the single supported NVIDIA event; evidence details remain accessible.
- Investigation page becomes a dense analysis workstation: case cutoff, clickable investigator tabs, real-stage status rail, explicit availability/run controls, source sidebar and real validated transcript output. The agent portraits are compact.
- New `/sample` view shows the **documented prior real run** and aggregate outcome without model calls. It explicitly does not pretend to re-verify an inaccessible earlier token or contain a full preserved transcript.
- Outcome page, Evidence section and header are restyled; Vercel rewrite supports direct loads of `/sample`.
- Added `JUDGE.md`, the v3 design contract, updated README, offline source guard `npm run test:ui`.

## Exact source safety
The GitHub branch compare against `main` includes no files within `api/`, `lib/`, `data/` or `tests/`. Only `public/index.html`, `public/styles.css`, `public/app.js`, `vercel.json`, package script and design docs changed.

Existing JavaScript still owns the actual API request buttons. Navigation, agent selection, reading the archived study and opening Evidence **do not** auto-start investigations, readiness checks or Bitget requests.

## Checks completed through GitHub inspection
- Source index has six unique view names, no duplicate HTML IDs, and HTML element start/end tags matched in source.
- Required hooks for existing research, sealing, receipt verification, market reveal and proof are present.
- Direct URL rewrite to `/sample` is present.
- Diff review showed no backend handler or validator touched.

## Checks NOT claimed / required before merge
- No Node runtime executed on this branch yet; `npm run build`, `node --check public/app.js`, `npm run test:ui` and optional `npm run test:trust` must be run on a local checkout. These commands are offline.
- No new Playwright captures from a rendered v3 app have been made; desktop/mobile browser screenshots are required before approval.
- Full live research/market workflow is **not** rerun by this work. The previously documented successful end-to-end run remains the only evidenced integration.
- No Vercel Preview deployment or GitHub main-branch merge has been performed.

## Agent handoff (offline only)

```sh
git fetch origin design/light-workstation-v3
git checkout design/light-workstation-v3
node --check public/app.js
npm run build
npm run test:ui
# optional: npm run test:trust (offline)
npm run dev
```

Inspect `/`, `/chamber`, `/chamber/nvda-2026-q2-fy27`, `/sample`, `/proof`, and `/chamber/nvda-2026-q2-fy27/reveal` **without pressing** buttons that call APIs. If using browser automation, block all `/api/*` paths, external requests and provider calls. Capture desktop at 1440x900 and mobile at 390x844 for all six pages. Capture keyboard/focus, overflow, title truncation and role selection with network blocked.

Do not change backend code or merge/production deploy before owner approval. Preview-only deployment is optional after explicit permission; on a Preview, avoid any API actions during visual inspection.
