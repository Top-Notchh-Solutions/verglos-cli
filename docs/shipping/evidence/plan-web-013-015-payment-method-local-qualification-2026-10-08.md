# Payment method and lifecycle local qualification

Date: 2026-10-08
Status: local implementation evidence only; payment backlog items remain open.

## Verification

Command:

```text
node --import tsx --test \
  src/lib/billing/payment-methods.test.ts \
  src/lib/billing/checkout.test.ts \
  src/lib/runtime-config.test.ts \
  src/lib/razorpay.test.ts \
  src/lib/razorpay-webhook-handler.test.ts \
  src/lib/razorpay-route-error-contract.test.ts \
  src/app/api/razorpay/create-order/route.integration.test.ts
```

Result: 58 tests; 56 passed, 0 failed, 2 expected PostgreSQL-gated skips.

## Observed safeguards

- Hosted checkout exposes every explicitly configured supported method: UPI,
  cards, netbanking, wallets, EMI, and Pay Later.
- QR is an explicit separate adapter and a QR-only production configuration is
  rejected.
- The server catalog controls amount, currency, plan, cadence, and the signed
  checkout method set; client price or plan input is not accepted.
- Webhook handling remains authoritative for capture, failure, refund,
  renewal, replay, conflict, and out-of-order lifecycle decisions.
- Missing or malformed payment configuration fails closed and provider error
  details are not returned to clients.

## Limitation

This run does not qualify a real Razorpay Test Mode credential, hosted success,
capture, refund, renewal, or production reconciliation. No provider, payment,
database, entitlement, or deployment write occurred.
