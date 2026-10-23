# QUAL-WEB-005 current merged Web-head contract run · 2026-10-23

## Exact boundary

- **Web source:** authoritative merged `main` at
  `0c2b3065efb32525e42af3b2e8c0cd67a91a00d9` (PR #254 merge head).
- **Worktree:** clean detached worktree at
  `.worktrees/web-qual005-current-0c2b306-20261023`.
- **Runtime:** Node `v26.4.0` and pnpm `10.34.5`; the repository requests
  Node `22.x`, so the engine warning is retained as part of the evidence.
- **Database boundary:** no `DATABASE_URL` or `TEST_DATABASE_URL` was
  sourced, no Docker PostgreSQL container was running, and the owner-provided
  `.env.test.local` was not contacted or mutated.

## Verification

`pnpm install --frozen-lockfile` completed successfully. The serial focused
command ran the current merged-head privacy/deletion contract set:

```text
node --import tsx --test --test-concurrency=1 \
  src/lib/qual/qual-web-suites.test.ts \
  src/lib/qual/account-deletion-holds.test.ts \
  src/lib/qual/account-deletion-inventory.test.ts \
  src/lib/qual/account-deletion-worker.test.ts \
  src/lib/qual/account-deletion-jobs.integration.test.ts \
  src/app/api/v1/account/deletion/route.integration.test.ts \
  src/lib/account-deletion-cron-workflow.test.ts
```

Result: **47 tests, 45 passed, 0 failed, 2 skipped**. The skipped cases are
the PostgreSQL-backed deletion-job integration and authenticated deletion-route
integration; both explicitly require an isolated `verglos_test` database.
All unit, worker, hold, inventory, scope, idempotency, privacy, and cron
contract cases passed. `pnpm typecheck` also passed.

This packet is included in the private acceptance bundle. The generated
bundle's file count, manifest digest, and file digest are recorded in the
shipping ledger and goal after generation; this evidence file does not embed
those self-referential values.

## Disposition

This is current merged-head implementation/contract evidence only. It does not
close `QUAL-WEB-005`: the isolated migrated database run, authenticated route
execution, legal/retention and customer-held-record disposition, authorized
Production migration and restore/rollback, reconciliation, independent review,
and final acceptance remain open. No deletion, database mutation, customer,
provider, Production, deployment, or release action occurred; nothing was
deleted or overwritten.
