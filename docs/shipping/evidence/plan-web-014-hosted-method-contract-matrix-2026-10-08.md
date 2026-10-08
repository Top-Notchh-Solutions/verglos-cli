# PLAN-WEB-014 hosted-method contract matrix — 2026-10-08

## Scope

- Web PR #163 source head `a9158b180a682f6030835f03d1bdfabe8eb6953c`
- Merged Web `main` commit `d88aa7b9b219df414707143bc8c6b9c6e9b18193`
- Synthetic webhook/provider doubles only; no Razorpay API call, credential use,
  order creation, payment, database write, deployment, or production mutation

## Matrix covered

The hosted order contract now has one parameterized test covering each currently
supported hosted method:

- UPI
- Cards
- Netbanking
- Wallets
- EMI
- Pay Later

For every method the test proves:

- a paid provider order with the exact signed snapshot is captured once;
- a replay of the same event is idempotent and does not grant twice; and
- a failed payment is recorded without granting access.

The matrix also proves that a captured `upi_qr` payment is rejected when QR is
not present in the signed hosted-method snapshot. QR remains a separately
qualified legacy adapter, not a substitute for hosted checkout.

## Verification

- Focused payment/checkout/webhook tests: **21 passed / 0 failed**
- Full Web serial suite: **886 total / 862 passed / 24 explicit environment
  skips / 0 failed**
- Typecheck: passed
- Drizzle schema check: passed
- Ordered migration check: **38 migrations verified**
- Production build: passed, **45 pages**
- `git diff --check`: passed
- Hosted Verify run `37789719564`: passed
- GitGuardian, Vercel deployment, and Preview Comments: passed

## Disposition

This is code-side synthetic evidence for PLAN-WEB-013/014. It does not prove
provider success, failure, capture, refund, renewal, cancellation, webhook
delivery, entitlement reconciliation, or production payment truth. Those gates
remain open, as does R-041 credential containment.

