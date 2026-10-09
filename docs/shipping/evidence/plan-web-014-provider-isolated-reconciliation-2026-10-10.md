# PLAN-WEB-014 isolated Test Mode provider reconciliation — 2026-10-10

## Scope

Read-only reconciliation of Razorpay Test Mode inventory against the isolated
Neon test database. No Production database, provider, payment, entitlement,
account, customer, or manual-row write was performed.

## Result

- Provider inventory contained **34 subscriptions**; the isolated application
  contained **34 subscription rows** with provider IDs.
- All 34 subscription IDs matched in both directions; there were zero
  provider-only and zero application-only subscription IDs.
- Provider status totals were **5 active, 16 cancelled, 13 created**.
- Application status totals were **5 active, 8 cancelled, 21 pending**.
- The 5 active subscriptions matched `active`; the 13 provider `created`
  subscriptions matched application `pending`; 8 provider `cancelled`
  subscriptions matched application `cancelled`; and **8 provider
  `cancelled` subscriptions still matched application `pending`**.
- Provider inventory contained **33 payments**; the isolated application
  contained **9 payment rows** with provider IDs. All 9 application payment
  IDs matched a provider record, but 24 provider payment records had no
  application row. Provider-only records are not counted as application
  fulfillment evidence.
- Matched payment projections were consistent for the observed rows:
  3 captured, 2 failed, 1 partially refunded, and 3 refunded. The
  partially-refunded application row corresponded to a provider payment still
  reported as captured with a refund watermark, which is expected under the
  ledger policy.

## Decision

This is real reconciliation evidence and narrows the remaining defect to
provider delivery/projection coverage. It does **not** close Gate 4 or
`PLAN-WEB-011`, `PLAN-WEB-012`, `PLAN-WEB-014`, or `PLAN-WEB-015`: the eight
cancelled-but-pending rows, provider-only payment records, complete signed
delivery/replay/order evidence, renewal/failure/expiry/timeout coverage,
exactly-once behavior, and final Production reconciliation still require
resolution and evidence.

The next safe operation is an authorized provider-supported delivery or replay
for the eight cancelled subscriptions into the isolated webhook, followed by a
fresh read-only reconciliation. No manual database repair or entitlement
grant is permitted.

## Score and boundary

Backlog remains **219 checked / 61 unchecked / 280 total (78.2%)**. No
checkbox changed. The earlier change from 218/62 to 219/61 was the acceptance
of `PLAN-WEB-013`, not this reconciliation.

