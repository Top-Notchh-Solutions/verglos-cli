# Web database-suite isolation qualification · 2026-10-07

## Scope

This batch investigated the unresolved full Web PostgreSQL-backed test run. It
does not claim the full configured suite or any hosted/production qualification.

Repository: `verglos-web` main at `cbc0f5a89179995569308695419d4578c57ce716`.
Local Node: `v26.4.0`; package baseline: Node `22.x`.

## Aggregate run

A temporary Docker `postgres:18-alpine` container named
`verglos-full-web-test-postgres` was started on host port `55439` with a fresh
`verglos_test` database. The full `pnpm test` run was stopped after more than
three minutes of no progress. Two integration workers remained idle, and
PostgreSQL showed only idle test connections. The aggregate output had shown
two apparent failures before the stall:

- queue fairness cursor;
- worker-crash recovery max-attempt bound.

Those failures were not accepted as product failures because both reproduced
as passing in isolated execution below. The aggregate run is not counted as a
pass.

## Isolated reruns

Each run used a fresh temporary `postgres:18-alpine` container and was stopped
after completion. No project or production data was used.

```text
TEST_DATABASE_URL=postgres://postgres@127.0.0.1:55440/verglos_test \
  node --import tsx --test \
  src/lib/queue/postgres-provider.integration.test.ts \
  src/lib/queue/worker-crash-recovery.integration.test.ts
```

Result: 7 passed, 0 failed, 0 skipped.

```text
TEST_DATABASE_URL=postgres://postgres@127.0.0.1:55442/verglos_test \
  node --import tsx --test src/lib/usage/threshold-outbox.integration.test.ts
```

Result: 1 passed, 0 failed, 0 skipped.

```text
TEST_DATABASE_URL=postgres://postgres@127.0.0.1:55443/verglos_test \
  node --import tsx --test src/lib/usage/ledger.integration.test.ts
```

Result: 1 passed, 0 failed, 0 skipped.

Running the two usage files together reproduced a test-harness race: both
parallel isolated Node test workers attempted `create extension if not exists
pgcrypto` against the same fresh database, producing PostgreSQL error `23505`
on `pg_extension_name_index`, followed by an unresolved test worker. Running
each file alone passes. This concurrency/setup limitation remains open and
must not be hidden by counting the aggregate run as green.

## Acceptance and boundary

This evidence strengthens local integration diagnosis only. It does not close
QUAL-WEB-005/006, PLAN-WEB-014, ACCEPT-002/003, any release gate, or the
configured full Web suite. No production database/provider/payment/deployment,
migration, credential, or customer operation occurred. Backlog remains
**218 checked / 62 unchecked / 280 total**.
