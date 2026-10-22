# Web fresh isolated PostgreSQL serial qualification · 2026-10-22

## Scope

The exact merged Web head was run against a newly created, local PostgreSQL 15
container with the repository's required empty `verglos_test` database. The
remote `TEST_DATABASE_URL` value from the workspace `.env.test.local` was
inspected only for its non-production test target and was not used for
mutation tests; the repository's guard correctly rejects that remote hostname
as non-isolated.

- Web source: `/private/tmp/verglos-web-public-proof-merged-20261022`
- Web merged commit: `02f5aba95c4172255cc522730c6ffecc1598cbda`
- Test database: local PostgreSQL 15, `127.0.0.1:55435/verglos_test`
- Container: `verglos-web-writer-postgres-20261022` (preserved; not removed)
- Runtime: Node `v26.4.0` with the repository's locked dependencies

## Verification

Command:

```text
the test-database environment variable set to the redacted local URL, followed
by `pnpm test:serial`
```

Result:

- **919 passed**
- **0 failed**
- **2 skipped** (the suite's documented environment-gated cases)
- exit code **0**

This includes the database-backed writer, queue-provider, worker-crash
recovery, tenant, usage, deletion, webhook, and dashboard integration
coverage. The isolated database was intentionally left empty before the run,
matching the CI workflow contract; no production or remote database was
modified.

## Disposition

This is repository-owned qualification evidence for ACCEPT-002/003 and the
related Web/CLI qualification rows. It does not check any row: external
customer/recipient acceptance, provider/Production operations, legal/license
approval, independent review, field-CWV evidence, and final release sign-off
remain separate contract requirements. Live score remains **239 checked / 41
open / 280 total (85.4%)**. Nothing was deleted.
