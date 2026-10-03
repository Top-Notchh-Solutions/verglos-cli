# Razorpay sandbox QR creation — 2026-10-03

## Scope

Sandbox-only provider setup for the Pro monthly checkout path. No production
checkout, payment, entitlement, database, or deployment write was performed.

## Evidence

- Credentials were loaded only from the local ignored `verglos-web/.env.test.local`.
- The key was checked for the `rzp_test_` prefix; secret values were never printed.
- The canonical catalog amount used was **₹2,809.43** (`280943` paise), monthly Pro.
- Razorpay endpoint used: `POST /v1/payments/qr_codes`.
- Created QR: `qr_TjOtGPeNKNmIjr`.
- Provider response: HTTP 200, status `active`, `usage=single_use`, fixed amount `280943` paise.
- Provider close time: `1791024671` (Unix seconds).
- QR image URL was intentionally not copied into this evidence file.

## Boundary

Creation proves only that the sandbox credentials can create a QR through the
provider API. No customer payment has been captured. No signed webhook has
been delivered or replayed, and no license grant has been asserted. PLAN-WEB-
011 and PLAN-WEB-012 therefore remain open pending authenticated checkout and
provider lifecycle evidence.

An earlier probe against `/v1/qr_codes` returned HTTP 404; the provider's
working resource path is `/v1/payments/qr_codes`. No further QR was created
after the successful attempt.

## Read-only status recheck

- `GET /v1/payments/qr_codes/:id` returned HTTP 200 with QR status `active`.
- `GET /v1/payments/qr_codes/:id/payments` returned HTTP 200 with `count=0`.
- No payment identifier, capture, refund, or webhook event exists yet for this QR.
