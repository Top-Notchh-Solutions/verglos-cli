# PLAN-WEB-014 Preview Cards capture and webhook timing boundary — 2026-10-11

## Scope

This private evidence records the isolated Preview provider result after the
Final V1 switch to Cards-only one-time prepaid billing. It does not authorize
Production payment, database, entitlement, or account writes.

- Environment: isolated Vercel Preview
- Provider: Razorpay Test Mode
- Billing: one-time prepaid fixed-term access; customer-initiated manual renewal
- Hosted method: Cards only
- Current Preview webhook target: the deployment that processed this run,
  configured for `payment.captured`, `payment.failed`, and `refund.processed`

## Observed provider result

The official Razorpay Test Mode domestic card fixture completed the hosted
card/OTP flow and Razorpay displayed a captured payment for the canonical Pro
monthly amount. The provider dashboard showed the payment as **Captured**.

The webhook target for this exact Preview deployment was enabled after that
payment had already been captured. Razorpay did not deliver a historical event
to a target created later, and the application therefore remained in its
signed-webhook-waiting state. No event was replayed or synthesized.

## Result

- **Proven:** canonical server-owned order creation, Cards-only hosted
  Checkout, official Test Mode card/OTP completion, and provider-side capture.
- **Not proven:** signed `payment.captured` delivery for this order, ledger
  credit, fixed-term entitlement, refund, expiry, second manual-renewal order,
  replay/out-of-order reconciliation, timeout/retry, and exactly-once behavior.
- **Safety:** no guessed OTP, fake provider event, direct database edit,
  Production payment, Production database write, or manual entitlement grant.

## Disposition

Keep `PLAN-WEB-014`, `PLAN-WEB-015`, and Gate 4 open. A fresh payment after the
enabled webhook target is in place is required to prove the signed delivery
and entitlement path; then the remaining refund, expiry, and manual-renewal
cases must be reconciled in isolated Preview.
