# Production read-only billing and migration audit — 2026-10-07

## Preflight

Vercel CLI read-only inventory was performed against the linked `verglos-web`
project. Production has live Razorpay key prefixes, but
`RAZORPAY_ENABLED_PAYMENT_METHODS` is not present in the Production variable
inventory. The local `.env.production.local` file contains opaque exported
values; a temporary `vercel env pull --environment=production` was used for
the audit and the temporary secret file was removed after the run. No value
was printed or retained.

## Database result

Using the pulled runtime `DATABASE_URL`, a single bounded PostgreSQL
`READ ONLY` transaction with an 8-second statement timeout inspected metadata
and aggregate counts only:

- 42 application/provider tables were present, including `drizzle` migration
  history and the current billing, deletion, webhook, SCM, and organization
  tables.
- `drizzle.__drizzle_migrations`: **26** rows; latest migration timestamp
  `2026-10-06T13:10:00Z`.
- `account_deletion_requests`: **0** rows.
- `billing_payments`: **0** rows.
- `billing_subscriptions`: **0** rows.
- `razorpay_webhook_events`: **4** rows; latest completed timestamp was
  observed without selecting payloads or identifiers.
- `licenses`: **1** row.
- `legacy_migration_mappings`: **3** rows.

No user emails, IDs, URLs, payment payloads, credentials, or row contents were
selected. No DDL, DML, migration, backfill, deployment, payment, entitlement,
or deletion operation occurred. The source PR's 31-migration code state is
therefore not production-applied, and the empty billing/deletion aggregates do
not qualify payment, deletion, restore, RPO, or production reconciliation.
