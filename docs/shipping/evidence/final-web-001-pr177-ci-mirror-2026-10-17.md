# FINAL-WEB-001 / PR #177 CI mirror repair — 2026-10-17

## Scope

This packet records one public CI reliability repair for Web PR #177. It does
not close a final-Web backlog row or any AppSec-dependent row.

- Repository: `https://github.com/anuragyadav-git/verglos-web`
- Pull request: `177`
- Branch: `feat/final-web-001-truth-registry-20261017`
- Assignment: `anuragyadav-git`
- Public implementation commit: `34e6010dbb88ee72e9a2e7435d6e859f671ee4c8`
- Regular merge commit: `0674dacef52d35d1a2c8b103c3c3983e349ad339`
- Merge time: `2026-10-17T18:35:27Z`

## Failure and repair

The prior verification run `39057867924` failed before checkout while the
GitHub-hosted runner tried to pull
`public.ecr.aws/docker/library/postgres:15-alpine`:

    toomanyrequests: Data limit exceeded

The workflow now uses
`mirror.gcr.io/library/postgres:15-alpine` with the unchanged immutable image
index digest
`sha256:f7d23353e1b15400d22ebe31189f4d314b87a4c129cc400c8c2d8d4ca127bf81`.
A local registry-header check returned HTTP 200 and the same
`docker-content-digest`; the workflow YAML parsed successfully and
`git diff --check` passed.

## Hosted verification

New GitHub Actions run `39058598234` passed the complete `typecheck-and-schema`
job in 2m04s. The run passed container initialization, frozen install,
typecheck, serial tests, private-runner E2E, negative-boundary tests,
truth-registry tests, database/schema checks, production build, public-boundary
audit, dependency audit, CycloneDX SBOM, license inventory/tests, and the
tracked-secret guard. GitGuardian, Vercel, and Vercel Preview Comments also
passed for the merged PR head.

## Boundary and disposition

- No npm publication, deployment promotion, database migration, provider
  write, customer operation, browser-session change, or AppSec decision
  occurred.
- The change preserves normal granular history and used no squash, rebase,
  force-push, empty, duplicate, or artificial contribution commit.
- PR #177 is merged and the public `main` head is the regular merge commit
  above.
- FINAL-WEB-001/003/004 remain implementation-progress records until their
  complete row-specific acceptance conditions are met; the private score is
  unchanged at **230 checked / 50 open / 280 total (82.1%)**.
