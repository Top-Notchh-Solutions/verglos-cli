# PLAN-WEB-014 · Test Mode card activation boundary

Date: 2026-10-10

## Scope

- Active backlog item: `PLAN-WEB-014`.
- Release candidate method set: `card` only.
- Test surface: the known Test Mode Razorpay subscription harness already open
  in the authenticated Chrome session, separate from the old Production
  checkout tabs.

## Bounded operation

- The harness was verified to contain a Test Mode provider key and a
  subscription fixture, then reached the provider checkout.
- The Cards tab was selected and the official provider test-card fixture was
  entered. Card values are intentionally not recorded.
- One DOM activation and one real viewport-coordinate activation were attempted
  on the same known Test Mode frame. No OTP was guessed or entered.

## Result

- The provider remained on the card form. No OTP prompt, success result,
  failure result, or terminal checkout event appeared.
- A read-only provider recheck remained HTTP 200 with 36 subscriptions in
  statuses `created:15`, `cancelled:16`, `active:5`, and 35 payments in
  statuses `created:4`, `failed:15`, `captured:13`, `refunded:3`.
- A read-only isolated database recheck remained unchanged at application
  subscriptions `active:5`, `cancelled:8`, `pending:23`; payments
  `captured:3`, `failed:3`, `partially_refunded:1`, `refunded:3`; active
  licenses `2`; and completed webhook events `70`.
- No successful provider authorization/capture, signed webhook, new payment
  row, ledger row, entitlement/license change, account-access change, or
  Production write was observed.

## Runtime configuration cross-check

Razorpay's current official Web Checkout sample for showing only Cards uses a
single `card` instrument, a single display block, a matching block sequence,
and `preferences.show_default_blocks: false`. Verglos' helper implements that
shape and `checkout-client.tsx` passes it to both the order and subscription
Checkout constructors. This validates the code-side configuration contract;
it does not substitute for opening the real application-hosted modal and
completing a provider authorization.

Source: <https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/configure-payment-methods/sample-code>.

## Disposition

This is concrete provider/browser activation evidence, not a payment success.
The missing artifact is a provider-supported recurring-card authorization and
its signed delivery into isolated Preview, followed by exactly-once
payment/ledger/license reconciliation. The responsible owner is the
authorized payment-test operator together with Razorpay Test Mode provider
operations. The safe next action is to use a provider-supported Test Mode
subscription fixture or a real operator activation/OTP path; do not guess OTPs,
edit database rows, or grant entitlements manually. Review this disposition by
2026-10-11 IST or when the provider fixture changes.

Gate 4 and `PLAN-WEB-014` remain open. Production recurring billing remains
fail-closed. The backlog remains **219 checked / 61 unchecked / 280 total
(78.2%)**.

Secrets, database URLs, cookies, authorization headers, personal data, raw
provider payloads, full provider identifiers, and card values are omitted.
