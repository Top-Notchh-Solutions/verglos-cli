# QUAL-WEB-005 worker scope-fence correction — 2026-10-07

## Batch boundary

- **Repository:** `verglos-web`
- **PR:** [#153](https://github.com/anuragyadav-git/verglos-web/pull/153)
- **Head:** `ade21b6f4c74b0a27bcf349bded6d9ceb7e39ee0`
- **Previous head:** `aef06b70f1b16d2c4ade4edd43d236b80a0d0b19`
- **Backlog:** `QUAL-WEB-005` attempted; remains unchecked.
- **Production state:** no production/database/provider/payment/deployment write,
  migration, deletion, or browser mutation occurred.

## Correction

The worker now validates the claimed job's persisted `userId` against the
invocation scope before reading deletion state or calling any deletion adapter.
A mismatch is blocked with the stable `user_scope_mismatch` reason. The worker
continues to use the claimed job's requested scope, requires fenced calls and a
terminal audit receipt, and maps adapter exceptions to the stable
`ACCOUNT_DELETION_WORKER_FAILED` retry code without persisting raw exception
text.

## Verification

- Worker/deletion/inventory/hold/digest focus: **32/32 pass**.
- Negative-boundary suite: **2/2 pass**.
- `pnpm typecheck`: pass.
- `git diff --check`: pass.
- Docker prerequisite probe: Docker **29.7.2**, 8 CPUs, approximately 7.7 GiB
  reported memory; no deletion integration container was started.
- Hosted workflow `37560704115`, job `112597060041`, passed; Vercel,
  GitGuardian, and Preview Comments also passed. PR #153 remains open and
  mergeable at this head.

## Acceptance boundary

This is still a worker-contract correction, not `QUAL-WEB-005` acceptance.
There is no production store adapter, deletion-job migration/route, destructive
SQL execution, row-count reconciliation receipt, restore/rollback rehearsal,
or authenticated non-production end-to-end run. Migrations `0029` and `0030`
remain source-only and unapplied to production.
