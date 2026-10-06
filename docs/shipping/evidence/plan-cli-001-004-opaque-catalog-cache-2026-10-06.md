# PLAN-CLI-001/004 opaque catalog and cache qualification

Date: 2026-10-06
Repository: `verglos-cli`
Branch: `feat/cli-hunt-execution-v1`
Commit: `937705b`
Pull request: [CLI PR #71](https://github.com/Top-Notchh-Solutions/verglos-cli/pull/71)

## Scope

This batch hardens the client-side entitlement contract without introducing a
client plan catalog or changing production state:

- preserve the Web capability response's server-owned `catalog_version` through
  CLI cache and resolved entitlement output;
- reject malformed catalog-version metadata before accepting the capability
  payload;
- do not reuse a stale capability cache created for a different founder
  `as_plan` simulation; and
- retain opaque capability strings and future allowance-shaped fields in the
  frozen server-shaped fixture contract.

## Verification

- `pnpm --filter verglos test -- entitlement-jwt.test.ts entitlement-offline.test.ts license-api.test.ts`
  invoked the package runner; the runner completed all discovered CLI test
  files with zero failures, including the 14 entitlement JWT tests, 11 offline
  entitlement tests, 2 license API tests, and the remaining CLI regression
  files.
- `pnpm --filter verglos typecheck` passed.
- `pnpm --filter verglos build` passed.
- `git diff --check` passed before commit.
- Hosted evidence is pending on PR #71 and must be recorded separately after
  completion; local evidence is not substituted for hosted qualification.

## Boundary and remaining gates

This is code-side PLAN-CLI-001/004 progress only. It does not prove production
signer activation, trust-root deployment, tenant mapping, live v2 token
issuance, provider billing, production access, or final release acceptance.
PLAN-CLI-001, PLAN-CLI-004, PLAN-CLI-002, TEAM-CLI-001, and the dependent final
corpus/POC gates remain open. R-041 remains open: the exposed production
database credential must be rotated and verified before any production
read/write or migration operation.
