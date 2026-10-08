# ENT-CLI-001 concurrent result replay qualification · 2026-10-08

## Scope

This follow-up hardens the Web result endpoint against two identical uploads
arriving at the same time. The organization/job unique key is now the insert
conflict fence. The winning request returns `201`; the concurrent loser reads
the persisted digest and returns an idempotent `200`. A different payload for
the same job remains a `409 result_conflict`.

## Implementation merged

- Web PR #160, source commit `85665d1`, merged to `main` as
  `4cc1f5d3098435a845cffaae010f72c981ac8bcd`.
- The isolated ENT-CLI-001 lifecycle test now runs two concurrent identical
  result uploads and asserts exactly one creation plus one idempotent replay.
- No schema or migration change was required; the existing organization/job
  uniqueness constraint is used as the race fence.

## Evidence

- Fresh loopback PostgreSQL 15 E2E: **1/1 passed**, including concurrent
  upload statuses `[200, 201]` and one idempotent response.
- Focused private-runner suite: **24/24 passed**.
- Typecheck, Drizzle schema check, 38-migration ordering check, build, and
  diff check: passed.
- Hosted Verify run `37779624211`: type/schema suite passed; Vercel Preview,
  Vercel deployment, GitGuardian, and Preview Comments passed.
- Disposable PostgreSQL container was stopped after the run.

## Acceptance boundary

This proves race-safe result reconciliation at the route/database boundary;
it does not prove approved runner execution, cross-platform runner behavior,
operational credential exchange, independent Hunt/security review, or customer
acceptance. `ENT-CLI-001` remains unchecked. No production database,
migration, payment, entitlement, deployment, or customer-state write occurred.

