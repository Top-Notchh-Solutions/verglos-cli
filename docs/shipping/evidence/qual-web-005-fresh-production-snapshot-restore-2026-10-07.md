# QUAL-WEB-005 fresh production snapshot and restore — 2026-10-07

## Rehearsal

- **Source:** Vercel Production `DATABASE_URL`, pulled through the logged-in
  Vercel CLI into a mode-600 temporary file; no value was printed or retained.
- **Snapshot:** `pg_dump --format=custom --no-owner --no-privileges` completed
  at `2026-10-07T10:17:27.005Z`; dump size was **150,515 bytes**. The dump
  stayed in a mode-700 temporary directory and was removed after the rehearsal.
- **Restore:** The dump restored successfully into disposable
  `postgres:18-alpine`; no production connection was used for restore.
- **Migration:** PR #153 exact head
  `250313e86ae6b746e1137c9f4d5436b23a96c170` passed migration ordering and
  applied the current migration tail successfully on the restored clone.
  The clone ended with **35** migration-history rows (production had 26).
- **Aggregate reconciliation:** restored clone reported migrations `35`,
  deletion requests `0`, billing payments `0`, subscriptions `0`, and
  Razorpay webhook events `4`.

No row contents, emails, identifiers, payment payloads, or credentials were
selected or retained in evidence. No production DDL, DML, migration,
backfill, deployment, payment, entitlement, or deletion operation occurred.

## Boundary

This materially advances the fresh-snapshot, restore, and current-migration
rehearsal subchecks for QUAL-WEB-005/DR. It does not close QUAL-WEB-005: the
hosted deletion worker, authenticated non-production deletion E2E, legal and
customer-held-record disposition, row-level deletion reconciliation,
deployment rollback, and independent acceptance evidence remain open.
