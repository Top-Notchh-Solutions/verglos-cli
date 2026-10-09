# PLAN-WEB-014 hosted retry and Production rollout evidence · 2026-10-09

## Scope

This record covers the hosted-checkout retry repair in Web commit `0bafe73`
and its fail-closed Production deployment. It also records the latest isolated
Razorpay Test Mode reconciliation result without claiming a complete Gate 4
pass.

## Code and qualification

- The hosted `payment.failed` callback no longer destroys the active Verglos
  checkout session while Razorpay's modal remains open for another attempt.
  A later successful hosted attempt can therefore reach signed-provider
  confirmation and polling.
- Focused checkout/origin/route contract tests passed **20/20**.
- TypeScript passed, `git diff --check` passed, and the local Next.js
  production build generated **47 pages** successfully.
- The isolated Test Mode browser run used the canonical monthly Pro catalog
  (`2026-10-02.0`, INR, 30 days, canonical minor amount `280943`). An initial
  Visa fixture attempt failed; a second official Mastercard Test Mode fixture
  attempt completed through the hosted mock-bank success path. The parent
  page reached `Payment confirmed` before redirecting.

## Isolated provider/database observation

The read-only provider inventory returned HTTP 200 with 20 subscriptions. The
current provider inventory had 5 active, 6 cancelled, and 9 created rows. All
20 provider rows had a bound isolated billing row; the canonical commercial
binding was present on 19 rows. The successful hosted row had a captured
subscription payment, a period end, and an active Pro license with expiry.

The exact provider-to-database reconciliation also found a remaining mismatch:
the 5 provider rows currently reporting `active` map to database rows still
reporting `authenticated`. This is retained as an explicit Gate 4 finding;
it is not silently treated as success. Cancellation evidence from the earlier
isolated run remains valid: provider cancellation reconciled to a cancelled
database row while already-paid time remained intact.

## Production rollout

- Source: Web `0bafe73` (`fix(checkout): preserve hosted retry session`).
- Vercel deployment: `dpl_GnVheZKWyqbMX2zdDfsHmy8y9xHB`, READY, aliased to
  `https://verglos.com`.
- Remote Production runtime-config validation and remote build passed.
- Read-only public smoke returned HTTP 200 for `/` and `/checkout`, HTTP 405
  for unauthenticated GET to `/api/heartbeat` and subscription creation, and
  the Production checkout HTML contained no Test Mode or `rzp_test` marker.
- No Production plan IDs, Test Mode values, provider/payment calls, database
  writes, migrations, entitlement changes, account changes, or customer-data
  mutations occurred.

## Disposition

This qualifies the Production fail-closed code-rollout stage and advances
Gate 4 evidence. It does not close `PLAN-WEB-011`, `PLAN-WEB-012`,
`PLAN-WEB-014`, `PLAN-WEB-015`, or Gate 4. Renewal, provider-generated
failure/expiry, refund, replay/out-of-order, exactly-once, all-enabled-method
coverage, and the active-versus-authenticated reconciliation mismatch remain
open. The live score remains **219 checked / 61 unchecked / 280 total
(78.2%)**.
