# PLAN-WEB-014 · isolated Preview/Test Mode cancellation after refund

Date: 2026-10-10
Environment: isolated Preview with the separate Test Mode database
Payment scope: the exact canonical Pro/monthly recurring card subscription
Status: Gate 4 progress; not item acceptance

## Operation

After the full-refund evidence, a read-only join found exactly one active
application subscription linked to that fully refunded payment and its now
inactive Pro license. Using the provider-documented subscription cancellation
endpoint, the exact Razorpay Test Mode subscription was cancelled immediately.
The request returned HTTP 200 with provider status `cancelled`.

## Reconciliation

The isolated Preview webhook store completed one distinct signed
`subscription.cancelled` event. The application projection became:

- subscription: `active` → `cancelled`;
- payment: `refunded` with the full refund watermark;
- linked Pro license: inactive.

No database, payment, subscription, license, entitlement, or customer-data
row was edited manually. No Production or real-money operation occurred.

## Disposition

This adds real provider cancellation reconciliation after a full refund. It
advances Gate 4 and `PLAN-WEB-014`, but does not close the item. Provider
renewal/expiry, refund replay/order and out-of-order handling, timeout/retry,
exactly-once reconciliation, and final hosted Preview acceptance remain
open. The score remains **219 checked / 61 unchecked / 280 total (78.2%)**;
no checkbox changed.

Provider identifiers, secrets, database URLs, cookies, authorization headers,
personal data, card details, OTPs, and raw webhook payloads are intentionally
omitted.
