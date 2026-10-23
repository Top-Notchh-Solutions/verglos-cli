# Gate 4 Docker payment integration qualification · 2026-10-10

## Fixture and migration boundary

- A new local-only PostgreSQL 15 container was started with bounded 1 GiB
  memory/2 CPU limits and bound only to `127.0.0.1`.
- The repository migration command first refused the empty database by its
  safety guard. It then ran with the explicit disposable-fixture bootstrap
  confirmation and applied the reviewed migration set successfully.
- The test container was stopped after qualification. Neon, Production, and
  any provider account were not used by this batch.

## Tests

The process set `PAYMENT_TEST_DATABASE_URL`, `BILLING_TEST_DATABASE_URL`, and
`TEST_DATABASE_URL` to the local isolated database, while `DATABASE_URL` was a
different local database name so the route contract could prove target
separation. No values were printed or persisted.

The following integration files ran together:

```text
src/app/api/razorpay/create-order/route.integration.test.ts
src/app/api/razorpay/create-subscription/route.integration.test.ts
src/lib/razorpay-webhook-events.integration.test.ts
src/lib/razorpay-webhook-handler.integration.test.ts
src/lib/billing/ledger.integration.test.ts
```

Result: **10 tests passed, 0 failed, 0 skipped**.

Coverage included server-catalog order and subscription binding, hosted-method
binding, subscription pending persistence, renewal ordering, webhook claim and
replay/identity-conflict handling, captured payment/refund projection,
failed-payment no-entitlement behavior, invoice-bound failed subscription
payment, and provider expiry without paid-time mutation.

## Acceptance boundary

This closes the prior local PostgreSQL skip and strengthens the isolated
code/integration evidence for Gate 4 and `PLAN-WEB-011/012/014/015`. It does
not prove real Razorpay authorization, provider-generated renewal/failure,
signed delivery from the provider, Production billing, or full hosted
reconciliation. The run used Node `v26.4.0` while the package requests Node
22.x; supported-runtime evidence remains separately governed by hosted checks.

No Neon, Production, provider, payment, entitlement, account, customer, or
manual-row write occurred. The only writes were disposable local Docker test
fixture rows, which the tests clean up. Score remains **219 checked / 61
unchecked / 280 total (78.2%)**; no checkbox changed.

