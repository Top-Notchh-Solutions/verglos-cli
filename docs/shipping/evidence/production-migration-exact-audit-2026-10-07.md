# Production exact migration audit — 2026-10-07

## Read-only result

Using a temporary Vercel Production environment pull with the selected
`DATABASE_URL` and the Web PR #153 migration journal, the bounded audit ran in
a repeatable-read, read-only PostgreSQL transaction with exact allowlisted
table counts.

- Preflight state: **blocked-migration-history**.
- Expected migration history: **35** entries.
- Applied production history: **26** entries.
- Missing tables: **0**.
- Pending migration tags: `0026_github_app_identity`,
  `0027_policy_digest_algorithm`, `0028_scm_project_binding`,
  `0029_account_deletion_holds`, `0030_customer_held_record_digests`,
  `0031_account_deletion_jobs`, `0032_account_deletion_receipts`,
  `0033_account_deletion_kind_operations`, and
  `0034_account_deletion_supporting_operations`.
- Exact counts: `licenses=1`, `legacy_migration_mappings=3`,
  `razorpay_webhook_events=4`, `billing_payments=0`, and
  `billing_subscriptions=0`.
- Local migration fingerprint: `sha256:1bc4baabe06a800fa4be6cd609e623eb2d2397bf8a9a3ff4f5a139af8397fcce`.

No row contents, identifiers, credentials, payment payloads, or user emails
were selected or retained. No production DDL, DML, migration, backfill,
deployment, payment, entitlement, or deletion occurred. The result is a
production migration preflight, not migration authorization or acceptance for
QUAL-WEB-005, PLAN-WEB-015, or PR #153.
