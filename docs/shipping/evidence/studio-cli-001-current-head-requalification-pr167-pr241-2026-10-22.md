# STUDIO-CLI-001 current merged-head requalification · 2026-10-22

## Verification

The current public heads were requalified without changing source:

- CLI `db3510356ecd6c6e430d7dcb3b9354e514d777ee`: compiled projection,
  approval, upload, response-digest, endpoint-binding, private-field,
  malformed-approval, and bounded-response tests passed **15/15**.
- Web `02f5aba95c4172255cc522730c6ffecc1598cbda`: client projection, route
  custody, tenant leakage, portfolio, handoff, allowance, Preview fixture,
  and Studio E2E contracts passed **107/107**.

The tests cover canonical redacted projections, exact approval/preview digest
binding, tenant/workspace/record scope, private-field refusal, replay and
terminal handoff behavior, allowance ceilings, and cross-tenant refusal. No
customer source, provider payment, Production entitlement, or AppSec result
was fabricated.

## Disposition

`STUDIO-CLI-001` remains unchecked because the full row requires an approved
numeric paid/non-production allowance and independent authorized
recipient/customer acceptance with hosted/audit evidence. The existing
owner-controlled synthetic Preview run is not that acceptance artifact. No
database, provider, customer, Production, or legal state changed. Nothing was
deleted.

Current score: **239 checked / 41 open / 280 total (85.4%)**.
