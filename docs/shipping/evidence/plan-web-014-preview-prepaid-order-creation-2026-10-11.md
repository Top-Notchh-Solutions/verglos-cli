# PLAN-WEB-014 · isolated Preview prepaid order creation

**Date:** 2026-10-11
**Scope:** Web `887249d`, isolated Vercel Preview, Razorpay Test Mode

## Result

- The Preview test-auth fixture was normalized and deployed without changing
  Production variables, the Production database, or customer identities.
- The protected Preview checkout rendered the canonical Pro monthly offer:
  INR 280,943 minor units, 30 days, catalog `2026-10-02.0`, and exactly one
  enabled hosted method: `card` / `Cards`.
- An authenticated Preview `POST /api/razorpay/create-order` returned HTTP
  200 with the server-owned amount, currency, term, catalog version, Test Mode
  marker, and Cards-only method response.
- The order was created in Razorpay Test Mode for the isolated qualification
  flow. No capture, failure, refund, signed webhook, ledger transition,
  fixed-term entitlement, expiry, or second-order renewal was observed in this
  run.

## Code verification

The focused Web payment process passed **42 tests** with **0 failures**. Three
database-backed tests were explicitly skipped because this shell did not have
the disposable local PostgreSQL test variable; no remote database was used as
a substitute. The route contract continues to reject automatic subscription
creation and keeps webhook credit authoritative.

## Disposition

This is current hosted order-creation evidence only. It does not satisfy
`PLAN-WEB-014` or Gate 4. The remaining acceptance artifact is a provider
terminal one-time card result and signed Preview reconciliation for capture or
failure, refund, expiry, and a customer-initiated second one-time order. The
retired recurring-card fixture is not required by the Final V1 contract.

No Production payment, database, migration, entitlement, account, or customer
write occurred.

