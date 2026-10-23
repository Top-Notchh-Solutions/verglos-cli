# PLAN-WEB-014 Preview/Test Mode refund evidence · 2026-10-10

## Scope

This record covers one bounded full-refund operation against an isolated
subscription payment in Razorpay Test Mode. It does not authorize or
represent a Production payment, database, entitlement, or customer operation.

No provider ID, secret, customer value, or database URL is retained here.

## Preflight and provider result

- The isolated database contained a captured subscription payment with a
  non-null license binding.
- A read-only provider fetch matched that payment identity and returned HTTP
  200 with provider status `captured` and `captured=true`.
- A full refund request returned HTTP 200.
- A subsequent provider read returned status `refunded`, and the provider
  refund list contained one `processed` refund for the full canonical amount
  of **280,943 paise**.

## Webhook and database result

- The isolated Preview endpoint completed one fresh `refund.processed`
  webhook event.
- The matched isolated payment row projected to `refunded` with
  `amount_refunded_minor=280943`.
- The linked license row remained `active`, consistent with the ledger's rule
  to remove only unconsumed paid time while preserving previously paid time.
- No manual database edit, license mutation, or entitlement workaround was
  used.

## Acceptance boundary

This qualifies one real full-refund provider/webhook/ledger projection slice.
It does not close `PLAN-WEB-014` or Gate 4. Partial refund, refund replay and
out-of-order delivery, payment-method coverage, renewal, provider failure or
expiry, timeout/retry, exactly-once across the complete matrix, and full
provider/ledger/entitlement reconciliation remain open. Production remains
at the fail-closed code-rollout boundary and was not touched.

