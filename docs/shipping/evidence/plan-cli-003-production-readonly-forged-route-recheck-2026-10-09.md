# PLAN-CLI-003 production read-only forged-route recheck — 2026-10-09

## Scope

This is a bounded, read-only production qualification slice for
`PLAN-CLI-003` (modified/untrusted CLI test client). It checks that forged
plan, capability, tenant, usage, organization, and receipt inputs do not
grant paid or cross-tenant access.

It strengthens the existing modified-client evidence but does not close the
backlog item.

## Environment and method

- Target: the deployed Verglos production origin, through the approved Chrome
  DevTools session on `127.0.0.1:9222`.
- Browser state: an authenticated account session with no paid license and no
  organization fixture used for this probe.
- Method: same-origin `GET` requests only, using `credentials: include` and
  deliberately forged query/header authority fields.
- Response recording: sanitized status, cache-control, and non-sensitive
  reason/entitlement fields only. Cookies, authorization material, response
  bodies, personal data, payment identifiers, and database values were not
  recorded.

## Forged inputs and observed responses

| Probe | Forged input | Observed result |
| --- | --- | --- |
| Anonymous capability | `as_plan=enterprise`, forged `plan`/`tenantId`, and `X-Verglos-Plan: enterprise` | HTTP 200; effective `plan=free`, `real_plan=free`, `simulated=false`, `active=true`; catalog version present; `private, no-store` |
| License status | `Authorization: Bearer forged-license-token` | HTTP 401, `invalid_token`; `private, no-store` |
| Score history | `days=999999`, forged fingerprint, no valid license | HTTP 401; missing/invalid bearer authorization; `private, no-store` |
| Organization usage | all-zero organization UUID, forged tenant/organization headers, bounded valid-looking period | HTTP 403, organization access denied; `private, no-store` |
| Organization search | all-zero organization UUID, forged query authority and oversized limit | HTTP 403, organization access denied; `private, no-store` |
| Organization projects | all-zero organization UUID, forged query authority | HTTP 403, organization access denied; `private, no-store` |
| Public receipt lookup | all-zero receipt UUID, forged organization/project query fields | HTTP 404, receipt not found; `no-store` |

## Acceptance assessment

This evidence supports the following bounded claims:

- a forged paid plan does not elevate an anonymous capability response;
- a forged license bearer does not authenticate the license route;
- a forged fingerprint and oversized history window do not bypass paid access;
- forged organization/tenant fields do not bypass organization access;
- a forged receipt identifier does not disclose a receipt;
- the exercised private routes return no-store responses.

`PLAN-CLI-003` remains **unchecked**. The required paid/authorized fixture,
authenticated modified-client exercise, and complete list/search/export/public-
private runtime matrix are still missing. The Free account and zero-UUID
organization probes cannot prove successful authorized reads or tenant data
isolation for a real paid organization.

## Boundary and result

- No order, payment, webhook, entitlement, database, migration, provider,
  deployment, account, or data write occurred.
- No public repository or public file changed.
- No CLI or Web code changed; no PR was opened.
- Score remains **218 checked / 62 unchecked / 280 total (77.9%)**.
- Next evidence needed: an authorized non-production paid/org fixture and the
  full list/search/export/public-private modified-client matrix, with redacted
  runtime evidence.
