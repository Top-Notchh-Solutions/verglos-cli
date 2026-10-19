# TEAM-WEB-003 policy creation state-machine hardening — 2026-10-19

## Scope

This packet records a real Web production-logic correction on top of the
current `origin/main` merge `0719074d5a6f83198f5e36c0eeb064f2a12e1b1b`.
It does not close a backlog row or replace hosted, legal, customer, release,
or independent-review evidence.

## Implementation

- `9489fb6` (`fix(web): enforce draft-first policy creation`) adds the pure
  `admitPolicyCreation` decision and wires the policy create route to it.
- New policy versions must enter as `draft`; `published` and `retired` first
  writes are rejected.
- `effectiveFrom` is rejected during creation and can only be assigned by the
  existing publish transition, preserving transition audit and stale-date
  checks.
- The route persists the admitted state rather than trusting caller-provided
  lifecycle fields.
- `75de374` (`test(web): guard draft-first policy lifecycle`) adds pure and
  route-contract regression coverage.
- PR: https://github.com/anuragyadav-git/verglos-web/pull/223

## Verification

Commands run in clean worktree `/tmp/verglos-web-policy-creation-20261019`:

```text
pnpm install --frozen-lockfile
pnpm exec tsx --test src/lib/organizations/policy-lifecycle.test.ts src/lib/organizations/tenant-scope.test.ts src/lib/organizations/negative-boundary.test.ts src/lib/organizations/scm-route-contract.test.ts
pnpm typecheck
pnpm build
git diff --check
```

Results:

- focused policy/tenant/negative-boundary/SCM contracts: **45 passed / 0
  failed / 0 skipped**;
- typecheck: passed;
- optimized Next build: passed, **48/48** static pages generated;
- diff check: passed;
- runtime reported Node `v26.4.0` / pnpm `10.34.5`; the package requests
  Node `22.x`, so this environment warning is retained.
- Hosted PR verification passed after one provider-side retry: the first
  isolated-PostgreSQL attempt failed before tests because GitHub Actions could
  not pull the pinned service image from ECR (`toomanyrequests: Data limit
  exceeded`); rerun job `118035241202` passed. Verify-web run `39244909659`
  and PR checks passed for typecheck/schema, Ubuntu/macOS/Windows protocol,
  Vercel, Preview Comments, GitGuardian, and isolated PostgreSQL.
- PR #223 was merged normally (not squashed) as merge commit
  `a1854ad1cc5ba6fcb97d5784045ddd5e7ee7e001`.

## Disposition

`TEAM-WEB-003` was already checked for its accepted policy lifecycle contract;
no checkbox changed. The live score remains **239 checked / 41 open / 280
total (85.4%)**. The implementation branch is not a production deployment;
no database, provider, customer, billing, release, npm, or AppSec state
changed. Hunt/AppSec rows remain held separately.
