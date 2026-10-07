# QUAL-WEB-005 supporting deletion snapshot · 2026-10-07

## Exact candidate

- Web PR: `#153`
- Head: `37c8a07ef2c1d4f914c0ace03864d60fb2649a82`
- Hosted Verify: `37564973546` — success
- PR state: open, CLEAN; not merged or deployed

## Delivered boundary

The deletion worker now takes a read-only, versioned supporting-data inventory
snapshot across the sixteen supporting tables and validates the disposition
registry after the existing hosted-kind deletion work. The registry preserves
user/license/accounting/audit/digest/legacy-public/unscoped-telemetry rows as
required and marks only explicitly license/user-scoped rows as deletable. The
worker remains fail-closed with `supportingInventoryComplete=false`; this is a
qualification contract, not authorization to delete those rows.

## Verification

- Focused inventory/worker tests: **9/9**.
- Disposable PostgreSQL deletion-job integration: **1/1**.
- Full serialized Web suite: **846 pass / 23 explicit skips / 0 fail / 869
  total**.
- Typecheck, build, Drizzle check, ordered **34**-migration check, and diff
  hygiene passed; production build emitted **38** routes including the cron
  route.
- No production DB write/migration/deletion, provider/payment operation,
  deployment, or credential operation occurred.

## Acceptance boundary

QUAL-WEB-005 remains open. Executable supporting dispositions, operation
receipts, retained-row reconciliation, restore/rollback rehearsal, and
authenticated non-production end-to-end evidence are still required before
the gate can close.
