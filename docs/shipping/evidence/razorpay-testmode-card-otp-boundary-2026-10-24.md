# Razorpay Test Mode app-bound Cards OTP boundary · 2026-10-24

## Scope

This record captures the next bounded step after the app-bound Cards fixture
boundary. The current Verglos order route was used with the owner-controlled
Razorpay Test Mode pair and an isolated local PostgreSQL database. No
Production credentials, customer identity, or card/OTP data is retained.

- Web source head: `791500d4dbc495312287287f692a6fc39120e3a2`
- Application database: isolated local Docker `verglos_test`
- Route: `POST /api/razorpay/create-order`
- Application method contract: `card` / Cards only
- Provider order: `orde…7SM3` (masked)
- Provider creation time: `2026-10-23T22:42:50Z`

## Observed provider state

- Application route: HTTP **200**
- Provider order read-back: HTTP **200**, status `created`
- Provider order notes: all 12 expected catalog, checkout-signature,
  identity, currency, term, method, and `verglos_checkout` keys present
- Hosted Checkout: Cards form rendered; the official Test Mode fixture reached
  the provider-owned **Sending OTP** state
- Provider order-payments read-back: HTTP **200**
- Payment records: **1**, status `created`, `captured: false`
- Application handler response: absent
- Signed payment webhook: absent

## Boundary and disposition

The provider has created a pending Test Mode payment, but it has not captured
the payment. No official OTP or provider terminal control was available in the
bounded run; no OTP was guessed, no webhook was fabricated, and no database
row was edited. No money was charged and no entitlement, Production, customer,
refund, or deletion state changed.

This advances the current app-bound provider lifecycle evidence but does not
close the provider-lifecycle gate or any dependent acceptance row. The
authoritative score remains **245 checked / 35 open / 280 total (87.5%)**,
partitioned as **13 AppSec-dependent / 22 non-AppSec** rows.
