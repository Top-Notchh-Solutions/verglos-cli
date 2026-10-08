# QUAL-WEB-005 · local account-deletion integration qualification — 2026-10-08

## Batch boundary

- **Backlog:** `QUAL-WEB-005`
- **Repository:** `verglos-web` exact current local worktree
- **Database:** disposable loopback-only PostgreSQL `15-alpine` container,
  pinned at `sha256:2bf082886c059b4cf5af3f9e8d3a8916c35699062899061c13bc32d5921c631a`
- **Runtime:** macOS host, Node `v26.4.0`, pnpm `10.34.5`; Web declares
  Node `22.x`, so the host-engine warning remains a limitation
- **Production state:** no production database, provider, payment,
  entitlement, deployment, or customer-state access

## Results

- Account-deletion job integration: **1 passed / 0 failed / 0 skipped**
- Focused privacy route, worker, inventory, hold, cron, and API contract suite:
  **23 passed / 0 failed / 0 skipped**
- `pnpm typecheck`: passed
- `pnpm db:check`: passed
- `pnpm db:migrations:check`: passed; **37** ordered migrations verified
- Container stopped after the run; no containers remained

The integration path exercised bounded user-scoped deletion jobs, inventory
qualification, legal-hold blocking and release, lease ownership, retry and
stale-fence behavior, idempotency, rollback on failure, customer-held digest
comparison, and terminal audit receipts. The focused contracts also covered
same-origin/authenticated request boundaries, cron authentication, explicit
confirmation, non-cascading migrations, worker limits, and operator-only hold
operations.

## Disposition

This is strong local implementation/integration evidence, not final acceptance.
It does not prove authenticated non-production browser-to-database deletion
E2E, legal/consent approval, customer-held-record policy approval, production
migration or reconciliation, backup/restore/rollback, retention operations, or
independent end-to-end review. `QUAL-WEB-005` remains open. No checkbox
changed.
