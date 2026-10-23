# Web PR #171 main integration evidence — 2026-10-09

## Scope

- Repository: `anuragyadav-git/verglos-web`
- Branch: `feat/preview-test-auth`
- Integrated commit: `be8cd2194b298b3921b3a1521e1ae4cac338920c`
- Pull request: https://github.com/anuragyadav-git/verglos-web/pull/171
- PR state: open, mergeable, not merged

The branch was integrated with the current `main` before hosted verification.
The main branch's `0037_private_runner_transport` migration was preserved, and
the unreleased subscription-expiry migration was renumbered to
`0038_billing_subscription_expired`. Existing migrations were not edited or
applied to any database.

## Verification

- Ordered migration validator: **39 migrations verified**.
- Focused auth/runtime/webhook tests: **48 total / 44 passed / 4 explicit
  integration skips / 0 failed**.
- Full Web serial suite: **896 total / 872 passed / 24 explicit skips / 0
  failed**.
- TypeScript typecheck: passed.
- Drizzle schema check: passed.
- Hosted GitHub workflow `37864205130`: passed, including typecheck, serial
  tests, private-runner E2E, negative-boundary tests, truth-registry checks,
  migration/schema checks, build, public-boundary audit, dependency audit,
  SBOM, license inventory, license tests, and tracked-secret guard.
- Vercel Preview: passed and deployed for the PR commit.
- GitGuardian: passed.

## Production boundary

The current Production deployment remains
`dpl_72ptf8YQyLxxXvJHVQDg2vUfh3CN` in `READY` state at `https://verglos.com`.
This batch performed only a read-only Production inspection. It did not deploy
the migration-bearing PR, apply migrations, call Razorpay, create or modify
payments, write the database, change entitlements, change accounts or
customers, or change Production environment values. Production therefore
remains the fail-closed code-rollout stage; billing/database activation still
requires its operation-specific preflight, current backup/restore,
reconciliation, monitoring, and rollback evidence.

## Disposition

This closes the branch-integration and hosted-verification slice only. It does
not close Gate 4 or any external reviewer/provider/release gate, and PR #171
must not be merged or promoted until those gates and the migration approval
conditions are satisfied. Score remains **219 checked / 61 unchecked / 280
total (78.2%)**; no checkbox changed.
