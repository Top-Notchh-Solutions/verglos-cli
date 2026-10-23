# QUAL-WEB-005 isolated current-head integration — 2026-10-23

The current authoritative Web head
`0c2b3065efb32525e42af3b2e8c0cd67a91a00d9` was tested in the clean detached
worktree
`/Users/anuragyadav/Developer/TopNotchh-Workspace/.worktrees/web-qual005-current-0c2b306-20261023`.

## Isolated database

- Container: `verglos-qual-web-005-postgres-20261023`
- Image: `postgres:16-alpine`
- Endpoint: local `127.0.0.1:55437`, database `verglos_test`
- Database was empty before this run and received the current migrations only.
- Migration count after `pnpm db:migrate`: **43**.
- The supplied remote Neon `TEST_DATABASE_URL` was not used.

## Verification

The focused current-head command was run with a redacted local
`TEST_DATABASE_URL` pointing to the isolated endpoint above:

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

- Tests: **47/47 passed, 0 failed, 0 skipped**.
- `pnpm typecheck`: passed.
- `git diff --check`: passed.
- The route integration created and processed its isolated fixture, then
  cleaned it; the post-run fixture-user count was **0**.

This closes the local database-environment gap in the QUAL-WEB-005 evidence
path. It does not claim Production migration, legal/retention disposition,
customer-held-record acceptance, independent review, or final release
acceptance; the backlog row remains open for those declared conditions.
