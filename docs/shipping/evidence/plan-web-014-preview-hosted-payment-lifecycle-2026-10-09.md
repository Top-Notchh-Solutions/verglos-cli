# PLAN-WEB-014 — Isolated Preview hosted payment lifecycle

Date: 2026-10-09

## Scope

This record extends the earlier method-display and failure-path probe with a
real Razorpay Test Mode provider state exercised against the protected Preview
deployment and the isolated Neon test database. Production credentials,
production database state, live payment capture, and production deployment
were not used.

## Code correction

The first provider capture exposed a runtime defect: the application database
module used the Neon HTTP driver, while the billing ledger requires
interactive transactions. The runtime returned `No transactions support in
neon-http driver`, so the webhook released its claim and returned HTTP 500.

Web commit `d8dc35a` changes the runtime database module to the existing
PostgreSQL driver with transaction support, disables prepared statements for
Neon pooled connections, and reuses a bounded client per configured URL. The
change passed typecheck, the focused Razorpay route/webhook tests, and the
production build. It was deployed to an isolated Preview deployment after
the build passed.

## Provider and application results

- Razorpay remained in Test Mode.
- The Preview checkout showed the canonical monthly Pro amount and all six
  configured hosted method surfaces: UPI, card, netbanking, wallet, EMI, and
  Pay Later.
- A captured provider payment using the canonical order binding was accepted
  by the protected Preview webhook endpoint with a valid Razorpay signature.
- The isolated database recorded a captured `order` payment with the exact
  canonical amount, a linked license, and a completed `payment.captured`
  webhook event.
- A full Test Mode provider refund was created and the protected Preview
  endpoint accepted signed refund lifecycle events. The isolated database
  recorded the payment as fully refunded, with the full refund watermark, and
  the linked Pro license inactive.
- A second captured/refunded Test Mode order exercised the same deployed
  capture and refund paths, proving the transaction fix was not only a local
  unit-test result.
- A later read-only Test Mode provider aggregate showed 16 payments at the
  canonical amount, including captured `card`, `wallet`, `netbanking`, and
  `cardless_emi` outcomes, plus captured/refunded and failed outcomes for the
  previously exercised methods. No UPI or Pay Later payment row was present.
  The UPI QR attempt was not a valid Test Mode UPI fixture, and the Pay Later
  OTP rejection did not create a provider payment; neither is treated as a
  successful lifecycle result.

Only aggregate and state evidence is retained here. Provider identifiers,
emails, phone numbers, signatures, webhook secrets, database URLs, and
protection-bypass values are intentionally excluded.

## Qualification decision

The following lifecycle slice is now qualified in isolated Preview:

`canonical catalog binding → Test Mode capture → signed webhook → exactly-once
ledger/license grant → full provider refund → signed refund webhook → ledger
refund watermark → license deactivation`

The complete PLAN-WEB-014 gate remains **open**. The remaining matrix must
still document UPI and Pay Later provider outcomes and the required renewal,
cancellation, expiry, replay, out-of-order, timeout, tenant-binding, and
partial-refund cases. Provider simulator stalls or rejected fixtures are
recorded rather than treated as successful outcomes.

## Backlog accounting

No authoritative backlog checkbox changed. The current count remains
**218 checked / 62 unchecked / 280 total (77.9%)**.
