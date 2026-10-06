# Web billing and Razorpay lifecycle focused qualification — 2026-10-06

Current Web source was run with:

```text
node --import tsx --test \
  src/lib/billing/checkout.test.ts \
  src/lib/razorpay.test.ts \
  src/lib/razorpay-route-error-contract.test.ts \
  src/lib/razorpay-webhook-handler.test.ts \
  src/lib/razorpay-webhook-events.integration.test.ts
```

Result: **20 tests, 18 passed, 0 failed, 2 skipped**, exit 0. Passing coverage
includes signed INR catalog binding, immutable checkout-note tamper rejection,
fail-closed QR creation, owner-bound QR status, captured-subscription identity,
single-grant behavior, failed/refunded payment handling, replay/in-flight and
identity-conflict semantics, malformed-input denial, configuration bounds, and
expiry behavior. The two skips are PostgreSQL-backed lifecycle tests because no
database integration environment was enabled for this local run.

This is focused implementation evidence only. It does not prove a real
provider capture, signed production webhook delivery, refund/renewal through
Razorpay, or production reconciliation; PLAN-WEB-011/012 remain open.
