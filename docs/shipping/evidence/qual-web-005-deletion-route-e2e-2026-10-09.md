# QUAL-WEB-005 isolated account-deletion E2E — 2026-10-09

## Scope

- Repository: `verglos-web`
- Exact source tree: Web PR #170 tree, identical to merged `origin/main`
  `be4289f838b4cd53ed243979bfd7623262b69636`
- Database: disposable local PostgreSQL 15 container
  `postgres:15-alpine@sha256:2bf082886c059b4cf5af3f9e8d3a8916c35699062899061c13bc32d5921c631a`
- Database target: local `verglos_test` at `127.0.0.1:55439`; no production or
  hosted provider connection
- Container was created only for this batch and stopped after verification.

## Preparation

- `pnpm db:migrate` passed through the explicit local empty-database bootstrap
  preflight.
- Migration inventory: **38 applied migrations / 50 public tables**.
- `pnpm db:migrations:check`: passed, verified 38 ordered PostgreSQL
  migrations.

## Results

- `src/app/api/v1/account/deletion/route.integration.test.ts`: **1 passed / 0
  failed / 0 skipped**.
- `src/lib/qual/account-deletion-jobs.integration.test.ts`: **1 passed / 0
  failed / 0 skipped**.

The route E2E exercised unauthenticated denial, cross-origin refusal, malformed
confirmation, authenticated customer-held digest registration/idempotency,
authenticated deletion-request creation/idempotency, persisted job state,
one bounded worker execution, completion state, and retention of the held
digest. The job integration exercised user scope, lease fencing, retry,
reclaim, legal-hold blocking, idempotency, and bounded deletion operations.

## Boundary and remaining gates

This is isolated non-production qualification only. It does not establish
legal/customer-held-record disposition, authenticated browser acceptance,
production migration authorization, backup/restore/rollback, row
reconciliation, or independent end-to-end review. `QUAL-WEB-005` remains
unchecked. No production, hosted database, migration, payment, provider,
account, entitlement, deployment, or customer-data write occurred.
