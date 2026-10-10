# 17 — Autonomous execution and lean testing policy

## Owner's preferred operating mode
The coding agent should **execute the build to a release candidate without asking permission after every subtask**. The idea, roles, routes and Vercel-only platform are decided. Do not return after each tiny task, do not turn every task into a discussion, do not endlessly self-review and do not demand the owner inspect every CSS section. Record commits, status and blockers in `STATE.md`, use the owner only for truly required decisions/access.

**Stop for:** missing API credential/permission that cannot be obtained by available means; validated contradiction of core feasibility; user approval needed for an external write/purchase; material change to locked concept; missing rights for requested exact copyrighted artwork. Routine implementation choices are delegated to builder.

## Testing must be risk-weighted, NOT every edit
**Do not run a 300-test suite after adjusting layout, text, spacing or one animation.** Use this precise policy:

| Checkpoint | What runs | Why |
|---|---|---|
| A: Immediately, first 15–30min | One model JSON probe, one real Bitget/evidence query, one cutoff-source validation | Avoid constructing a product on unavailable data |
| B: When implementing evidence boundary/seal | 5–10 **focused** small tests for cutoff, missing citation, forbidden outcome access, immutable hash, invalid reveal | These are high-severity invariants; must not defer until late |
| C: During ordinary feature/UI work | Static checks as needed; **targeted** affected test when touching data security or shared contracts. No blanket `npm test` after every save. | Keep momentum |
| D: Once main pages + API wired | One end-to-end anonymous judge journey on actual dev/preview environment; desktop + mobile screenshot inspection | Catches broken integration/UI |
| E: Once before submission / after substantive final fixes | Typecheck, build, lint (if configured), focused security/integrity suites, one full integration journey, Vercel preview; report pass/fail **actual output** | Release confidence |

Run the broad suite again only if the final changes invalidate the last check. Fix the failing scope first; don't re-run all tests blindly. Never add hundreds of tests for surface count. **One end-to-end case, small deterministic safety tests and a real deployment smoke** are better than 300 decorative asserts.

A skip is not a pass. Do not report nonexistent tests, green CI when it did not run, or successful API probes when only mock data was used.

## Execution sequence: each phase closes with a usable artifact
1. **Discover skills and feasibility:** load actual applicable skill docs, choose supported case/data/model. Short GO/CHANGE/KILL checkpoint with actual evidence. Set `STATE.md`.
2. **Backend truth path:** typed pre-source packet, role calls, citation gate, stored seal, post data access control. Run critical local checks in checkpoint B.
3. **Design and full UI:** root `DESIGN.md` + page contracts; build visually coherent staging and all page states. Integrate real backend; use branded vector/silhouette placeholder until owner-supplied/generated portraits are approved.
4. **Product integration:** connect beginning-to-reveal-to-proof without login. One real run, cache its *real* trace explicitly as recorded replay for stable judge access.
5. **Release:** one final integration and visual pass, deploy Vercel, capture judge evidence, write submission copy and user action list. Freeze.

## Status reporting (compact)
Update `STATE.md` at phase transitions only, not on every edit. Format:
`Phase | completed task IDs | real evidence/commands | deploy URL or artifact | current blocker | next action`. The agent can continue if no blocker. Do not silently mark missing API data DONE.

## Time and latency safeguards
- Set request-timeout budgets; the selected model may queue or be throttled. Use tested output-size caps and structured JSON validation; no silent provider switch.
- The Vercel deployment must fit actual serverless function limits. Prefer a bounded sequential flow through separate requests with persisted state to a single long request.
- No required always-on worker/cron/VPS; scheduled future analysis is out of scope.
- Once P0 works, prioritize judge recording and anonymous URL over additional routes, particle fields, TTS or speculative case breadth.

## Anti-slop final gate — once, not after each card
Run `no-ai-design-slop` / `audit-ai-design-slop` and inspect actual screenshots near first UI-complete milestone. Fix specific findings without triggering an unfocused redesign cycle. One after-pass is sufficient unless severe defects remain.
