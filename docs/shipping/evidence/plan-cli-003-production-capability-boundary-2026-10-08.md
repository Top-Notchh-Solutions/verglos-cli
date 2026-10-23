# PLAN-CLI-003 · production capability boundary probe · 2026-10-08

## Scope

Read-only requests to the public production
`/api/v1/entitlement/capabilities` endpoint. The probe used anonymous access,
an anonymous `as_plan=enterprise` forgery, and a malformed Bearer token. No
license was supplied, no account was created or changed, and no database,
payment, entitlement, or deployment write occurred.

## Results

| Probe | HTTP | plan | real plan | simulated | active | reason | cache |
|---|---:|---|---|---|---|---|---|
| anonymous `as_plan=enterprise` | 200 | free | free | false | true | — | private, no-store |
| malformed Bearer + `as_plan=enterprise` | 200 | free | — | false | false | invalid_token | private, no-store |
| anonymous no query | 200 | free | free | false | true | — | private, no-store |

All responses reported catalog version `2026-10-02.0` and nine Free
capabilities. The forged plan was not honored and the malformed token did not
grant paid access.

## Disposition

This strengthens the anonymous/forged-authority boundary only. It does not
qualify authenticated modified-CLI access, tenant/list/search/export/private
record boundaries, paid activation, or PLAN-CLI-001 hosted signer activation.
`PLAN-CLI-003` remains open. No backlog checkbox changed; backlog remains
**218 checked / 62 unchecked / 280 total (77.9%)**.
