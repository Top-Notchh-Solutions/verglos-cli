# QUAL-WEB-005 rollback/retry qualification · 2026-10-07

## Exact candidate

- Web PR: `#153`
- Head: `2127924e418fdca4094fa88bab02656952f4488b`
- Hosted Verify: `37567278851` — success
- Vercel, GitGuardian, and Preview Comments — passed
- PR state: open, CLEAN; not merged or deployed

## Evidence

The disposable PostgreSQL integration injects a failure after an earlier
supporting delete, executes the worker inside a savepoint, and proves that the
earlier delete, monitor row, and supporting-operation receipts are all rolled
back. After removing the injected failure, the same lease/idempotency binding
retries successfully and deletes the scoped rows exactly once.

- Full serialized Web suite: **868 pass / 1 explicit skip / 0 fail / 869
  total**.
- Disposable PostgreSQL account-deletion integration: **1/1 pass**.
- Typecheck, production build (38 routes), Drizzle check, ordered
  **35**-migration check, and diff hygiene pass.
- Hosted Verify passed the serial test, negative-boundary, truth-registry,
  schema/migration, build, public-boundary, dependency, SBOM, license, and
  tracked-secret steps.
- Disposable PostgreSQL fixture was stopped and removed after testing.

## Acceptance boundary

This proves scoped transaction rollback/retry behavior, not a production
backup restore, deployment rollback, or authenticated non-production browser
workflow. QUAL-WEB-005 remains open; no backlog checkbox changed. No
production database write/migration/deletion, provider/payment operation,
deployment, or credential action occurred.
