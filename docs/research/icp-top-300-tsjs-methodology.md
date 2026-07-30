# ICP Top 300 TS/JS Repo Research

Generated 2026-07-29 from GitHub's public repository search API.

Verglos scans only TypeScript and JavaScript codebases. This list replaces
the earlier mixed-language ICP top 300, which included PHP/Python/Ruby/other
repos that Verglos cannot analyze. The new list is bounded to `language:TypeScript`
and `language:JavaScript` and biases toward "world-class" repos — high stars,
real users, active maintenance.

## Source Queries

Candidates were pulled from 47 GitHub searches across:

- Top-star TS/JS sweeps (stars > 15k, 5k–15k, 2k–5k)
- SaaS, starter, boilerplate, template topics
- Business apps: CRM, CMS, ecommerce, ERP, invoicing, helpdesk, booking, form-builder
- Admin dashboards, internal tools, low-code / no-code, workflow automation
- Auth, OAuth, Stripe, Supabase, Prisma
- AI, LLM, chatbot, OpenAI, agents, MCP, RAG, generative-ai
- Framework/starter surfaces: Next.js, React, NestJS, Remix, Svelte
- Self-hosted, analytics, monitoring, collaboration

## Ranking Heuristic

Each repo scores:

- **Star base**: `log10(stars) * 20` (10k stars ≈ 80, 100k ≈ 100)
- **ICP bonus** (capped at 120): SaaS/starter/CRM/CMS/ecommerce/dashboard/AI/agent/MCP topic and description hits
- **Penalties**: awesome lists, roadmaps, tutorials, curricula, interview prep, algorithm collections
- **Language filter**: non-TS/JS repos are dropped
- **Recency**: pushed >6mo docks 5pts, >12mo docks 20pts, >24mo docks 40pts
- Fork/archived/disabled repos excluded up-front

## Files

- `docs/research/icp-top-300-tsjs-repos.txt` — plain GitHub links, one per line
- `docs/research/icp-top-300-tsjs-repos.csv` — rank, fit score, stars, language, tags, pushed, description
- `docs/research/icp-top-300-tsjs-campaign-targets.txt` — scan-campaign format: `slug=https://github.com/org/repo.git`

## Intended Use

This list feeds the Verglos scan campaign at verglos@1.5.2. Reports land under
`scan-campaign-reports-icp300-tsjs-v1.5.2/`. Aggregate stats from that campaign
back the "we scanned 300 world-class TS/JS repos" article set.
