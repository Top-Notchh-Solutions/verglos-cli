# PLAN-WEB-013/014 · refund ordering hardening · 2026-10-07

## Scope

- Repository: `verglos-web`
- Existing phase PR: #149
- Exact pushed head: `238ec7425ff1979b82d97e3d371cedbe83fbd394`
- Code commit: `238ec74` (`fix(billing): ignore stale refund observations`)
- Backlog IDs attempted: `PLAN-WEB-013`, `PLAN-WEB-014`
- Accepted IDs: none

## Change

`recordPaymentRefund` now rejects negative or over-amount values, but treats a
smaller refund watermark as an idempotent no-op. This prevents an older partial
refund webhook delivered after a full refund from moving durable state backwards
or causing provider retry churn. The license expiry is asserted unchanged by the
regressive observation.

## Verification

- Focused checkout/payment/webhook command: **17 passed, 1 skipped, 0 failed**;
  the single skip is the migrated-database billing integration when no fixture
  URL is supplied.
- TypeScript typecheck: passed.
- `git diff --check`: passed.
- Disposable Docker PostgreSQL 15 schema fixture using the repository's explicit
  `VERGLOS_ALLOW_DB_PUSH=1` local-only guard: passed.
- `ledger.integration.test.ts` against that fixture: **1/1 passed**.
- An empty database `drizzle-kit migrate` attempt correctly failed at migration
  `0000` because the reviewed legacy `licenses` baseline is absent; this is a
  fixture limitation, not migration acceptance evidence.
- Hosted Verify run `37632192255` for the pushed head completed **successfully**;
  prior-head hosted checks were not reused as current-head proof.

## Boundary and disposition

No Razorpay provider call, browser payment, webhook delivery, entitlement
change, production database/configuration/deployment operation, credential use,
or payment charge occurred. This is code-side lifecycle hardening only. The
account-enabled method matrix, provider success/failure/capture/refund/renewal/
cancellation/replay/out-of-order evidence, and production reconciliation remain
open for PLAN-WEB-013/014/015. Backlog remains **218 checked / 62 unchecked /
280 total (77.9%)**.
