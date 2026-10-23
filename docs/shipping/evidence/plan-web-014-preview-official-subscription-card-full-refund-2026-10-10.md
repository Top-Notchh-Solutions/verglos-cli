# PLAN-WEB-014 · isolated Preview/Test Mode full refund

Date: 2026-10-10
Environment: isolated Preview with the separate Test Mode database
Payment scope: canonical Pro/monthly recurring card subscription
Status: Gate 4 progress; not item acceptance

## Operation

A read-only database preflight matched the authenticated Razorpay Test Mode
payment detail to one isolated captured subscription payment at the canonical
INR amount. The same redacted join showed an active application subscription
and an active Pro license. No database row was edited before the provider
operation.

The provider dashboard then issued a full Test Mode refund for that exact
captured card payment. The provider reported the refund as processed for the
full payment amount. No real-money or Production operation was involved.

## Reconciliation

The isolated Preview webhook store recorded two distinct completed signed
events: `refund.created` and `refund.processed`. The payment row projected to
`refunded` with `amount_refunded_minor` equal to the canonical payment amount.
The linked Pro license projected to inactive, so the refunded payment no
longer grants paid access. The subscription row remained `active` at the
observation time; a provider cancellation/expiry transition is therefore
still a separate open lifecycle case and is not inferred from the refund.

The latest read-only aggregates were:

- 1 full-refund payment update with the full refund watermark;
- 2 distinct completed refund webhook events;
- 0 manual payment, license, entitlement, or subscription-row edits.

## Disposition

This is real provider-to-webhook-to-payment-to-access refund evidence for
Cards-only Preview. It advances Gate 4 and `PLAN-WEB-014`, but does not close
the item. Provider renewal/expiry, refund replay/order and out-of-order
handling, timeout/retry, exactly-once reconciliation, and final hosted
Preview acceptance remain open. The score remains **219 checked / 61
unchecked / 280 total (78.2%)**; no checkbox changed.

Provider identifiers, secrets, database URLs, cookies, authorization headers,
personal data, card details, OTPs, and raw webhook payloads are intentionally
omitted.
