# Authenticated modified-client request matrix — 2026-10-06

## Scope

This evidence covers the code-side authenticated request boundary for
PLAN-CLI-003. It does not claim a production authenticated probe, customer
session, payment, or production database access.

## Coverage

- The existing v2 entitlement route test submits forged plan, tier, tenant,
  organization, role, capability, allowance, usage, record, license, and client
  fields while presenting an authenticated license bearer. The issued claims
  remain server-derived (`pro`, `tenant-1`, owner, catalog allowances) and the
  response contains no attacker values.
- Web commit `7248919` (PR #147) adds explicit authenticated usage-route
  coverage. Forged tenant, plan, capability, usage, and record query fields
  return the bounded `invalid usage query` response before the ledger is
  touched.
- The same commit adds receipt-ingestion coverage. Forged plan, tier, tenant,
  organization, project, capability, allowance, usage, and record fields are
  rejected by the strict redacted-receipt projection before persistence.

## Verification

- Local Web typecheck: passed.
- Local full Web suite: 865 total / 843 passed / 22 explicit
  environment-gated skips / 0 failures.
- Disposable PostgreSQL receipt integration: 1/1 passed with
  `TEST_DATABASE_URL` against a local `postgres:15-alpine` container.
- Local production build: passed.
- Hosted PR #147 run `37492088157`: typecheck/schema passed; Vercel preview,
  GitGuardian, and Preview Comments passed.

## Boundary

This closes the code-side usage/record matrix gap only. PLAN-CLI-003 remains
open pending the complete authenticated production modified-client probe and
the remaining list/search/export/public-private runtime evidence. No checkbox
or release gate is marked complete by this document.
