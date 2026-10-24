# Razorpay Test Mode capture/refund lifecycle · 2026-10-24

## Scope and safety boundary

This is an owner-controlled Razorpay **Test Mode** lifecycle using the
existing synthetic checkout order. It used test credentials only and moved no
real money. No Production payment, live key, customer data, stable release,
GitHub Actions run, or npm publication was used.

## Provider receipt

The pre-action read-only lookup returned HTTP 200 for order
`order_TrXOfcG0B3WYN0` with state `paid`, amount `280943` paise / INR, one
attempt, and the bound payment `pay_TrXOmx4SSAS4iQ` with state `captured` and
`captured: true`.

The full refund request was sent to the Test Mode provider endpoint for that
exact payment with the bounded purpose note
`verglos-v1-testmode-lifecycle-rehearsal`. The provider returned HTTP 200 and
refund `rfnd_TrXb712V0DFjQm`, amount `280943` paise / INR, payment binding
`pay_TrXOmx4SSAS4iQ`, and initial state `pending`. The provider creation time
was `2026-10-24T00:04:16Z`.

The immediate read-only refund poll returned `processed`. A final read-only
payment/refund lookup returned:

- payment state: `refunded`;
- payment `captured`: `true`;
- payment `refund_status`: `full`;
- payment amount refunded: `280943` paise;
- refund state: `processed`;
- refund amount: `280943` paise;
- refund/payment binding: exact.

## Disposition

This is genuine no-money provider Test Mode capture-plus-refund evidence. It
advances the provider lifecycle rehearsal and is not an externally delivered
webhook, Production provider action, customer acceptance, independent review,
or final release decision. No backlog checkbox is changed; the authoritative
score remains **245 checked / 35 open / 280 total (87.5%)**, partitioned as
**13 AppSec-dependent / 22 non-AppSec** rows. Nothing was deleted.
