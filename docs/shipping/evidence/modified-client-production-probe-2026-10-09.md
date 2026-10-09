# Modified-client Production probe — 2026-10-09

## Scope

Read-only unauthenticated requests were sent to `https://verglos.com` with
forged plan and tenant parameters. No credentials, cookies, payment data,
database connection, or mutation method was used.

## Results

The following four entitlement requests all returned the same server-owned
projection: `plan=free`, `real_plan=free`, `simulated=false`, `active=true`,
`catalog_version=2026-10-02.0`:

- `/api/v1/entitlement/capabilities`
- `/api/v1/entitlement/capabilities?as_plan=pro`
- `/api/v1/entitlement/capabilities?as_plan=studio`
- `/api/v1/entitlement/capabilities?as_plan=enterprise`

The following forged organization/tenant requests each returned HTTP **404**:

- `/api/v1/organizations/attacker/search?organizationId=forged`
- `/api/v1/organizations/attacker/usage?organizationId=forged`
- `/api/v1/organizations/attacker/projects/attacker/evidence?organizationId=forged&projectId=forged`
- `/api/v1/organizations/attacker/projects/attacker/policies/evaluations?tenantId=forged`

## Boundary

This is anonymous Production boundary evidence only. It does not claim the
authenticated modified-client matrix, private runtime list/search/export
acceptance, or full `PLAN-CLI-003` completion. No state-changing request was
made and no backlog checkbox changed.
