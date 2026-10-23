# PLAN-WEB-012 local lifecycle pass and provider-evidence block — 2026-10-10

## Local isolated result

A disposable local PostgreSQL 15 container was booted as `verglos_test` on an
explicit loopback port. The reviewed legacy baseline and migrations were
initialized only inside that container. The payment webhook integration then
passed **5/5** with 0 failures:

1. captured payment grants once, records refunds monotonically, and survives
   replay;
2. failed hosted order does not grant entitlement;
3. failed subscription payment binds through its invoice;
4. paid subscription invoice reconciles exactly once; and
5. subscription expiry does not change paid time.

The container was removed by an exit trap after the run. No Neon, Production,
provider, entitlement, customer, or persistent database state was touched.
The remote Neon `TEST_DATABASE_URL` was intentionally rejected by the test's
local-isolation guard and was not used for this write-capable integration.

## Why PLAN-WEB-012 remains open

The backlog item requires current provider-generated, signed evidence for the
remaining lifecycle matrix:

- renewal/second charge;
- provider failure and expiry delivery;
- subscription refund, replay, and out-of-order delivery;
- timeout/retry behavior; and
- complete payment → ledger → license reconciliation across those events.

Synthetic/local webhook fixtures prove the application boundary but cannot
prove Razorpay delivery timing or provider state transitions. Keep
`PLAN-WEB-012` unchecked and park it. No Production Test Mode plan IDs or
payment credentials are enabled, and no Production payment write is justified
by this local result.

## Owner and unblock

Owner: authorized Razorpay Test Mode operator/provider support.

Unblock artifact: a provider-supported canonical-price recurring fixture that
produces the missing signed events, followed by read-only isolated database
reconciliation and redacted identifiers.

Review: 2026-10-11 IST or on provider-fixture change.
