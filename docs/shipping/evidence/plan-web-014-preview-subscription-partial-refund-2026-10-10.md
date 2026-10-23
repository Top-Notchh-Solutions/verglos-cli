# PLAN-WEB-014 Preview/Test Mode partial-refund evidence · 2026-10-10

## Scope

This record covers one bounded partial refund against a second isolated
subscription payment in Razorpay Test Mode. It does not authorize or
represent a Production payment, database, entitlement, or customer operation.

No provider ID, secret, customer value, or database URL is retained here.

## Preflight and provider result

- The isolated database contained a separate captured subscription payment
  with a non-null license binding.
- A read-only provider fetch matched the payment identity and returned HTTP
  200 with provider status `captured`, `captured=true`, and no prior refund.
- A partial refund for **140,471 paise** was submitted and returned HTTP 200.
- The provider then reported the payment `captured` with cumulative
  `amount_refunded=140471`; its refund list contained one `processed` refund.

## Webhook and database result

- The isolated Preview endpoint completed one fresh `refund.processed` event.
- The matched payment row projected to `partially_refunded` with
  `amount_refunded_minor=140471`.
- The linked license row remained `active`; the partial-refund path did not
  grant a second license or remove existing paid time.
- No manual database edit, license mutation, or entitlement workaround was
  used.

## Acceptance boundary

This qualifies one real partial-refund provider/webhook/ledger projection
slice and cumulative refund watermark. It does not close `PLAN-WEB-014` or
Gate 4. Refund replay/out-of-order, payment-method coverage, renewal,
provider failure/expiry, timeout/retry, exactly-once across the complete
matrix, and full provider/ledger/entitlement reconciliation remain open.
Production remains at the fail-closed code-rollout boundary and was not
touched.

