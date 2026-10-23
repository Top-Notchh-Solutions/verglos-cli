# Web serial PostgreSQL qualification · 2026-10-07

## Scope

This batch reran the configured Web PostgreSQL-backed tests through the
repository's existing `test:serial` harness after the prior parallel run
stalled. The harness forces Node test concurrency to one because the disposable
database fixtures create and drop shared tables/extensions. It does not close
hosted, provider, production, or customer acceptance gates.

Repository: `verglos-web` main at `cbc0f5a89179995569308695419d4578c57ce716`.
Local Node: `v26.4.0`; package baseline: Node `22.x`.

## Evidence

A fresh Docker `postgres:18-alpine` container named
`verglos-serial-web-test-postgres` used host port `55444` and database
`verglos_test`. The existing command was run as:

```text
TEST_DATABASE_URL=postgres://postgres@127.0.0.1:55444/verglos_test pnpm test:serial
```

Results:

- pretest: 48 passed, 0 failed, 0 skipped;
- configured Web suite: 867 passed, 0 failed, 1 skipped;
- the one skip is the billing-ledger integration, which requires a separately
  migrated baseline through `BILLING_TEST_DATABASE_URL`.

The prior apparent queue fairness and worker-crash failures pass in this
serial run. Usage, queue, organization, Razorpay, tenant, migration, and
security-backed tests completed without failure. The temporary container was
stopped after the run.

## Billing baseline qualification

A separate fresh Docker `postgres:18-alpine` container named
`verglos-billing-migrated-test-postgres` used host port `55445`. The documented
synthetic legacy `users`/`licenses` baseline was created only in that temporary
database because migration `0000` intentionally requires the legacy table. All
current migrations applied successfully, then this command passed:

```text
BILLING_TEST_DATABASE_URL=postgres://postgres@127.0.0.1:55445/verglos_test \
  node --import tsx --test src/lib/billing/ledger.integration.test.ts
```

Result: 1 passed, 0 failed, 0 skipped. The container was stopped afterward.

## Acceptance boundary

This closes the local test-harness qualification limitation for the serial
path, but it does not make the parallel `pnpm test` invocation green and does
not close any product acceptance item. QUAL-WEB-005/006, PLAN-WEB-014,
ACCEPT-002/003, provider lifecycle, production migration/recovery, GitHub
cutover, R-041, and final POC evidence remain open. Backlog remains
**218 checked / 62 unchecked / 280 total**.

No production database/provider/payment/deployment/migration, credential, or
customer operation occurred.
