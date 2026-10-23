# Razorpay Test Mode captured UPI and local entitlement receipt · 2026-10-24

## Provider terminal receipt

An owner-controlled local checkout used Razorpay **Test Mode** credentials,
an isolated PostgreSQL database, a synthetic owner identity, and Razorpay's
documented test UPI identifier `success@razorpay`. No live key or real-money
payment was used.

- Checkout route: local Web `/checkout` at `127.0.0.1:3100`.
- Browser path: hosted Razorpay Checkout, mobile viewport, UPI ID flow.
- Provider key class: `rzp_test_…` (the full key is not recorded).
- Provider order: `orde…G0B3WYN0` (masked).
- Provider payment: `pay_…S4iQ` (masked).
- Provider order creation: `2026-10-23T23:52:30.000Z`.
- Provider payment creation: `2026-10-23T23:52:37.000Z`.
- Read-only Orders API: HTTP 200, status **`paid`**, one attempt.
- Read-only Payments API: HTTP 200, one payment, method **`upi`**, status
  **`captured`**, `captured: true`.
- Bound amount/currency: **280,943 paise / INR**.
- Provider notes bound the user, checkout, Pro/monthly catalog, INR amount,
  30-day term, catalog version, and configured payment methods.

Razorpay's Test Mode is a simulated payment environment; the fixture did not
move real money. The provider read-back is a real Test Mode receipt, not a
fabricated payment record.

## Isolated application integration receipt

The local application first observed the captured provider order as processing
because no externally delivered webhook had reached the local server. A
separately identified, HMAC-signed **local replay** of the exact captured
provider payment was then sent to the isolated local webhook route:

- Event: `payment.captured`.
- Local event ID: `evt_local_provider_capture_20261024_01`.
- Local webhook response: HTTP **200**, `{"received":true}`.
- Local owner-bound order-status response afterward: HTTP **200**,
  `{"status":"paid","licenseKey":"<redacted>"}`.
- Database: local `verglos_checkout_20261024`; no Production database write.

This proves the application-side signed-handler, binding, idempotent payment
credit, and local entitlement projection against the provider's actual
Test-Mode read-back. The local replay is explicitly **not** represented as an
externally delivered Razorpay webhook receipt.

## Shipping boundary

This advances the provider Test-Mode lifecycle and local billing integration.
It does not close trusted npm publication, external customer/recipient
acceptance, independent review, human screen-reader/field-CWV evidence,
AppSec/Hunt review, or final release/go-no-go. No stable release tag, npm
publication, paid Production transaction, customer data, or existing file,
branch, or record was deleted. No backlog checkbox changed; the authoritative
score remains **245 checked / 35 open / 280 total (87.5%)**, partitioned as
**13 AppSec-dependent / 22 non-AppSec** rows.
