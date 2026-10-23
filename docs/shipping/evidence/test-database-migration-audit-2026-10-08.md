# Test database migration audit — 2026-10-08

## Scope

The Web migration-audit script was run against the database selected by the
local test environment. The connection value, host, project/branch/endpoint
identifiers, primary keys, and row contents were not recorded. The audit uses
a repeatable-read, read-only transaction with bounded statement and lock
timeouts. It does not migrate, backfill, or mutate application state.

## Result

- Local migration fingerprint: `sha256:6191f35edda190e13a0c7e99833a474c908dbcfdc7abc8bb0f3fa143d165c336`
- Expected migrations from the current Web journal: **37**
- Applied migration records in the selected database: **26**
- Pending migrations: **11**
- Missing declared application tables: **0**
- Audit state: **blocked-migration-history** / pending

The pending migration tags are:

`0026_github_app_identity`, `0027_policy_digest_algorithm`,
`0028_scm_project_binding`, `0029_billing_order_source`,
`0030_billing_order_success_uniqueness`, `0031_account_deletion_holds`,
`0032_customer_held_record_digests`, `0033_account_deletion_jobs`,
`0034_account_deletion_receipts`, `0035_account_deletion_kind_operations`,
and `0036_account_deletion_supporting_operations`.

The bounded inventory also confirms the selected database is populated rather
than a fresh isolated Preview database. Exact application row counts were
intentionally not retained in this migration-focused evidence; the earlier
isolation audit records the approved aggregate counts.

## Disposition

This database cannot be used for Preview payment qualification or production
cutover evidence until its ownership, isolation, credential state, backup
state, and migration plan are independently approved. Do not run the pending
migrations against it as part of this audit. R-041, separate non-production
database provisioning, and production migration/restore/reconciliation remain
open. No production, provider, payment, entitlement, webhook, deployment, or
database write occurred.

## Limitations

This is a read-only preflight, not migration readiness or authorization to
write. It does not include primary-key ranges, orphan/duplicate analysis, row
digests, a snapshot token, backup/restore proof, rollback proof, or data-level
production reconciliation.
