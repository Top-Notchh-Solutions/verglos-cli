# QUAL-WEB-005 migration preflight and isolated integration · 2026-10-23

## Scope

This packet records the implementation and local integration evidence for
QUAL-WEB-005 after Web PR #258. It does not claim Production migration,
customer-data deletion, legal-retention approval, independent review, or final
acceptance.

## Source and merge

- Repository: `anuragyadav-git/verglos-web`
- Pull request: `#258`
- Source commit: `dace24f75ee598e494bbf2c83ea80834d08d666a`
- Merged commit: `7941cbfa23f8849daca402e0c3d5d4d8c1eb30e2`
- Change: both `db:migrate` connection paths use a 15-second provider
  connection timeout instead of 5 seconds.

## Commands and results

- `pnpm db:migrations:check` against the supplied test database: **43 ordered
  migrations passed**.
- `pnpm db:migrate` with the supplied test-database connection: **passed**. The
  supplied remote database was used only for migration preflight; its value is
  intentionally not recorded here.
- The destructive integration contract refused the remote endpoint because it
  was not an isolated local test database.
- Local disposable PostgreSQL endpoint:
  `postgres://postgres@127.0.0.1:55437/verglos_test`.
- Local `pnpm db:migrate` against the isolated endpoint: **passed**.
- Focused suite, serially:

  ```text
  node --import tsx --test --test-concurrency=1 \
    src/lib/qual/qual-web-suites.test.ts \
    src/lib/qual/account-deletion-holds.test.ts \
    src/lib/qual/account-deletion-inventory.test.ts \
    src/lib/qual/account-deletion-worker.test.ts \
    src/lib/qual/account-deletion-jobs.integration.test.ts \
    src/app/api/v1/account/deletion/route.integration.test.ts \
    src/lib/account-deletion-cron-workflow.test.ts
  ```

  Result: **43/43 passed, 0 failures, 0 skips** against the disposable local
  database.
- `pnpm typecheck`: **passed**.
- `git diff --check`: **passed**.

## Hosted limitation and residual gates

Web PR #258 hosted checks failed before repository execution with zero steps
(`39990870185` and `39990869955`); no hosted completion is claimed. No
Production database, deployment migration, customer data, release, or deletion
operation was performed.

QUAL-WEB-005 remains open for Production migration/restore/rollback,
legal-retention and customer-held-record disposition, reconciliation,
independent review, and final acceptance. No backlog checkbox changed.
