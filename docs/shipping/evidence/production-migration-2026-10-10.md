# Production schema migration and audit correction — 2026-10-10

## Scope

This private record covers one bounded Production schema operation. It does
not authorize or claim a Production payment, subscription, entitlement,
account, organization, customer-data, or backfill operation.

## Read-only preflight

- The reviewed Web migration directory contained 39 ordered migrations.
- Production initially had 26 applied migrations and three missing declared
  tables: `private_runners`, `private_runner_jobs`, and
  `private_runner_results`.
- The existing public row inventory was recorded before the write. The
  billing subscription and payment tables were empty; no payment or
  entitlement fixture was created.
- A custom-format `pg_dump` backup was created before migration. It was kept
  outside the repository at `/tmp/verglos-prod-pre-migration.XXXXXX.dump`;
  size was 150,515 bytes and SHA-256 was
  `672a93f3171dde3b6084446dc57fb4d4d8a17422005c5e06aa8fd6e723ea7ae4`.
  `pg_restore --list` returned 308 manifest entries.

## Bounded write

- The migration runner was invoked through the Vercel Production environment
  runner, so the database credential was not printed or copied into the
  repository.
- The existing migration history was used; no SQL was edited, no backfill was
  requested, and no payment/provider/entitlement/account/customer-data write
  was performed.
- The runner completed successfully and applied the pending reviewed schema
  migrations.

## Post-write verification

- The corrected read-only audit reports `39/39` migrations applied,
  `missingTableCount: 0`, and all 39 declared application tables present.
- The audit reports `preflightState: inventory-only-full-audit-required`.
  This is the expected safe result: migration/schema inventory is complete,
  while the audit still does not claim row-level reconciliation or restore
  acceptance.
- Production smoke returned HTTP 200 for `/`, `/checkout`, and `/docs`.
  The POST-only Razorpay webhook route returned HTTP 405 to an unauthenticated
  GET request.
- The existing row inventory remained bounded to the preflight scope; the
  newly present private-runner tables contain zero rows. Billing subscription
  and payment rows remained zero.

## Audit correction

The first post-migration audit falsely reported drift because it sorted
Drizzle rows by `created_at`. The journal contains valid non-monotonic
timestamps after branch merges. Web commit `2a050be` changes the audit to use
Drizzle's application `id` order and adds a regression test. The corrected
Production audit is now current by application order.

## Acceptance impact

This closes the Production schema-availability and migration-preflight gap
for the current reviewed schema, with backup and post-write smoke evidence.
It does not close `PLAN-WEB-014`, Gate 4, or any billing/reconciliation item:
provider-generated lifecycle, payment, entitlement, replay/order, and final
hosted acceptance evidence remain separate requirements. The backlog remains
**219 checked / 61 unchecked / 280 total (78.2%)**.
