# PLAN-CLI-003 hosted forged-route matrix — 2026-10-08

## Boundary

- **Surface:** authenticated production Verglos Web through the approved Chrome
  debug session.
- **Client behavior:** GET-only requests using fixed malformed identifiers and
  syntactically valid but nonexistent organization/project/repository/receipt
  identifiers, with attacker-controlled query values.
- **Capture policy:** only URL shape, status, content type, and cache-control
  were retained. Response bodies, cookies, authorization headers, and
  personal data were not read or stored.
- **Mutation:** no POST/PATCH/DELETE, payment, entitlement, database,
  deployment, provider, or account-state write occurred.

## Results

- Hosted route matrix: **22/22** completed without transport errors.
- Valid forged tenant/project requests: **15 returned 403** with private
  `no-store` responses.
- Authenticated account-level GETs: **2 returned 200** with private
  `no-store`; this records availability only and does not inspect their bodies.
- Unauthenticated/unsupported account routes: **3 returned 401** with private
  `no-store`.
- Malformed/invalid route input: **1 returned 400** with private `no-store`.
- Forged public receipt: **1 returned 404** with `no-store`.
- Separate malformed-ID probe: **4 returned 400** with private `no-store` and
  the public receipt returned **404** with `no-store`.

The matrix covered organization list/search/members/projects/usage/invitations,
SCM installations, project evidence/exceptions/policies/evaluations/receipts/
releases/download, repository policy, entitlement capabilities, license and
monitor status, score history, and public receipt lookup.

## Disposition

This is hosted negative-boundary evidence for `PLAN-CLI-003`: forged tenant
inputs did not expose a successful private response, and public receipt lookup
did not resolve a forged identity. It does not complete the item because the
modified CLI itself, authenticated paid/list/search/export states, and the
full public/private runtime matrix still require authorized fixture coverage.
No backlog checkbox changed; backlog remains **218 checked / 62 unchecked /
280 total (77.9%)**.
