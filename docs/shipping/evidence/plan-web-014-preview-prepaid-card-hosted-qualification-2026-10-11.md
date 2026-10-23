# PLAN-WEB-014 Preview prepaid-card hosted qualification — 2026-10-11

## Scope

This is a private qualification record for the Final V1 Cards-only, one-time
prepaid Pro order path. It does not qualify the retired recurring-subscription
promise and does not authorize Production payment or entitlement writes.

- Web commit: `887249d9f4d09842107fc6636b239af9f67b91d4`
- Final Preview deployment: `dpl_7oCmrMDHmEtXgk32tjeRaRdy68vp`
- Environment: Vercel Preview only
- Database: the deployment reported the required isolated Preview marker; the
  database value was not copied into this record
- Provider: Razorpay Test Mode
- Catalog: Pro monthly, INR, **280,943 paise / ₹2,809.43**, 30 days,
  `2026-10-02.0`
- Enabled hosted methods: **Cards only**

Preview fixture authentication was refreshed only through Vercel's Preview
environment variables. The secret, database URL, provider secret, and bypass
value are intentionally absent from this record.

## Hosted run

1. The Preview checkout rendered the Test Mode notice, the fixed-term manual
   renewal copy, and only the Cards method.
2. The application `POST /api/razorpay/create-order` returned HTTP **200**
   for the canonical monthly cadence and returned the server-owned amount,
   currency, duration, catalog version, Test Mode flag, and Cards-only method
   list.
3. Razorpay hosted Checkout opened in Test Mode with the explicit `Pay via
   Card` block. No provider-default payment blocks were displayed.
4. The official Razorpay domestic Visa Test Mode card was entered with a
   future expiry and random CVV. Razorpay returned HTTP **200** for its card
   payment-create request and HTTP **200** for its consent request.
5. Razorpay then remained at its provider-owned `Sending OTP` state. No
   official OTP or provider control produced a terminal captured, failed, or
   refunded result in this run. The app status route returned HTTP **200** with
   `status: pending`.

Razorpay's public integration documentation identifies the card fixture and
states that Test Mode uses simulated payments; it does not provide an OTP for
this account/browser run. The exact provider documentation was consulted on
2026-10-11 and is not treated as a substitute for the missing terminal event.

## Result and boundary

- **Passed:** Preview isolation marker, canonical catalog binding, Cards-only
  display, order creation, hosted Checkout launch, provider card request, and
  provider consent request.
- **Not proven:** signed `payment.captured` delivery, payment-ledger capture,
  fixed-term entitlement grant, failure/recovery, partial/full refund,
  expiry, manual renewal with a second order, replay/order reconciliation, and
  exactly-once behavior.
- **State observed:** the created application order remained `pending`; no
  entitlement was granted.
- **Production:** no Production checkout, payment, database, migration,
  entitlement, account, organization, or customer-data write occurred.
- **Decision:** keep `PLAN-WEB-014`, `PLAN-WEB-015`, and Gate 4 open. Do not
  check a backlog row on display or order-creation evidence alone.

## Required next artifact

An authorized operator must either complete the provider's official Test Mode
OTP/fixture path or provide a supported provider terminal-event/replay control.
Do not guess OTPs, fabricate webhooks, edit database rows, or grant an
entitlement manually. Once a terminal provider event exists, reconcile the
signed webhook, payment ledger, fixed-term entitlement, and manual-renewal
second order in isolated Preview.

