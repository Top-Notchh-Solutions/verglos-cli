# Web empty-Postgres regression qualification — 2026-10-07

## Scope

- Web worktree: `verglos-web/.worktrees/web-qual-005-deletion-worker`.
- Exact source head: `929da1907f001c8db71df0e601e08014590fd580` (PR #153).
- Disposable Docker `postgres:15` container and empty `verglos_test` database.
- Command: `TEST_DATABASE_URL=<isolated-local-url> pnpm test:serial`.
- Node: `v26.4.0`; the repository's existing Node 22 engine warning was emitted.

## Results

- Pretest: **48 passed / 0 failed / 0 skipped**.
- Main suite: **871 passed / 0 failed / 1 skipped** out of 872 tests.
- Overall command exit: **0**.
- The single skip is the intentionally environment-gated billing integration
  path because `BILLING_TEST_DATABASE_URL` was not supplied; no production or
  hosted database was used.
- The exact Docker container was removed after the run.

## Boundary and interpretation

This is repeatable local runtime-regression evidence for the current Web
candidate and supports the deletion/queue/usage integration substrate. It is
not production migration, restore/RPO, rollback, authenticated browser E2E,
payment-provider lifecycle, entitlement, reconciliation, legal/customer-held
record, or independent acceptance evidence. No backlog checkbox changed;
`QUAL-WEB-005`, payment gates, and production gates remain open.
