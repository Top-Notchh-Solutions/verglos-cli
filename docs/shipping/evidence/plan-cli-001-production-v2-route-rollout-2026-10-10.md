# PLAN-CLI-001 Production v2 entitlement-route rollout — 2026-10-10

## Scope

This records a code-only Production rollout and read-only route checks for
`PLAN-CLI-001`. It does not close the backlog item.

## Fix and deployment

Web source commit `ecc32f2` added the v2 entitlement-token route to the Clerk
middleware public-route allowlist. The route authenticates its own
`Authorization: Bearer <license-key>` header, so middleware must pass it
through; hiding it as a Clerk 404 prevented the handler from enforcing its
intended fail-closed responses.

Focused entitlement tests passed **7/7**, and TypeScript typecheck passed.
The code-only Production deployment
`dpl_DiRR2g2upWNein7bzXRmrEb3mtHm` reached READY and was aliased to
`https://verglos.com`. The build included the v2 route.

## Hosted checks

- `POST /api/v2/entitlement/token` without a bearer returned **401** with
  `invalid_authorization` and `Cache-Control: private, no-store`.
- The same route with a deliberately fake test key returned **404** with
  `license_not_recognized`; no entitlement or account write occurred.
- Anonymous `GET /api/v1/entitlement/capabilities` returned **200**, Free,
  catalog `2026-10-02.0`, and nine Free capabilities.
- The same capabilities route with the deliberately fake test key returned
  **200**, Free, inactive, reason `not_found`.
- Production `/`, `/checkout`, and `/docs` remained available after the
  rollout.

No payment, subscription, database, migration, license, entitlement,
organization, account, or customer-data write occurred.

## Acceptance boundary

The route is now deployed and fail-closed, but `PLAN-CLI-001` remains
unchecked. Acceptance still requires a real authorized paid tenant fixture,
an issue→verify v2 token trace using the deployed signer and pinned CLI key,
and the resulting catalog/capability/allowance projection. A fake key,
anonymous Free response, or local test cannot substitute for that trace.

## Score

**219 checked / 61 unchecked / 280 total (78.2%)**; no checkbox changed.
