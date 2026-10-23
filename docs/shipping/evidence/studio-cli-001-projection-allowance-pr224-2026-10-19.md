# STUDIO-CLI-001 hosted projection allowance hardening — 2026-10-19

## Scope

This packet records a production-logic correction for the hosted client
projection custody path. It advances the code-side implementation of
`STUDIO-CLI-001`; it does not close the backlog row because the row still
requires a numeric paid/non-production allowance and authorized Studio
recipient/customer acceptance.

## Public source and history

- Repository: `https://github.com/anuragyadav-git/verglos-web`
- Base: Web `origin/main` at `a1854ad1cc5ba6fcb97d5784045ddd5e7ee7e001`
- Pull request: #224
- Implementation: `e3a62aa` (`fix(web): enforce projection custody allowance`)
- Regression: `6f5f29c` (`test(web): qualify projection custody allowance`)
- Normal merge: `ec1a0ecb4127470bd0dab47aa1de6913b3c72574`
- Merge method: regular merge; no squash, rebase, force-push, empty, or
  documentation-only contribution

## Original logic implemented

`POST /api/v1/organizations/[organizationId]/projects/[projectId]/client-projections`
now uses the existing canonical `hosted.ingestion.records` usage ledger before
persisting custody. The reservation identity is the canonical projection
digest, so an exact retry is idempotent while two distinct approved client
projections consume distinct custody units. Missing allowance returns 403,
exhaustion returns 429, and ledger/infrastructure failure returns 503; none
of those paths persist a projection. Successful persistence commits the
reservation and reports its bounded usage state.

## Verification

- Projection, usage-ledger, and Studio allowance tests: **24/24 passed**.
- Route integration against disposable PostgreSQL 15 Alpine pinned to
  `sha256:2bf082886c059b4cf5af3f9e8d3a8916c35699062899061c13bc32d5921c631a`:
  **1/1 passed**. The test covered first upload, digest-bound reservation,
  idempotent retry without a second reservation, redaction/tenant checks, and
  quota denial before persistence.
- `pnpm exec tsc --noEmit`: passed.
- `pnpm build`: passed; **48/48** pages generated.
- `git diff --check`: passed.
- Hosted Verify web run `39246014511`: passed.
- Hosted PR checks: GitGuardian, isolated PostgreSQL, Ubuntu/macOS/Windows
  protocol matrix, Vercel, Preview Comments, and typecheck/schema all passed.
  The first PostgreSQL attempt failed before checkout because GitHub's public
  ECR mirror returned `toomanyrequests: Data limit exceeded`; rerun job
  `118039169321` passed.

The local runtime was Node `v26.4.0` / pnpm `10.34.5`; the package requests
Node `22.x`. The disposable database container was removed after the test.

## Acceptance boundary and disposition

`STUDIO-CLI-001` remains unchecked. This change proves the missing allowance
enforcement logic but does not create a paid plan entitlement, an authorized
recipient, or customer acceptance. No production database, billing catalog,
provider, customer, npm, or AppSec state changed.

Score remains **239 checked / 41 open / 280 total (85.4%)**. Hunt/AppSec rows
remain held separately.
