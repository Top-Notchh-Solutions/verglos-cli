# Razorpay Test Mode app-bound provider-attempted receipt · 2026-10-24

## Read-only provider recheck

The latest owner-controlled Test Mode Orders API read-back found the same
app-bound Cards-only order now in provider status **`attempted`**. The order
was created at `2026-10-23T22:42:50Z`; no new order was created by this
recheck. The order ID is retained only in masked form.

- Provider order: `orde…7SM3` (masked)
- Amount/currency: **280,943 paise / INR**
- Order status: **`attempted`**
- Order notes: all 12 expected catalog, checkout-signature, identity, term,
  currency, method, and `verglos_checkout` keys present
- Order-payments response: HTTP **200**
- Payment count: **1**
- Payment: `card`, status **`created`**, `captured: false` (masked payment ID)
- Payment creation time: `2026-10-23T22:43:07Z`

## Boundary

This is a stronger provider-side read-back after the hosted Checkout reached
`Sending OTP`, but it is not a terminal payment result. No capture, signed
webhook, handler response, entitlement, refund, Production payment, customer
state, money movement, guessed OTP, fabricated event, or database edit was
observed. The provider lifecycle gate remains open and no backlog checkbox
changed. The authoritative score remains **245 checked / 35 open / 280 total
(87.5%)**, partitioned as **13 AppSec-dependent / 22 non-AppSec** rows.
