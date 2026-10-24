# QUAL-WEB-006 large-data qualification evidence · 2026-10-07

## Scope

This batch qualifies the repository/runtime large-data boundary for the
organization monitoring dashboard. It does not claim the full QUAL-WEB-006
acceptance gate: authenticated organization/Pro browser rendering, human
screen-reader review, and field Core Web Vitals remain open.

Repository: `verglos-web` isolated worktree
`/Users/anuragyadav/Developer/TopNotchh-Workspace/verglos-web/.worktrees/web-qual-006-large-data`.
Branch: `qual/web-006-large-data`.
Qualification commit: `70680f89cb1cb9e8324398fc0a789930420cb031`; CI serialization
head: `a78578effdce6f7abf4807d0232d8ed93fd07f07`; merged to Web `main` as
`a64407d9e7b81ba4db8c52a96d1237da693cb910`.
PR: https://github.com/anuragyadav-git/verglos-web/pull/150

## Implementation boundary

The existing monitoring repository was exercised without production code
changes:

- component list pagination is 20 rows per page;
- the fixture contains 45 released components for one organization;
- the fixture contains 125 advisory matches for the selected component;
- detail results are capped at 100 rows and expose `matchesTruncated: true`;
- all joins remain organization-scoped, including the selected detail path;
- a foreign organization's component is inserted and asserted to remain
  invisible.

## Evidence run

Docker health was checked before the batch. A bounded temporary
`postgres:18-alpine` container named `verglos-qual-web-006-20261007` was
started on host port 55432 with a local-only `verglos_test` database, then
stopped after the run. No project or production data was used.

Focused integration command:

```text
TEST_DATABASE_URL=postgres://127.0.0.1:55432/verglos_test pnpm exec node --import tsx --test src/lib/organizations/dashboard-monitoring-repository.integration.test.ts
```

Result: **1 test passed, 0 failed, 0 skipped**.

Assertions include total 45, page sizes 20/20/5, 45 unique same-tenant
component IDs across the three pages, 100 returned detail matches with
truncation truth, and a null detail for the foreign component.

Additional local verification on the exact qualification worktree:

- TypeScript `tsc --noEmit`: passed;
- `pnpm db:check`: passed;
- `pnpm db:migrations:check`: passed, 29 ordered migrations;
- `VERCEL_ENV=preview NODE_ENV=production pnpm build`: passed, 38 pages
  generated and all routes compiled;
- `git diff --check`: passed for the private ledger update.

The local run used Node `v26.4.0` while the package declares Node `22.x`; the
hosted workflow is the authoritative Node-baseline check.

## Hosted state and limitations

Hosted Verify run `37552936102` passed typecheck, serialized tests,
negative-boundary/truth-registry, schema/migrations, build, public-boundary,
dependency/SBOM/license, and tracked-secret checks; Vercel, GitGuardian, and
Preview Comments also passed. It merged to Web `main` as
`a64407d9e7b81ba4db8c52a96d1237da693cb910`. No deployment occurred.

This evidence does not qualify large-data browser rendering, screen-reader
behavior, field CWV, Pro entitlement, production database state, provider
payments, or any customer acceptance. QUAL-WEB-006 remains unchecked.

## Production and privacy boundary

No production database read/write, migration, provider/payment operation,
deployment, credential use, or browser capture of personal/payment data
occurred in this batch. The temporary fixture used synthetic UUIDs and labels
only.
