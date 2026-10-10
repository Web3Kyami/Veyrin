# 15 — Requirements and budget planning

## What the user supplies
- A Vercel account/project or permission for coding agents to create one.
- One working server-side Google AI Studio API key and chosen model ID by default; OpenRouter remains an explicitly selected alternative. Keys live only in local environment or Vercel server variables, never in a chat transcript or GitHub.
- GitHub repo permission for agents to push and deploy.
- Optional managed database connection if durable public share URLs desired (can defer for P0).
- No crypto wallet, Bitget account funds, live broker keys or second backend server required for research demo.

## External data and rights
- Bitget public data/research MCP described in handbook; no account key is documented for market research, but actual quotas, historical coverage and precise symbols must be probed.
- Public company investor relations/SEC filing pages are accessible, but caching, quote redistribution and rate limits must be respected.
- If historical as-of consensus unavailable, replace with genuine dated guidance/earnings schedule and openly label missing consensus, not invented data.

## Cost outline, not a price guarantee
| Category | Requirement | Cost posture |
|---|---|---|
| Model calls | 3 bounded role invocations per new run, optional 4th post-reveal synthesis | Variable by selected provider/model; cap spend/runs, measure actual tokens |
| Vercel | Next.js and API route handlers | Existing Hobby/available tier if eligible; monitor runtime/function quotas |
| Database | Optional Vercel-integrated managed Postgres | Start within available plan/quota, or defer persistence |
| Public Bitget data | Research MCP / market quotes | No exchange account documented for read-only retrieval; check actual quotas |
| Company event research | IR/SEC and permissible market history | Primarily publicly retrievable; respect vendor licensing |
| Art | 3 original portraits + logo; may be created with accessible design tools | Existing tooling, no necessary licensed-stock art purchase |
| Domain | `.vercel.app` URL adequate | No new domain required |
| Wallets/on-chain gas | None | Not needed |

## Operational spend safeguards
One verified case, source cache, hard per-run output/token cap, concurrency limit and request quota; verify actual selected model can comply with JSON. Provider costs may differ, and free-tier access/quotas can vary; marketing should not mention provider price/tier. Retain genuine recorded run as an explicitly labelled replay for judging continuity if live AI rate-limited.

## Scope priority
Data integrity + agent separation + one beautiful chamber + proof beat outrank multiple pages, fancy audio, or wide stock coverage. Don't burn the deadline on ten unsupported event cards.

**Skills:** This handoff assumes the coding agent can discover the owner's globally installed skills; the skill archive itself is not copied into this project. Check actual SKILL.md paths and report missing skills. **Artwork:** the final 3 role portraits are an owner-facing pending asset dependency, **not** supplied in this build pack. The functional release can use aesthetically cohesive custom silhouettes.
