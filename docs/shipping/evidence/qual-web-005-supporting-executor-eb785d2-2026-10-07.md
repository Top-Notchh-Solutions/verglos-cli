# QUAL-WEB-005 supporting executor · 2026-10-07

## Exact candidate

- Web PR: `#153`
- Head: `eb785d2e382fc60535c15702fe7ffd8b9ae66610`
- Hosted Verify `37566730804` passed at the exact head; Vercel, GitGuardian,
  and Preview Comments passed
- PR state: open, not merged or deployed

## Delivered boundary

The Web account-deletion worker now executes the sixteen-table supporting
disposition registry under the existing lease fence. User/license-scoped
activation, report, heartbeat, CLI-auth, alert-dispatch, and monitor rows are
deleted in bounded transactions; users, licenses, provider/accounting rows,
unscoped telemetry, legacy public rows, customer-held digests, and the deletion
request ledger are retained. Every completed table operation writes a durable
idempotency receipt. Channel credentials are checked before any dependent
monitoring deletion and block closed when approval-gated credentials remain.

## Verification

- Worker unit suite: **4/4 pass**.
- Disposable PostgreSQL deletion-job integration: **1/1 pass**, including
  scoped deletes, durable 16-table receipts, replay idempotency, and the
  approval-gated channel-credential block.
- Full serialized Web suite: **868 pass / 1 explicit skip / 0 fail / 869
  total**.
- Typecheck, production build (38 routes), Drizzle schema check, ordered
  **35**-migration check, and diff hygiene pass.
- Disposable PostgreSQL fixture `verglos-qual-005-postgres` was stopped and
  removed after the run.

## Acceptance boundary

No production database write, migration, deletion, provider/payment operation,
deployment, or credential action occurred. QUAL-WEB-005 remains open pending
retained-row reconciliation evidence, restore/rollback rehearsal, and
authenticated non-production browser E2E. No backlog checkbox changed.
