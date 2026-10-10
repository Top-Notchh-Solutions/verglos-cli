# PLAN-CLI-001 Preview v2 issue→verify revalidation — 2026-10-10

## Result

The current Web Preview deployment `dpl_553h93xmbKWFAPKSdr8t3679reU7` was
qualified against the isolated Neon Test database with
`VERGLOS_PREVIEW_DATABASE_ISOLATED=true`. No Production environment, database,
payment, entitlement, account, or customer-data write occurred.

An existing mapped active Pro fixture issued a v2 token through the deployed
`POST /api/v2/entitlement/token` route:

- HTTP **200**, `ok=true`, `token_version=2`, `plan=pro`;
- catalog version `2026-10-02.0`;
- three JWT segments;
- tenant-scoped owner claims;
- 21 opaque capabilities and bounded catalog allowances.

The exact current CLI `@verglos/entitlement` verifier accepted that deployed
token with `schemaVersion=2`, Pro plan, tenant scope, and the pinned signing
key. Verification used a temporary HOME so the qualification cache did not
alter the operator's normal CLI state.

## Acceptance boundary

`PLAN-CLI-001` is already checked in the authoritative backlog at
**223 checked / 57 unchecked / 280 total (79.6%)**. This rerun confirms the
current Preview configuration and deployment still satisfy its issue→verify
acceptance. It does not close Gate 4 or any provider lifecycle item; recurring
renewal/failure/expiry/refund/replay/order reconciliation remains under
`PLAN-WEB-012`/`PLAN-WEB-014`.
