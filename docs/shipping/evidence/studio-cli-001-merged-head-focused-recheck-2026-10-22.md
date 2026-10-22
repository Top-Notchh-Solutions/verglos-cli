# STUDIO-CLI-001 merged-head focused recheck · 2026-10-22

## Scope

This recheck covers the repository-owned client projection and hosted custody
contracts at the current merged CLI/Web heads. It does not claim independent
recipient/customer acceptance, provider payment, Production entitlement, or
an external audit artifact.

## Exact source

- CLI merge head: `1d7844bd0fcfa4415e2c9462f9b5fb5293326915` (PR #166)
- Web merge head: `67f8f89be193dff7053d0abd946b288301bf2b87` (PR #238)
- Both source worktrees were clean before and after the recheck.

## Qualification

- CLI shared package suite completed successfully; the client-projection
  admission contract reported **5/5** passed.
- CLI `client-projection-upload.test.ts` reported **6/6** passed.
- Web projection, route-contract, client-leakage, and Studio E2E contracts
  completed successfully with no failures; the listed Studio scenarios all
  passed, including redaction, cross-tenant refusal, allowance, handoff, and
  offline-record boundaries.
- The Web PostgreSQL route integration reported **1/1** against a newly
  started local PostgreSQL 15 container with database `verglos_test`, using
  the wildcard path `src/app/api/v1/organizations/*/projects/*/client-projections/route.integration.test.ts`.
  The container was stopped after the run and not removed.

Commands were run with `env -u TEST_DATABASE_URL` except the explicitly
selected local `TEST_DATABASE_URL` for the isolated integration test. The
remote Neon URL from `.env.test.local` was never used. An initial
misconfigured container was left stopped and untouched; the correctly
configured qualification container was also stopped without removal. No remote database,
deployment, provider, payment, customer, recipient, legal, reviewer, or
Production operation occurred. No file, branch, record, deployment, provider,
customer, database, or release artifact was deleted or changed.

## Disposition

The repository-owned STUDIO-CLI-001 contract is implemented and the current
focused regression surface is green. Keep the backlog row unchecked: the
remaining acceptance artifact is an authorized independent recipient/customer
observation with its hosted/audit evidence. Score remains **239 checked / 41
open / 280 total (85.4%)**.
