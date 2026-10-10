# PLAN-CLI-001 isolated Preview v2 issue→verify trace — 2026-10-10

## Scope

This is isolated Preview qualification evidence. The Preview deployment used
the separate test database and `VERGLOS_PREVIEW_DATABASE_ISOLATED=true`. No
Production database, payment, entitlement, account, or customer-data write was
performed.

## Payment and entitlement trace

- Razorpay Test Mode hosted checkout used the canonical monthly Pro amount of
  INR 2,809.43 with the deployed Cards-only display binding.
- Razorpay Dashboard recorded a captured domestic credit-card payment for the
  Preview fixture. The payment's immutable provider notes bound it to the
  current fixture user, `pro`, `monthly`, INR, the canonical amount, the
  catalog version, and `payment_methods=card`.
- The deployed Preview webhook route accepted a correctly signed
  `payment.captured` delivery for that real captured Test Mode payment with
  HTTP 200. The isolated database then contained one captured ledger row and
  one active Pro license with the expected 30-day entitlement window.
- The existing migration writer was run first in dry-run mode and reported two
  clean personal-organization/owner-mapping writes with no collisions or
  quarantined users. It was then committed only to the isolated test database.
- The new Preview deployment `dpl_Gj3Ff2Sx51YSW8qj13LphpmymGuD` issued a v2
  entitlement token with HTTP 200. The response projected `pro`, catalog
  version `2026-10-02.0`, `schemaVersion=2`, `role=owner`, and a tenant ID.
- The local CLI verifier accepted the token against its pinned Ed25519 public
  key. The server's explicit `kid=legacy-v1` header exposed a compatibility
  gap in the CLI verifier; commit `be06761` adds strict support for the two
  pinned key IDs while preserving the legacy header and adds a regression test.

## Verification

- CLI entitlement focused tests: **12 passed / 0 failed**.
- Deployed issue→verify consumer check after `be06761`: token issued **true**,
  CLI valid **true**, plan `pro`, v2 claims present, tenant ID present, role
  `owner`.
- The local signing key's public half matches the CLI's pinned current key.

## Boundary and remaining acceptance

This proves the isolated Preview payment→ledger→license→tenant mapping→v2
token→CLI verification path. The provider's automatic webhook delivery did
not create the current fixture ledger row during this run; the HTTP 200 webhook
check used a signed replay of the real captured payment. Therefore this is not
yet proof of provider retry/delivery timing, exactly-once behavior under real
provider retries, subscription renewal/failure/refund coverage, or the
Production signer/paid-tenant trace.

`PLAN-CLI-001` remains unchecked until the Production signer/public-pin and
deployed activation boundary is independently qualified. Backlog score is
unchanged at **219 checked / 61 unchecked / 280 total (78.2%)**.
