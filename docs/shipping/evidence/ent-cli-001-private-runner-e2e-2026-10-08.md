# ENT-CLI-001 private-runner route lifecycle qualification · 2026-10-08

## Scope

This batch qualifies the Web-side private-runner lifecycle against a fresh,
loopback-only PostgreSQL 15 Alpine container. It exercises the real route
handlers and database writes for enrollment, first poll activation, job issue,
signed job polling, source-free result upload, exact replay, conflicting replay,
tenant isolation, and final persistence reconciliation.

## Implementation merged

- Web PR #159, commits `4eaebd7` and `60dd276`, merged to `main` as
  `2b3f37918fb386b0d5ffa231fa5f6ee11ae6e07b`.
- An enrolled runner becomes `active` on its first authenticated empty poll;
  otherwise the lease guard could never admit work.
- An identical result replay is idempotent after the job reaches `completed`;
  a different payload for the same job remains a `409 result_conflict`.
- The E2E is a dedicated hosted Verify step after the existing fresh-database
  serial suite. Its fixture creates only the required schema when absent and
  drops only tables it created, so it does not bypass the migration safety
  guard or mutate a pre-existing test schema.

## Evidence

- Web focused private-runner suite: **24/24 passed**.
- Clean local PostgreSQL 15 Alpine lifecycle: **1/1 passed**.
- Clean local configured serial suite: **883 passed, 1 intentional skip, 0
  failed** across 884 tests.
- Web typecheck, Drizzle schema check, 38-migration ordering check, build, and
  diff check: passed.
- Hosted Verify run `37779050179`: `typecheck-and-schema` passed; GitGuardian,
  Vercel Preview, and Vercel deployment checks passed.
- The disposable database container was stopped after the run.

The result payload and schema contain only bounded metadata and an evidence
digest. No command, source, or raw runner output was sent to or stored by the
hosted route.

## Acceptance boundary

This is route/database lifecycle qualification, not proof that an actual
customer runner executed a Hunt recipe. `ENT-CLI-001` remains unchecked for
operational credential exchange, approved runner execution, cross-platform
qualification, independent Hunt/security review, and enterprise acceptance.

No production database, migration, payment, entitlement, deployment, or
customer-state write occurred. Authoritative backlog remains **218 checked / 62
unchecked / 280 total (77.9%)**.
