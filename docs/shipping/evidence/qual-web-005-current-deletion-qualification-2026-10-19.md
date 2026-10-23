# QUAL-WEB-005 current deletion/retention qualification · 2026-10-19

## Scope

This packet records the original Web account-deletion, customer-held-digest,
hold, retention/export, and migration-audit logic. It is implementation and
qualification evidence only; it does not claim production deletion,
production migration authorization, legal/customer consent, or final
acceptance.

## Source and implementation commits

- Repository: `Top-Notchh-Solutions/verglos-web`
- Base source: Web `origin/main`
  `0719074d5a6f83198f5e36c0eeb064f2a12e1b1b`
- Qualification fix: `0ff9ded` — migration audit compares Drizzle history by
  canonical application `id`, not non-monotonic historical timestamps.
- Regression test: `9c2587c` — guards the canonical ordering contract.
- Worktree: disposable clean `/tmp/verglos-web-qual.mzoZfw/web`
- Host: Docker Desktop server `29.7.2`, Linux/aarch64 container runtime
- Node: `v26.4.0`; pnpm: `10.34.5` (repository requests Node 22.x)

## Verification

- Focused privacy/deletion/retention/hold/route suite: **50 pass, 0 fail,
  2 database-gated skips** without a test database.
- The two database-gated tests were then run against a disposable local
  Postgres 15 `verglos_test` database after the repository's explicitly
  confirmed local baseline and all migrations were applied:
  - authenticated privacy routes and one bounded deletion job — pass;
  - account-deletion job migration scope/idempotency/lease pairing — pass.
- Combined completed matrix: **52 pass, 0 fail, 0 skip**.
- `node --import tsx --test scripts/migration-audit.test.ts` — **7/7 pass**.
- `pnpm typecheck` — pass.
- `pnpm build` — pass; 48 pages generated.
- `pnpm db:migrations:check` — pass; **42** ordered PostgreSQL migrations.
- The read-only exact-count migration audit on a freshly migrated isolated
  database now reports `historyState=current`, `expectedMigrations=42`,
  `appliedMigrations=42`, `missingTableCount=0`, and
  `preflightState=inventory-only-full-audit-required` with exit 0.

## Defect found and fixed

The original audit query ordered `drizzle.__drizzle_migrations` by
`created_at`. The current journal contains valid historical timestamps that
are not monotonic: migration `0031` predates `0030`. A clean migration
therefore produced a false `blocked-migration-drift` result even though all
42 migrations and hashes were applied in canonical order. The implementation
now orders by Drizzle's serial application `id`, and the regression test keeps
the query from reverting to timestamp order.

## Acceptance boundary

`QUAL-WEB-005` remains unchecked. The remaining row requirements are
authenticated non-production deletion acceptance beyond this bounded run,
legal/customer-held-record and consent decisions, complete inventory and
reconciliation, production migration authorization, restore/rollback
acceptance, and independent end-to-end acceptance. No production, provider,
customer, payment, or AppSec/Hunt state changed. The disposable database and
containers were removed after qualification.

## Evidence boundary

The implementation uses the original production auth, same-origin, tenant,
database, hold, worker, and digest-custody logic. No placeholder login,
fixture bypass, source substitution, or artificial commit was used. No squash,
rebase, force-push, or production operation occurred.
