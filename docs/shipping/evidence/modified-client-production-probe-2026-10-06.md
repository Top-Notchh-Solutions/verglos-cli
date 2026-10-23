# Modified-client production probe — 2026-10-06

## Scope

Read-only, unauthenticated probes against `https://verglos.com` for the
PLAN-CLI-003 boundary. No credentials, cookies, payment data, database
connection, or mutation were used.

## Results

The public entitlement endpoint was queried with each forged simulation:

```text
GET /api/v1/entitlement/capabilities
GET /api/v1/entitlement/capabilities?as_plan=pro
GET /api/v1/entitlement/capabilities?as_plan=studio
GET /api/v1/entitlement/capabilities?as_plan=enterprise
```

All four responses returned the same bounded Free projection:

```text
plan=free real_plan=free simulated=false active=true
catalog_version=2026-10-02.0 capabilities=9
```

The following forged organization/tenant query probes were also sent without
an authenticated session:

```text
/api/v1/organizations/<org>/search?organizationId=attacker
/api/v1/organizations/<org>/usage?organizationId=attacker
/api/v1/organizations/<org>/projects/<project>/evidence?organizationId=attacker&projectId=attacker
/api/v1/organizations/<org>/projects/<project>/policies/evaluations?tenantId=attacker
```

Each returned the auth-protected 404 surface; no data or attacker-controlled
tenant projection was returned.

Malformed/unknown bearer probes combined with `as_plan=studio` also failed
closed:

```text
Bearer vg_fake       -> plan=free, active=false, reason=not_found
Bearer forged-token  -> plan=free, active=false, reason=invalid_token
Bearer <blank>       -> plan=free, active=true, reason=none
```

## Boundary

This is production boundary evidence for anonymous forged parameters only. It
does not claim authenticated modified-CLI success, forged usage/record writes,
or full PLAN-CLI-003 acceptance. Those require a controlled authenticated
license/session fixture and a complete request matrix; no checkbox changed.
