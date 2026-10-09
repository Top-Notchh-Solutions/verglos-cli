# PLAN-WEB-014 Cardless EMI binding merge and Production rollout — 2026-10-10

## Scope

- Backlog: `PLAN-WEB-011`, `PLAN-WEB-012`, `PLAN-WEB-014`, `PLAN-WEB-015`
- Gate: Gate 4 payment-method binding and Production code-rollout stage
- Web code commit: `210d8809034210b3a658d0e6635e70ebb65058d2`
- CI hardening commit: `7cfbba6f012093f296d0ef2a4828aed3f4611282`
- Merged Web commit: `98dd5712413d36a2bfdcc5edc244d193275faea5`
- PR: [Web PR #172](https://github.com/anuragyadav-git/verglos-web/pull/172)

## Implementation

The Razorpay Test Mode account returned one captured provider payment using
`cardless_emi` while the immutable signed order snapshot bound canonical
`emi`. The Web handler now accepts that provider representation only when
canonical `emi` is present in the signed checkout method set. It does not add
Cardless EMI as a new catalog method and continues to reject unbound methods.

The hosted verification workflow now pulls the Docker Official Postgres image
through ECR Public at the pinned image-index digest
`sha256:f7d23353e1b15400d22ebe31189f4d314b87a4c129cc400c8c2d8d4ca127bf81`.
The Docker Hub and ECR Public image-index digests matched during read-only
inspection, and the ECR image pulled successfully locally. This change fixes
the observed unauthenticated Docker Hub pull-rate failure without changing
application or payment behavior.

## Qualification

- Focused Web tests: **25/25 pass**.
- Local Web serial suite: **900 total / 876 pass / 24 explicit skips / 0 fail**.
- Local typecheck, production build, Drizzle schema check, migration ordering,
  and diff checks: pass.
- Hosted Verify run `37991101222`, job `114025167923`: all steps passed,
  including typecheck, serial tests, private-runner E2E, negative boundary,
  truth registry, database/schema checks, build, public-boundary, dependency,
  SBOM, license, and tracked-secret checks.
- GitGuardian and Vercel checks: pass.

## Production code rollout

- Vercel deployment: `dpl_EtggBABkjCRWS9NWHozgH6qbvr5J`.
- Deployment state: READY, target Production, aliased to `https://verglos.com`.
- Production runtime configuration check: pass.
- Read-only public smoke: `/`, `/checkout`, and `/docs` returned HTTP 200.
- Unauthenticated `GET /api/razorpay/create-subscription` returned HTTP 405.
- HSTS was present.
- Checkout response contained no Test Mode key, plan ID, Preview marker, or
  database URL.

## Acceptance boundary

This is a merged Gate 4 code repair and a fail-closed Production code rollout.
The complete enabled-method and subscription lifecycle matrix remains open,
including renewal, provider failure/expiry, refund replay/order,
replay/out-of-order delivery, timeout/retry, exactly-once behavior, and full
provider/ledger/entitlement reconciliation. Production billing and database
activation remain disabled and separately preflighted.

No Production database, migration, payment, provider, entitlement, account,
customer-data, or manual-row write occurred. No private evidence or secrets
were pushed to the public Web repository. No backlog checkbox changed.

Score remains **219 checked / 61 unchecked / 280 total (78.2%)**.
