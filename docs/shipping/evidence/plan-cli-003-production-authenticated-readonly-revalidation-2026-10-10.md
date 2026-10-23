# PLAN-CLI-003 Production authenticated read-only revalidation — 2026-10-10

## Scope

The existing authenticated Chrome DevTools session was used against
`https://verglos.com/account`. The probe used browser `fetch` with the existing
session only; it did not capture cookies, bearer tokens, response bodies, or
customer identifiers. Every request below was `GET` with `credentials: include`
and `cache: no-store`.

## Results

The modified-client boundary remained server-owned:

- `GET /api/v1/entitlement/capabilities?as_plan=enterprise` returned `200` with
  `plan=free` and `real_plan=free`.
- `GET /api/v1/license/status` returned `401 missing_bearer_token`.
- `GET /api/v1/organizations` returned `200` with zero organizations for the
  authenticated account.
- A forged organization UUID returned bounded denial across search, usage,
  projects, receipts, policies, releases, SCM installations, and repository
  policy surfaces: `403 organization access denied` or a bounded `400` path
  validation response, with `private, no-store` on the data-bearing denial
  routes.
- Unsupported read methods returned bounded `405` responses; no route was
  mutated.

Production configuration was inspected without revealing values: the declared
hosted method set is Cards-only, the provider key is live-mode, and recurring
plan IDs/total-count configuration are absent. The Production subscription
path therefore remains fail-closed. The local `.env.gates.testing` file was
used only as local Test Mode context and was not deployed or printed.

## Acceptance boundary

This is current authenticated Production boundary evidence, not full
`PLAN-CLI-003` acceptance. The account has no paid license or organization
fixture, so paid list/search/export behavior and the complete public/private
runtime matrix remain unproven. No Production, provider, payment, database,
entitlement, account, organization, or customer-data write occurred.

Disposition: keep `PLAN-CLI-003` unchecked and continue only after an isolated
paid test fixture and the remaining authorized runtime matrix are available.
