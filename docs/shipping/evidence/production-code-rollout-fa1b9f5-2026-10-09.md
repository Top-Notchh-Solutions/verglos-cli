# Production code-rollout evidence — Web `fa1b9f5` — 2026-10-09

## Scope

This records the requested Production deployment of the reviewed Web source
`fa1b9f5c50258ef23daaac4bbf32b24bbd590ef5` (`fix(checkout): surface terminal
subscription states`) as a fail-closed code rollout only.

The deployment was created with the normal Vercel Production command from the
Web working tree. The only pre-existing untracked path was `.worktrees/`, and
it was not included in the deployment source.

## Deployment result

- Vercel deployment: `dpl_4cb7vvAA88aZe3FKXftdmYfSbGJN`
- Deployment state: `READY`
- Production alias: `https://verglos.com`
- Previous READY rollback target: `dpl_72ptf8YQyLxxXvJHVQDg2vUfh3CN`
- Remote runtime-config validation: passed (`Production runtime configuration is valid`)
- Remote Next.js build: passed; static generation completed for 47 pages
- Local source checks already recorded for this commit: focused checkout tests
  8/8, typecheck, build, and Web serial suite 896 total / 872 pass / 24
  explicit skips / 0 fail

## Read-only Production smoke

- `/`: HTTP 200
- `/checkout`: HTTP 200
- `GET /api/razorpay/create-subscription`: HTTP 405
- unauthenticated `POST /api/razorpay/create-subscription`: HTTP 403

The write route was not called with credentials. No order or subscription
request was authorized by this smoke. No browser checkout was opened against
Production and no provider test flow was run against Production.

## Explicit boundary

This deployment did not add or copy Production plan IDs, Test Mode plan IDs,
Test Mode credentials, Preview database URLs, webhook secrets, or fixture
identities. It did not execute migrations or call a payment provider. No
Production database, migration, payment, provider, entitlement, account, or
customer-data write occurred.

The source tree contains the unreleased billing migration
`0038_billing_subscription_expired.sql`; this deployment did not apply it.
Any Production schema/database activation for this candidate remains gated on
the operation-specific current-backup/RPO, migration, reconciliation, and
rollback/forward-fix preflight.

## Disposition

This qualifies the complete fail-closed Production code-rollout slice and
keeps Production explicitly in the shipping goal. It does not close Gate 4,
the subscription lifecycle rows, Gate 6, Gate 7, Gate 8, or Gate 9. The
canonical backlog score remains **219 checked / 61 unchecked / 280 total
(78.2%)**; no checkbox changed.

