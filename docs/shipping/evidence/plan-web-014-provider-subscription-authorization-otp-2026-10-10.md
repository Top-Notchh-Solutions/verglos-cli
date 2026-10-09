# PLAN-WEB-014 provider subscription authorization — OTP boundary — 2026-10-10

## Qualification performed

- Preview-only fixture auth was rotated in Vercel Preview and a fresh Preview
  deployment was built from Web `98dd571`.
- The deployed checkout rendered Razorpay Test Mode, the canonical monthly Pro
  offer (`280943` paise), and the enabled method set `card,netbanking,wallet,emi`.
- The authenticated `POST /api/razorpay/create-subscription` route returned a
  provider subscription bound to `testMode=true`, monthly cadence, catalog
  version `2026-10-02.0`, and the twelve-cycle Test Mode configuration. The
  provider identifier is intentionally redacted here.
- Read-only provider reconciliation immediately after creation showed
  `status=created` and `paid_count=0`.
- Read-only isolated database reconciliation showed one matching
  `billing_subscriptions` row in `pending` state with plan `pro`, monthly
  cadence, and amount `280943`. One failed payment projection exists for the
  attempted card authorization; no successful payment or new entitlement was
  accepted.

## External interaction boundary

The Razorpay hosted subscription checkout is open in the authenticated Chrome
DevTools session. The documented Razorpay Test Mode Visa fixture was entered:
`4100 2800 0000 1007`, future expiry, and sandbox CVV. Razorpay then required
card-tokenization OTP confirmation. The OTP must be entered by the authorized
operator who receives it; it will not be guessed or bypassed. The current
provider lifecycle therefore remains incomplete pending that OTP and the
resulting signed webhook delivery.

## Write boundary

- Vercel Preview environment secret: changed only for the Preview test-auth
  fixture; Production was not changed.
- Provider: one Test Mode subscription creation and sandbox checkout attempt.
- Database: isolated Preview writes only through the application route/webhook
  path; no direct SQL edit, migration, or entitlement grant occurred.
- Production: no payment, provider, database, migration, entitlement, account,
  or customer-data write.

## Disposition

This is progress toward `PLAN-WEB-011`, `PLAN-WEB-012`, `PLAN-WEB-014`, and
`PLAN-WEB-015`, not acceptance. Required next artifact: operator-completed
Test Mode card-tokenization OTP, then read-only provider/webhook/payment/
subscription/license reconciliation. Gate 4 remains open. Score remains
**219 checked / 61 unchecked / 280 total (78.2%)**.
