# Cross-tier local qualification — 2026-10-08

## Batch boundary

- **Relevant backlog:** `PRO-008`, `TEAM-CLI-001/002`, `TEAM-WEB-006`,
  `STUDIO-CLI-001`, `ENT-CLI-001`, `QUAL-WEB-006`, and supporting plan/tenant
  gates
- **Repository:** current `verglos-web` worktree; no code changes
- **Database:** fresh loopback-only PostgreSQL 15 Alpine container at pinned
  digest `sha256:2bf082886c059b4cf5af3f9e8d3a8916c35699062899061c13bc32d5921c631a`
- **Runtime:** macOS host, Node `v26.4.0`, pnpm `10.34.5`; Web declares
  Node `22.x`, retained as a runtime limitation
- **External state:** no provider, Preview, Production, customer, or public
  repository state used

## Results

- Pure cross-tier/authorization suite: **96 passed / 0 failed / 0 skipped**
- Database-backed organization/commercial/dashboard suite: **10 passed / 0
  failed / 0 skipped**
- Aggregate: **106 passed / 0 failed / 0 skipped**
- `pnpm typecheck`: passed
- `pnpm db:check`: passed
- `pnpm db:migrations:check`: passed; **37** ordered migrations verified
- Local empty-database bootstrap plus migration application: passed
- Container stopped after the run; no containers remained

## Coverage

The pure suite composed Team policy, roles, exceptions, signing, work-item and
portfolio behavior; Studio agency/client isolation, branding, publication,
handoff, allowance, hold, retention, and offline-record behavior; Enterprise
SSO, SCIM, runner, KMS, role separation, residency/egress, retention, and audit
export behavior; invitation lifecycle; capability/plan authorization; denial
contracts; and allowance admission.

The database-backed suite covered organization commercial-state binding,
tenant predicates and forged-query resistance, release/findings/monitoring/
records repositories, alert credential handling, receipt persistence, and
runtime data-route tenant privacy.

## Disposition and limitations

This is local implementation/integration evidence, not paid-plan or hosted
acceptance. It does not prove real Team/Studio/Enterprise customer
organizations, provider billing/subscription lifecycle, GitHub App/org
cutover, deployed signer activation, independent review, production
reconciliation/recovery, or final POC. No checkbox changed. No production,
provider, payment, entitlement, deployment, or public-repository write
occurred.
