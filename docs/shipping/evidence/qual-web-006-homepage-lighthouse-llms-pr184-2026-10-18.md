# QUAL-WEB-006 homepage Lighthouse and llms.txt evidence

Date: 2026-10-18
Surface: `https://verglos.com/` and `https://verglos.com/llms.txt`
Browser: existing Verglos Chrome tab via Chrome DevTools MCP

## Production observation before PR #184

The existing production homepage was audited with Lighthouse navigation on
mobile and desktop:

- mobile: Accessibility **100**, Best Practices **100**, SEO **100**;
- desktop: Accessibility **100**, Best Practices **100**, SEO **100**.

The only reported failure was the agentic-browsing `llms-txt` heuristic. A
direct production fetch in the same session returned a Markdown document whose
first line was `# Verglos`, and the body contained the current security-layer
positioning. The heuristic result is retained as a limitation to recheck, not
converted into a false content failure.

## Implementation and hosted verification

Web PR #184, assigned to `anuragyadav-git`, contains implementation commit
`96701ae8729f16ee28a83586409a32c848fe6172` and merged normally as
`696de5bf594fd315b26f76f1c9f72b245f61f026`. It serves `/llms.txt` as
`text/markdown; charset=utf-8` and adds a contract test requiring the factual
H1 and security-layer positioning.

Local checks passed:

- `pnpm test:truth-registry`: **32/32**, zero failures/skips;
- `pnpm typecheck`;
- `node scripts/check-public-boundary.mjs`;
- `pnpm build`: **47/47** pages;
- `git diff --check`.

Hosted PR run `39065760180`, job `117492959847`, passed
`typecheck-and-schema`, GitGuardian, Vercel Preview, and Preview Comments.

The post-merge Production deployment `dpl_FChRVgaChsGaKDbuKhzTW7Pg6MQK`
reached `READY`. The existing Verglos browser tab then verified a live
`/llms.txt` response with status `200`, content type
`text/markdown; charset=utf-8`, a factual `# Verglos` H1, current
security-layer positioning, and no stale “security evidence layer” phrase.

## Acceptance boundary

This packet strengthens the homepage and machine-readable public-surface
evidence only. It does not prove screen-reader traversal, reduced-motion
behavior, authenticated dashboard qualification, large-dataset behavior, or
field Core Web Vitals. `QUAL-WEB-006` and `FINAL-WEB-005` remain unchecked;
no backlog checkbox or score changed. No AppSec, provider, legal, customer,
release, or final-acceptance gate was waived.
