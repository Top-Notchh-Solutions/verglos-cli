# PLAN-CLI-003 authenticated modified-client browser matrix · 2026-10-07

- **Instrument:** Approved authenticated Chrome DevTools session, same-origin
  read-only `fetch` calls from the account page. Only status codes and bounded
  safe projections were returned; cookies, headers, response bodies, payment
  data, and identity fields were not captured.
- **Forged entitlement probes:**
  `GET /api/v1/entitlement/capabilities?as_plan=enterprise` and `as_plan=studio`
  both returned `200` with `plan=free`, `real_plan=free`,
  `simulated=false`, and `active=true`.
- **Tenant probes:** `GET /api/v1/organizations` returned `200` with zero
  organizations. Forged `organizationId=attacker` usage and search requests
  returned `403` with the bounded reason `organization access denied`.
- **Deletion read path:** `GET /api/v1/account/deletion` returned `200` with
  zero requests; no mutation was sent.
- **Expanded tenant/read matrix:** Forged organization/project parameters on
  projects, members, search, usage, evidence, policies, policy evaluations,
  releases, receipts, receipt detail, and receipt download all returned `403`
  with `organization access denied`. The project-root path exposes no GET
  operation and returned `405`; it returned no data.
- **Boundary:** This is authenticated browser/API boundary evidence for a Free
  account, not a complete modified CLI request matrix. Authenticated licensed
  CLI requests, record list/search/export coverage, and public/private runtime
  packaging evidence remain open; PLAN-CLI-003 remains unchecked.
