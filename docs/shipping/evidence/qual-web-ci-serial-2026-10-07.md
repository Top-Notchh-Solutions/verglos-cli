# Web hosted serial qualification CI · 2026-10-07

## Scope

This batch makes the existing Web qualification workflow use the repository's
serial PostgreSQL test harness. It keeps the developer-speed `pnpm test`
script unchanged and only changes CI execution order for shared disposable
database fixtures.

Repository: `verglos-web`.
PR: https://github.com/anuragyadav-git/verglos-web/pull/150
Head: `a78578effdce6f7abf4807d0232d8ed93fd07f07`.

## Local evidence

On the PR worktree, `git diff --check` passed. Against a fresh temporary
Docker `postgres:18-alpine` database on host port `55446`:

- `pnpm test:serial` pretest: 48 passed, 0 failed, 0 skipped;
- configured Web suite: 867 passed, 0 failed, 1 intentional migrated-billing
  skip.

The temporary container was stopped after the run.

## Hosted evidence

GitHub Verify run `37552936102` completed successfully in Node 22. The job
passed typecheck, `pnpm test:serial`, negative-boundary and truth-registry
tests, Drizzle schema and migration-order checks, production build,
public-boundary audit, dependency audit, SBOM, license inventory/tests, and
tracked-secret guard. GitGuardian, Vercel, and Preview Comments also passed.
GitHub reports the PR open and mergeable.

## Acceptance boundary

This closes the CI shared-database scheduling reliability gap and strengthens
local/hosted code qualification. It does not close QUAL-WEB-006, PLAN-WEB-014,
PLAN-WEB-015, production recovery/migration gates, GitHub cutover, R-041, or
any customer/provider acceptance. No merge, production deployment, provider,
payment, database, migration, credential, or customer operation occurred.
Backlog remains **218 checked / 62 unchecked / 280 total**.
