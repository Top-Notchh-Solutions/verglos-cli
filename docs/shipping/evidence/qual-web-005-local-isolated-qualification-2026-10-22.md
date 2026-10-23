# QUAL-WEB-005 local isolated deletion qualification · 2026-10-22

## Scope and source

This packet records the current Web source at merged head
`67f8f89be193dff7053d0abd946b288301bf2b87`. It qualifies the repository-owned
privacy/deletion contracts against a disposable local PostgreSQL 15 database;
it does not claim Production migration authorization, legal/consent approval,
customer-held-record disposition, restore/rollback acceptance, or independent
end-to-end acceptance.

## Isolated database

- Database: local `verglos_test` on `127.0.0.1:55433`, PostgreSQL 15.
- The repository migration guard first refused the empty database. The
  explicit local-only bootstrap flags were then supplied, after which the
  reviewed legacy baseline and all migrations applied successfully.
- The remote Neon URL from `verglos-web/.env.test.local` was never used.
- The qualification container was stopped after the run and not removed. A
  prior misconfigured stopped container was also left untouched.

## Commands and results

- `DATABASE_URL` set to the local `verglos_test` URL with
  `VERGLOS_ALLOW_EMPTY_DATABASE_BOOTSTRAP=1` and
  `VERGLOS_EMPTY_DATABASE_BOOTSTRAP_CONFIRMATION=I_UNDERSTAND_LEGACY_BASELINE`,
  then `pnpm --silent db:migrate` — **success**; reviewed baseline initialized
  and migrations applied.
- `TEST_DATABASE_URL` set to the local `verglos_test` URL, then
  `pnpm --silent exec tsx --test src/lib/qual/account-deletion-jobs.integration.test.ts src/app/api/v1/account/deletion/route.integration.test.ts` — **2/2 passed**:
  authenticated deletion request/worker flow and user-scope/idempotency/bounds/lease pairing.
- `TEST_DATABASE_URL` set to the local `verglos_test` URL, then
  `pnpm --silent exec tsx --test src/lib/qual/qual-runtime-data-routes.integration.test.ts src/lib/organizations/tenant-postgres.integration.test.ts src/lib/organizations/record-receipt-route.integration.test.ts` — **2/2 passed** for tenant PostgreSQL predicates and digest-bound receipt persistence.
- `env -u TEST_DATABASE_URL pnpm --silent db:migrations:check` — **43 ordered migrations verified**.
- `env -u TEST_DATABASE_URL pnpm --silent db:check` — **success**.
- `env -u TEST_DATABASE_URL pnpm --silent typecheck` — **success**.

No source, customer data, remote database, provider, Production, deployment,
legal, reviewer, or customer operation occurred. No file, branch, record,
deployment, provider, customer, database, or release artifact was deleted or
changed.

## Disposition

The deletion implementation and isolated qualification are stronger and
current, but `QUAL-WEB-005` remains unchecked for the legal/customer-held
record decision, consent inventory, Production migration authorization,
restore/rollback acceptance, row reconciliation, and independent end-to-end
acceptance. Score remains **239 checked / 41 open / 280 total (85.4%)**.
