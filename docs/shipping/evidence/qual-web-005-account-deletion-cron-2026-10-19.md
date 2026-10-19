# QUAL-WEB-005 account-deletion worker scheduler

## Scope

This packet records the missing production trigger for the already-reviewed
account-deletion request/worker path. It does not claim that a customer
deletion was executed, that legal or consent decisions were made, or that
Production data was changed.

## Public implementation

- Repository: `anuragyadav-git/verglos-web`
- Pull request: #221, merged normally (no squash or rebase)
- Implementation commits: `80a95ba` and `6dfab4e`
- Merge commit: `0719074d5a6f83198f5e36c0eeb064f2a12e1b1b`
- Branch: `codex/qual-web-005-account-deletion-cron-20261019`
- Workflow: `.github/workflows/account-deletion-cron.yml`
- Contract test: `src/lib/account-deletion-cron-workflow.test.ts`

The workflow invokes `/api/cron/account-deletion` every 15 minutes with
serialized concurrency, a six-minute job bound, HTTPS-only base-URL
validation, the existing `CRON_SECRET` bearer contract, no redirect following,
and a 300-second HTTP timeout. It fails closed on non-2xx responses and on a
JSON response whose `ok` field is not `true`. The existing worker remains the
owner of leases, inventory checks, legal holds, idempotent dispositions, and
source-free receipts; customer-held signed records remain outside its delete
scope.

## Local qualification

In a clean worktree from Web `origin/main`:

- `pnpm install --frozen-lockfile`: passed.
- `pnpm typecheck`: passed.
- `pnpm test:account-deletion-cron`: **1/1 passed, 0 failed, 0 skipped**.
- `git diff --check`: passed.

## Hosted qualification

- Web verify run `39184660990`: `typecheck-and-schema` passed.
- Web protocol matrix run `39184661099`, rerun attempt 2: Ubuntu job
  `117845084432`, macOS job `117845116570`, and Windows job `117845110401`
  passed.
- Isolated PostgreSQL lifecycle rerun job `117845082816` passed.
- Vercel deployment, Vercel Preview Comments, and GitGuardian passed.
- The first PostgreSQL attempt job `117844421743` failed before checkout because
  the hosted runner could not pull the pinned public ECR image (`Data limit
  exceeded`); the job was rerun without source changes and passed.

## Disposition

This closes the missing code-side scheduling gap for QUAL-WEB-005, but the
backlog row remains unchecked. It still requires authenticated non-production
deletion E2E, the legal/customer-held-record decision, consent inventory,
Production migration authorization, restore/rollback acceptance, row
reconciliation, and independent end-to-end acceptance. No Production,
provider, customer, payment, or AppSec state changed.

AppSec/Hunt-held rows remain unchanged. This evidence does not authorize
arbitrary execution or substitute for the independent Hunt review.
