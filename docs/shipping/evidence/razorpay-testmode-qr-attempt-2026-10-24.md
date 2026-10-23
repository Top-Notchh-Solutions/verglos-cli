# Razorpay Test Mode QR lifecycle attempt · 2026-10-24

## Scope

One bounded, synthetic provider attempt was made against the local Razorpay
Test-Mode configuration to exercise the documented QR checkout path. The
attempt used the current Pro monthly catalog snapshot and a synthetic UUID
binding. It was intentionally limited to Test Mode; no Production key, live
payment, application database, customer, entitlement, webhook, or GitHub
Actions operation was used.

## Result

- The configured server and public key IDs both had the `rzp_test_` prefix and
  matched each other.
- The first provider operation, `POST /v1/payments/qr_codes`, was rejected by
  Razorpay with HTTP **401** `BAD_REQUEST_ERROR` / `Authentication failed`.
- No provider QR identifier was returned, so no QR resource was created and no
  close, payment, refund, webhook, or database operation followed.
- No money was charged. Production and the application database were not
  touched.

## Disposition

This is a real bounded provider receipt for a rejected Test-Mode credential
pair, not a successful provider lifecycle receipt. It does not close the
provider-lifecycle portions of ACCEPT-003/008/009/010/014 or any release row.
The next provider attempt requires a valid Razorpay Test-Mode key/secret pair;
the local file must be updated without committing or recording its values.
The shipping score remains **245 checked / 35 open / 280 total (87.5%)**,
partitioned as **13 AppSec-dependent / 22 non-AppSec** open rows.

