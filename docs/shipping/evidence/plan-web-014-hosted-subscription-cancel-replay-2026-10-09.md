# Hosted Preview Test Mode subscription cancellation evidence — 2026-10-09

## Scope

This qualification used the isolated Preview deployment, the canonical monthly
Pro catalog entry, the isolated test database, and Razorpay Test Mode. No
Production request, database write, provider call, migration, entitlement
change, or account/customer-data mutation was made.

## Controlled lifecycle

- The initial controlled subscription creation returned HTTP 200 and the
  owner-bound status route returned HTTP 202 while processing.
- The first synthetic webhook attempt returned HTTP 400 because the harness
  omitted the provider-signed checkout binding in the payload. This was a
  correct fail-closed application rejection and was not counted as acceptance.
- A fresh Preview deployment was then exercised with the provider binding and
  valid webhook signatures.
- A signed `subscription.cancelled` event returned HTTP 200 and was received.
- Replaying the exact event returned HTTP 200 with `duplicate: true`.
- An older signed `subscription.activated` event returned HTTP 200 but did not
  resurrect the cancelled subscription.
- The owner-bound status response reported `subscriptionStatus: cancelled`.

## Reconciliation

Read-only reconciliation matched the provider and isolated database:

- Provider inventory returned HTTP 200; the selected bound subscription had
  status `cancelled`, provider notes present, and twelve recorded cycles.
- The isolated database projection was `cancelled`, plan `pro`, cadence
  `monthly`, catalog version `2026-10-02.0`, currency `INR`, amount `280943`
  minor units, and a 30-day duration.
- Recent webhook rows for activation and cancellation were both `completed`.
- The license remained active with an expiry, preserving already-paid time;
  cancellation did not grant new access.

## Disposition

This is partial Gate 4 evidence for signed delivery, exact replay
deduplication, out-of-order protection, owner binding, and provider/database
reconciliation. It does not close Gate 4. Renewal/charge, provider-generated
failure and expiry, refund, timeout/retry, and the complete hosted payment
method and exactly-once matrix remain open.

Score remains **219 checked / 61 unchecked / 280 total (78.2%)**; no backlog
checkbox changed.
