# Razorpay Test Mode app-bound Cards fixture boundary · 2026-10-24

## Scope

This is a bounded Test Mode run through the current Verglos order route and a
local hosted Checkout harness. It uses the owner-controlled Test Mode pair and
an isolated local PostgreSQL database. No Production credential or customer
identity was used. The official Razorpay Test Mode card fixture was used, but
its number, CVV, expiry, OTP, raw payloads, and provider identifiers are not
retained.

- Web source head: `791500d4dbc495312287287f692a6fc39120e3a2`
- Application database: isolated local Docker `verglos_test`
- Application route: `POST /api/razorpay/create-order`
- Provider mode: Test Mode
- Checkout method returned by the application: `card` / Cards only
- Synthetic prefill: `+91 90000 90000`, `test@example.com`

## Observed result

- Application order route: HTTP **200**
- Provider order read-back: HTTP **200**
- Provider order: `orde…PzIh` (masked)
- Provider creation time: `2026-10-23T22:39:50Z`
- Provider order status: `created`
- Amount: **280,943 paise / INR 2,809.43**
- Provider order notes: all 12 expected catalog, checkout-signature,
  identity, currency, term, method, and `verglos_checkout` keys present
- Provider `GET /v1/orders/{id}/payments`: HTTP **200**, **0** payment records

The hosted harness rendered the Cards method and accepted the documented card
fixture through the card form. Razorpay returned to the card form without a
terminal success/failure screen, handler response, OTP completion, payment
record, or webhook. The browser therefore did not create a capture or payment.

## Safety and disposition

No money was charged. No payment, capture, refund, webhook, entitlement,
Production database, customer state, or deletion occurred. No provider event
was fabricated and no database row was manually edited.

This strengthens the current `ACCEPT-003` provider-boundary packet and proves
the current app-bound Cards-only order plus hosted-form boundary. It does not
close the provider-lifecycle gate or any dependent row because the provider
did not emit a terminal payment result. No backlog checkbox or score changed;
the authoritative score remains **245 checked / 35 open / 280 total (87.5%)**,
partitioned as **13 AppSec-dependent / 22 non-AppSec** rows.

Official Test Mode fixture reference:
<https://razorpay.com/docs/payments/server-integration/python/integration-steps>.
