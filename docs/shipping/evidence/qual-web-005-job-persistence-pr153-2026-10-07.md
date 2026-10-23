# QUAL-WEB-005 user-scoped job persistence — 2026-10-07

## Batch boundary

- **Repository:** `verglos-web`
- **PR:** [#153](https://github.com/anuragyadav-git/verglos-web/pull/153)
- **Head:** `b91222a8d4d6ffd08f2be71391d89a6dafedab1`
- **Previous head:** `ade21b6f4c74b0a27bcf349bded6d9ceb7e39ee0`
- **Backlog:** `QUAL-WEB-005` attempted; remains unchecked.
- **Production state:** migration `0031` is source-only. No production/database
  write, migration, deletion, provider, payment, deployment, or browser
  mutation occurred.

## Implemented boundary

The deletion request route now inserts a durable user-scoped job in the same
database transaction as the request ledger row. The new job table has bounded
attempts, unique request/idempotency identity, due time, lease pairing, and
fail-closed status/kind checks. It is intentionally separate from the
organization-scoped generic queue. The route remains honest that the request is
pending reviewed worker execution; no deletion is triggered by the enqueue.

## Verification

- Focused deletion/route/contract tests: **16/16 pass**.
- Disposable PostgreSQL migration/constraint integration: **1/1 pass** using
  Docker PostgreSQL 16 in isolated `verglos_test` on localhost; the exact
  container was stopped after the run.
- Configured serial suite: **846 pass / 23 explicit skips / 0 fail**.
- `pnpm typecheck`: pass.
- `pnpm db:check`: pass.
- Ordered migration check: **32 migrations verified**.
- `VERCEL_ENV=preview NODE_ENV=production pnpm build`: pass; **38 pages**.
- `git diff --check`: pass.
- Host Node limitation: **26.4.0** versus repository Node **22.x** baseline.
- Hosted checks were pending immediately after push; no hosted success is
  claimed in this capture.

## Acceptance boundary

This is durable job persistence and atomic enqueue substrate, not
`QUAL-WEB-005` acceptance. The worker store adapter, fenced claim/retry SQL,
per-kind deletion transactions, row-count/audit reconciliation, restore and
rollback rehearsal, and authenticated non-production E2E remain open.
