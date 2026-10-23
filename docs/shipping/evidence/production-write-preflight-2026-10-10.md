# Production controlled-write preflight — 2026-10-10

## Scope

This is the first controlled Production-write preflight under the updated
shipping goal. The intended first operation was the pending Web migration
release, because the current application journal contains 39 ordered
migrations while the recorded Production audit previously showed a shorter
applied prefix.

## Read-only checks

- Current Production deployment `dpl_9tXipBQD1CmYK8EpmMLCBPrgh3zw` is READY and
  aliased to `https://verglos.com`.
- Production environment key shape was inspected without reading values. The
  Production set contains the live/runtime keys and does not expose the
  Preview fixture-auth, isolated-Preview marker, Test Mode plan IDs, or test
  database variable.
- Public Production routes `/`, `/checkout`, and `/docs` returned HTTP 200;
  the unauthenticated subscription-creation route returned the expected
  method boundary.
- The authenticated Production browser account remains Free with no
  organization fixture. No account or organization write was made.
- The source migration journal passed the ordered 39-file check.

## Credential boundary

The local `.env.production.local` file does not contain a usable PostgreSQL
DSN for an operator shell. Its `DATABASE_URL` value is a Vercel-encrypted
secret representation. A direct `psql` preflight rejected that value as an
invalid connection option before opening a database session. The application
deployment can receive the secret at runtime, but the local migration audit
and backup tools cannot use the encrypted representation as a DSN.

Therefore the migration dry run, snapshot, restore rehearsal, and migration
write were **not** executed. No SQL was sent and no Production state changed.

## Required artifact to execute the first Production write

Use one of these operator-controlled paths without posting credentials in
chat:

1. Run the reviewed migration and backup commands from a trusted shell where
   the actual Neon/PostgreSQL DSN is available through the approved secret
   manager; or
2. Provide an approved protected migration runner that executes the same
   reviewed `db:migrate` preflight against the Production runtime secret and
   returns only redacted migration/snapshot/reconciliation results.

The controlled-write authorization is active, but it does not waive this
credential boundary. The backlog score remains **219 checked / 61 unchecked /
280 total (78.2%)**; no checkbox changed.
