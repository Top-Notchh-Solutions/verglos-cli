# Razorpay hosted checkout attempt — 2026-10-06

## Scope

Authenticated browser qualification of the deployed `https://verglos.com/checkout`
route. This is an observation of the deployed provider path only; it is not a
claim that a payment was captured.

## Evidence

- Chrome was launched with the existing `Chrome-Verglos-Debug` profile and
  remote debugging on `127.0.0.1:9222`.
- The page carried an active Clerk session for the authorized Top Notchh
  account; no session token or cookie is recorded here.
- Monthly Pro rendered at **₹2,809.43** (`280943` paise), 30-day duration,
  catalog version `2026-10-02.0`.
- `POST /api/razorpay/create-qr` returned HTTP 200 and created a single-use
  hosted QR. The provider QR identifier and URL are intentionally omitted from
  this private evidence summary.
- Repeated `GET /api/razorpay/qr-status` responses were HTTP 200 with
  `{"status":"pending"}`.
- The UI's “I've paid — check now” action was exercised while the provider
  status remained pending. No entitlement or license grant was observed.
- The QR short-link could not be completed in the desktop browser: Razorpay's
  UPI QR requires an external UPI test action. No payment, capture, refund, or
  webhook was fabricated.

## Boundary

This proves authenticated production checkout rendering, INR conversion,
provider QR creation, and the pending-state path. It does **not** prove a
captured payment, signed webhook delivery/replay, or exactly-one entitlement
grant. PLAN-WEB-011/012 remain open for that missing provider lifecycle
evidence. Existing sandbox Standard Checkout evidence remains separate.
