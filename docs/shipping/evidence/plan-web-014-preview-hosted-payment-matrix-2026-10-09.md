# PLAN-WEB-014 — Preview hosted payment-matrix qualification

Date: 2026-10-09

## Scope

This record covers only the isolated Preview hosted checkout qualification.
Razorpay was in Test Mode and the Preview deployment used the isolated test
database. Production credentials, production database state, and live payment
capture were not used.

## Application boundary results

- The Preview checkout displayed the canonical monthly Pro catalog amount.
- The application displayed the configured hosted methods: UPI, Cards,
  Netbanking, Wallets, EMI, and Pay Later.
- `POST /api/razorpay/create-order` returned HTTP 200 for fresh checkout
  attempts.
- `GET /api/razorpay/order-status` returned HTTP 200 and a read-only
  `pending` result while the provider checkout was incomplete.
- Closing or canceling the hosted checkout returned the application to a
  retryable state with a failure/cancellation message.
- No entitlement, license, production database, or live payment write was
  observed.

## Provider Test Mode results

- The hosted UPI branch exposed a QR-only screen in this browser session; no
  UPI-ID input was available to enter the documented provider simulator value.
- The hosted card branch accepted a public Razorpay test card and reached the
  provider's simulated `Sending OTP` state. Waiting for the provider flow did
  not produce a completion control; canceling returned a provider failure.
- The hosted netbanking branch exposed the bank list and reached the
  provider's simulated processing state. Waiting did not produce a success or
  failure completion control; canceling returned a provider failure.
- Earlier hosted Wallet and Pay Later attempts reached provider OTP/eligibility
  screens and were canceled without a capture.

## Gate decision

Gate 4 remains **open**. The application-side method catalog, canonical-price
binding, order creation, status polling, and failure/cancellation behavior are
proven. The complete hosted payment lifecycle is not proven because this
provider session produced no successful capture, signed webhook delivery,
refund, or entitlement/license reconciliation.

This is an external Razorpay Test Mode simulator limitation observed through
the real hosted checkout, not a reason to fabricate a payment or synthesize a
success webhook. The official Razorpay test-integration documentation says
Test Mode is a mock payment page and expects a successful test transaction to
be verified through the payment status/webhook path:
https://razorpay.com/docs/server-integration/python/test-app/

## Backlog accounting

No authoritative backlog checkbox changed. The current count remains
**218 checked / 62 unchecked / 280 total (77.9%)**.
