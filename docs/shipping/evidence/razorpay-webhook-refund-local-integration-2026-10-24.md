# Razorpay webhook/refund local integration · 2026-10-24

## Isolated environment

- Web source: `9005d5ed5182b1d29159c0bb65c8ac696928baed`.
- Docker container: `verglos-full-serial-20261024`.
- Fresh local database: `verglos_webhook_20261024` on the container's mapped
  PostgreSQL port.
- The existing partially initialized `verglos_test` database was not repaired
  or deleted; its migration guard correctly refused a partial baseline.
- The fresh database was explicitly approved for local empty-database
  bootstrap, initialized with the reviewed legacy baseline, and then received
  **43** ordered migrations. No remote `.env.test.local` database was used.

## Verification

Command:

```text
pnpm test:payment-webhook-integration
```

The local database URL and synthetic signing secret were injected out of band
and are intentionally not retained in this packet.

Result: **4/4 passed**, **0 failed**, **0 skipped**.

The database-backed integration exercised:

- signed `payment.captured` entitlement creation and duplicate replay;
- partial, full, and stale refund watermark handling;
- failed hosted order without entitlement;
- failed subscription payment bound through its invoice; and
- provider subscription expiry without changing paid time.

The fixture uses synthetic local identities and cleans only its fixed fixture
rows inside the fresh isolated database. No customer data or Production
database was touched.

## Disposition

This proves the application-side signed refund/capture integration and
monotonic ledger behavior. It does not claim that Razorpay delivered the
external Test Mode refund webhook; the external provider receipt is recorded
separately in
`razorpay-testmode-capture-refund-lifecycle-2026-10-24.md`. It does not close
Production provider, customer/recipient, independent-review, field, AppSec/Hunt,
or final-release gates. No backlog checkbox changes; the authoritative score
remains **245 checked / 35 open / 280 total (87.5%)**. Nothing was deleted.
