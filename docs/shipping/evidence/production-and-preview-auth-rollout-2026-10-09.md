# Production and Preview auth rollout evidence — 2026-10-09

## Scope

This record covers the current Web Preview auth repair, hosted qualification,
and the complete Production boundary. It does not claim a Production billing,
database, entitlement, provider, account, or customer-data activation.

## Preview implementation

- Web commit `315a432cc84b3f6b2ece1e1794f8dd367a0a8237` makes the Clerk bypass
  explicit and Preview-only: it requires the complete fixture tuple, including
  `VERCEL_ENV=preview`, before disabling Clerk in the layout and middleware.
- Production and incomplete Preview configuration continue to use Clerk. The
  change does not weaken Production authentication or accept a partial fixture.
- PR #171 remains open, mergeable, and unmerged.
- Hosted workflow `37865021464` passed its typecheck/schema, serial tests,
  private-runner E2E, negative-boundary, truth-registry, database checks,
  build, public-boundary, dependency, SBOM, licence, and secret-guard jobs.
- Preview deployment `dpl_AqiQRh8ZoSrmD5pGhiLQyH84SR9a` reached READY. Exact
  browser smoke against this protected deployment is still pending because the
  current debug profile was redirected to Vercel login; no protected-session
  bypass was attempted.

## Qualification

- Focused Preview-auth tests: **4/4 passed**.
- Web serial suite: **896 total / 872 pass / 24 explicit skips / 0 fail**.
- Typecheck, build, schema checks, and ordered migration checks passed.
- The current branch has **39** ordered migrations. A disposable PostgreSQL
  15 restore rehearsal applied all 39, completed both writer passes, returned
  `reconciled`, and failed closed when the database was stopped. Measured RTO
  was **3,177 ms**.
- The rehearsal remains overall **failed** because the available snapshot is
  approximately **441 hours** old, beyond the critical 48-hour RPO. This is
  not current-backup evidence and does not authorize a Production migration.

## Production boundary

Production remains the fail-closed code-rollout track at deployment
`dpl_72ptf8YQyLxxXvJHVQDg2vUfh3CN`, aliased to `https://verglos.com`. The
current batch made no Production deployment or write. No Production plan IDs,
payment/provider writes, database or migration writes, entitlement changes,
account changes, or customer-data mutations occurred.

Production is not being skipped. The remaining Production stages are tracked
in the active goal and must be completed in order:

1. read-only environment, domain, schema, health, logs, and rollback audit;
2. reviewed code rollout with build, runtime-config, public smoke, and
   rollback-target evidence;
3. separately approved provider/database/payment/entitlement activation with
   operation-specific backup/restore, reconciliation, and rollback evidence;
4. post-activation monitoring, provider/ledger/entitlement reconciliation,
   and rollback or forward-fix rehearsal.

The current Web candidate is migration-bearing. It must not be promoted to
Production merely because hosted checks are green; its migration preflight,
current-backup RPO, reconciliation, and rollback decision remain open.

## Acceptance state

The private backlog remains **219 checked / 61 unchecked / 280 total
(78.2%)**. No checkbox changed from this batch. Gate 4 remains open for real
provider renewal/failure/expiry/refund/replay/out-of-order and complete
provider-to-ledger-to-entitlement reconciliation evidence.

