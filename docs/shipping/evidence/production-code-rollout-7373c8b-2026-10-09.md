# Production code rollout and hosted checkout-origin repair — 2026-10-09

## Scope

This record covers the Web code-only Production rollout from commit
`7373c8b` (`fix(billing): accept browser same-origin checkout requests`). The
repair replaces the route-local Origin comparison with a strict browser
same-origin helper that supports exact `Origin`, Fetch Metadata, and Referer
fallbacks, including the local proxy host reconstruction observed during
checkout qualification. It is used by the order, subscription, and QR
creation routes.

## Verification

- Request-origin regression tests: **5/5 pass**.
- Razorpay route-contract tests: **6/6 pass**.
- TypeScript: pass.
- Next.js production build: pass; 47 pages generated.
- Vercel Production runtime-config check: pass.
- Vercel deployment: `dpl_CLo119NrTffsbLiaNKw4Pq7K2kCA`, READY, aliased to
  `https://verglos.com`.
- Read-only public smoke: `/` HTTP 200, `/checkout` HTTP 200, and the GET-only
  heartbeat probe returned the expected HTTP 405 for a method it does not
  expose.

## Hosted Test Mode observation

The local isolated Test Mode checkout reached the real Razorpay hosted iframe
after the route repair. An official domestic Test Mode card fixture reached
the provider confirmation step and returned to the provider retry state. This
attempt is recorded as a failed provider attempt; it is not counted as a
successful capture or lifecycle acceptance. The provider-supported Test Mode
method documentation was used for the fixture selection:
<https://razorpay.com/docs/payments/server-integration/python/integration-steps>.

## Production boundary

This deployment is a fail-closed code rollout only. No Production plan IDs,
Test Mode values, provider calls, payment writes, migrations, database writes,
entitlement changes, account changes, or customer-data mutations occurred.
The isolated Test Mode checkout and database were not copied into Production.
Production billing/database activation, current-backup/RPO, migration,
reconciliation, monitoring, and rollback/forward-fix stages remain open.

## Disposition

The browser-origin defect is fixed and deployed. Gate 4 remains open because
the complete provider lifecycle and provider/ledger/entitlement reconciliation
matrix still lacks successful evidence for every required path. The existing
score remains **219 checked / 61 unchecked / 280 total (78.2%)**; no checkbox
changed.
