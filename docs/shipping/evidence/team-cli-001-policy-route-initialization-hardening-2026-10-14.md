# TEAM-CLI-001 repository-policy route initialization hardening — 2026-10-14

## Public contribution

- Repository: `anuragyadav-git/verglos-web`
- Pull request: [#175](https://github.com/anuragyadav-git/verglos-web/pull/175)
- Contribution commit: `aace29cf223f41532403fd4e03666b6f68ac3fb3`
- Normal merge commit: `a54d70dfacfaf9506b1336b788d9cd86c9ca74d7`
- Merge mode: regular merge; no squash, rebase, force-push, or artificial
  activity.

## Change

The repository-bound organization-policy route now converts database
initialization failures into the documented private `503 policy unavailable`
response. This keeps the route fail-closed before tenant, repository, policy,
or signer data can be projected. The existing SCM route-contract suite now
asserts the complete boundary: bearer validation, active license, tenant
binding, GitHub installation/project binding, one active installation,
published canonical policy, signer invocation, digest equality, private
no-store headers, and no raw-body/logging path.

## Verification

- focused SCM route contracts: **8 passed / 0 failed**;
- full Web suite: **876 passed / 24 explicit skips / 0 failed**;
- TypeScript: passed;
- production build: passed, 47 static pages generated;
- hosted Verify run `38538138834`: all required checks passed, including
  typecheck, serial tests, private-runner E2E, negative boundary, truth
  registry, database checks, build, public-boundary audit, dependency/SBOM/
  license checks, and tracked-secret guard;
- Vercel Preview, Preview Comments, and GitGuardian: passed;
- no private shipping docs, credentials, production database, provider
  installation, npm publication, or production deployment changed.

## Acceptance boundary

This is implementation/qualification progress for TEAM-CLI-001 only. The row
remains unchecked pending an authorized provider installation and repository
binding, a published Preview policy, authenticated signed CLI fetch/cache/
offline/cross-tenant evidence, and the row's remaining hosted acceptance
criteria. Score remains **228 checked / 52 unchecked / 280 total (81.4%)**.
