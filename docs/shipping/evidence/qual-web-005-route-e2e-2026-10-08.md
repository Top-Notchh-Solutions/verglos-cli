# Account deletion route qualification progress

Date: 2026-10-08
Status: implementation and isolated integration progress; acceptance remains
open and no backlog checkbox changed.

## Code and hosted review

- Web PR #162 initial auth-seam commit: `d3f7dced`; current exact head:
  `0e57200f01e9faebb7057b669706891e7e31407e`.
- The account deletion, customer-held digest, and operator hold routes now
  use the existing `requestAuth()` / `requestCurrentUser()` seam. Production
  still resolves the real Clerk request context; only the explicit
  non-production test provider can be injected by tests.
- The route contracts were updated to cover that boundary, and the isolated
  route integration now covers authentication, same-origin protection,
  malformed confirmation, digest idempotency, deletion-request idempotency,
  private caching headers, pending-job creation, bounded worker execution,
  completed request/job state, held-digest preservation, and cleanup.
- The worker/store path now serializes timestamps explicitly for postgres-js
  and constructs terminal receipt JSON through a fixed allowlisted kind/count
  expression, so the top-level production client and transaction client share
  the same behavior.

## Local evidence

- Disposable Docker PostgreSQL 15 container `verglos-qual-005-route-pg` was
  used only for this run. The reviewed empty-database bootstrap and all 38
  ordered migrations completed successfully.
- Focused route/integration run: **8 passed / 0 failed / 0 skipped**.
- Focused deletion/hold/inventory/worker contracts: **23 passed / 0 failed /
  0 skipped**.
- Safe-default serial run: **861 passed / 0 failed / 24 explicit environment
  skips** out of 885 tests.
- The clean database-backed serial run at the initial auth-seam head was
  **876 passed / 8 failed / 1 skipped**. The eight failures were the known
  shared-fixture schema collisions in the hosted-013 writer and queue/worker
  crash-recovery integration files (`users` or `organizations` already
  exists). On the rebuilt isolated database, the current head's route-to-worker
  integration and existing deletion-job integration passed **2/2**.
- A later attempt to rerun the entire database-backed serial suite was stopped
  after an earlier shared-fixture process removed the legacy `users` table from
  the disposable database; it is not counted as current-head evidence.
- `pnpm typecheck`, `pnpm db:check`, `pnpm db:migrations:check`,
  `git diff --check`, and the preview-safe production build passed. The build
  generated 45 pages.
- Hosted verification for PR #162 at the current head was pending when this
  evidence was captured; Vercel Preview Comments was green and the Vercel
  deployment check was pending.

## Remaining acceptance boundary

This evidence does not accept `QUAL-WEB-005`. Legal/customer-held-record
disposition, complete destructive-worker execution and reconciliation,
restore/rollback rehearsal, production migration authorization, and
independent acceptance remain open. No production database, payment,
provider, deployment, migration, or deletion write occurred.
