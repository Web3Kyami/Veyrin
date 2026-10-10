# 16 — Skills-first implementation router (MANDATORY)

This build pack was revised after inspecting the **actual user-supplied `kyami-skills-pc-20261004.zip`**, whose `skills/` folder contains **156** `SKILL.md` files. The selected names below all exist in the archive. The ZIP is not an assertion that these skills are installed in the coding agent's current environment. **Read the real skill document before claiming a skill was used.** Read only the skills needed for the current task, once per session; do not ingest all 156, list entire reference folders, or activate broad workflows out of habit.

## Runtime discovery (first thing the implementation lead does)
1. Inspect harness skill index / discovered skills; **do not claim loaded merely from name**.
2. Find matching `SKILL.md` in the harness/global skills root. Likely locations (verify, do not assume): `~/.codex/skills/<name>/SKILL.md`, `~/.agents/skills/<name>/SKILL.md`, `~/.gemini/config/skills/<name>/SKILL.md`, or a project-scoped `./.agents/skills/<name>/SKILL.md`. On Windows: `%USERPROFILE%\.codex\skills\<name>\SKILL.md`. Check whether symlinks are valid.
3. Load the actual `SKILL.md`; follow its own linked reference file **only if applicable**. Inspect dependencies/scripts before executing them. If it cites global `/root/.agents/AGENTS.md`, read it only if present and applicable. The *project's* `AGENTS.md`, `DESIGN.md`, data integrity constraints and user's directions remain binding; report material conflicts rather than silently picking a side.
4. Record skill discovery once in `docs/SKILL_EXECUTION_LOG.md`: skill name, actual resolved path, short purpose, loaded / missing. Thereafter write a brief per-phase line for newly used skills. This is traceability, not 156 checkboxes.
5. If a required skill is missing: look in other roots; **do not claim it ran**. If the owner needs to install it, surface one actionable ask. Continue independent tasks and use the explicit build-pack contract as the fallback. Do not block the whole project for an optional motion or design skill.
6. User archive includes `INSTALL.md`: for PC Codex, install the **contents of `skills/`** in `%USERPROFILE%\.codex\skills\`; Antigravity uses `%USERPROFILE%\.gemini\config\skills\`. Do not overwrite bundled skills. Global skills may not automatically exist on a VPS or Vercel runtime.

## Phase-to-skill routes (the selected skills are real names from the archive)
| Work being done | **Load first** | Supporting skill *only if needed* | Observable output |
|---|---|---|---|
| Entire build lead / scope / autonomous execution | `kyami-working-style`, `kyami-development`, `disciplined-project-execution` | `hackathon-scoping`, `cross-agent-handover` | Real phase progression, short blocker handling, state kept current |
| Establish visual direction from Crossfire reference | `kyami-product-design`, `adaptive-product-design`, `design-md` | `controlled-design-direction`, `generate-reference-inspired-brand-worlds` | Root `DESIGN.md`, visual design ledger, no default AI SaaS composition |
| Build page and components | `kyami-product-design`, `design-taste-frontend`, `ui-reference-loop` | `ui-ux-pro-max`, `design-first-ui-prompting`, `impeccable` | Product-specific actual UI + inspected screenshots |
| Motion / stage choreography | `gsap-react`, `gsap-performance` **only if GSAP chosen** | `visual-iteration-ui` | Accessible, performance-bounded active speaker and seal/reveal moments |
| Catch generic AI-generated aesthetic | `no-ai-design-slop`, `audit-ai-design-slop` | `audit-reference-originality` | One focused visual review at UI milestone, fixes documented |
| AI API and role schemas | `ai-provider-integration`, `ai-structured-output-integration`, `ai-agent-cost-control` | `kyami-development` | Actual parseable role results, deterministic refusal, bounded calls |
| Historical timestamps, evidence, price provenance | `controlled-evidence-verification`, `prototype-truthfulness`, `market-data-feeds` | `evidence-gated-completion` | Cited pre/post evidence split, real Bitget observation, honest uncertainty |
| Vercel production setup | `vercel-deploy`, `app-security-review` | `vercel-deployment` if needed to resolve deployment specifics | Anonymous working URL, server-only secrets, runtime budget |
| Final visual/judge/demo readiness | `hackathon-ship`, `submission-readme-standard`, `ui-reference-loop` | `demo-video`, `browser-video-recording`, `a11y-gates` | Final brief video, screenshots, credible README and submit bundle |
| Optional second independent adversarial review | `adversarial-project-review` | `github-real-evidence-verification` | One risk-focused review, no repeated full audits |

## Skill choice rules
- Read **only** relevant skills on the first occurrence of that kind of work. Never invoke GSAP or image-generator workflows simply because they are listed here. For one-line UI copy changes, don't trigger 8 design tools.
- Skills are methods, not permissions to enlarge scope or add dependencies. `DESIGN.md` is the visual identity authority; page-level specifications below it. `AGENTS.md` sets execution and truth rules.
- Reference-driven design is **close in visual storytelling and choreography**, not licence to transplant Crossfire's unlicensed source/art. Inspect actual reference screenshot/code before matching its high-level presentation grammar.
- The owner is not asking to install the 156-skill archive inside this project; it is already their personal library. This pack only documents how to use global installed skills.
- This project's scoped test-cadence override is detailed in `17_EXECUTION_AND_TEST_CADENCE.md`; adhere to invariant safety checks while avoiding repeated full-suite runs.

## Minimal visible proof of skill use
`Loaded: kyami-product-design from <actual path>, adaptive-product-design from <actual path>; applied: three-seat focal hierarchy; screenshot: docs/screenshots/chamber-desktop.png.` If unavailable, say `MISSING` instead. Never fabricate path or proof.
