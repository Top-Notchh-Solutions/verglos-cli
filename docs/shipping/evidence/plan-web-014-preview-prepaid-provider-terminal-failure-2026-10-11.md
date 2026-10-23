# PLAN-WEB-014 Preview prepaid-card provider terminal boundary — 2026-10-11

## Scope

This is a private addendum to the isolated Preview Cards-only qualification.
It records provider behavior only; it does not authorize Production payment,
database, entitlement, or account writes.

- Environment: Vercel Preview with the required isolation marker
- Provider: Razorpay Test Mode
- Billing contract: one-time prepaid fixed-term access with customer-initiated
  manual renewal
- Enabled hosted method: Cards only
- No provider secret, database URL, bypass value, payment identifier, or
  customer record is stored here

## Controlled hosted attempts

1. The Preview application created the canonical server-owned order and opened
   Razorpay hosted Checkout. The Checkout displayed only the Cards path.
2. An official Razorpay domestic Test Mode card reached the provider payment
   flow, then the provider displayed **Payment could not be completed**.
3. A second official domestic Test Mode card reached the provider's
   `Sending OTP` state, then the provider displayed the same failure result.
4. No provider success control, official OTP, signed terminal webhook, or
   provider-captured payment was observed. The application never received a
   captured payment to reconcile.

The official provider documentation says Test Mode is simulated and documents
the supported test-card flow, but this account/browser run did not expose a
successful terminal control. No OTP was guessed.

## Result

- **Proven:** isolated Preview, canonical order creation, Cards-only method
  binding, hosted Checkout launch, and provider-side failure presentation.
- **Not proven:** capture, signed `payment.captured`, ledger credit, fixed-term
  entitlement, refund, expiry, second manual-renewal order, replay/
  out-of-order reconciliation, timeout/retry, and exactly-once behavior.
- **Safety:** no synthetic webhook, direct database edit, manual entitlement
  grant, Production payment, or Production state change occurred.

## Disposition

Keep `PLAN-WEB-014`, `PLAN-WEB-015`, and Gate 4 open. The remaining payment
evidence requires a provider-supported successful Test Mode terminal flow or a
provider-supported replay/control. Do not treat this failure as a successful
capture and do not fabricate the missing provider event.
