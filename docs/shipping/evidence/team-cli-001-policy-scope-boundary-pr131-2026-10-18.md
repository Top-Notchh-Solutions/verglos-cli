# TEAM-CLI-001 policy scope boundary — 2026-10-18

## Scope

This packet records a bounded organization-policy client hardening slice. It
is not entitlement issuance, hosted customer acceptance, live provider
reconciliation, or independent AppSec evidence.

## Public source and merge

- Repository: `Top-Notchh-Solutions/verglos-cli`
- Pull request: #131
- Normal merge commit: `234c7641cce2bbc33ffdb62fd83e1fe9b72e3beb`
- First parent: `efa64f5cf1ec9f6ff960c48f06f7bc3c1e239a0d`
- Implementation commit: `e91e792582416fc28050ddbc2c6753357e155f1d`
- Regression-test commit: `ec237f5339c4f937da5366039315c8bf3e5c5679`

The merge preserved separate implementation and test commits. No
squash/rebase/force-push/empty/duplicate/artificial/irrelevant
documentation-only commit was used.

## Implementation

The organization-policy fetcher now rejects malformed organization or
repository scope identifiers before reading the cache, loading credentials,
constructing an authenticated endpoint, or invoking the network. The accepted
scope grammar remains bounded and compatible with the cache scope contract.

## Verification

- `pnpm install --frozen-lockfile` passed.
- Workspace `pnpm build` passed **8/8**.
- Focused organization-policy cache/fetch tests passed **10/10**.
- Full `pnpm --filter verglos test` completed with no failures; its two
  A2 Docker target-qualification tests remained explicit skips because target
  integration was not enabled for this policy-only change.
- The completed run passed in-toto, self-scan, and the full Ubuntu/macOS/
  Windows Node 20/22/24 matrix: **9/9 platform jobs passed**.
- GitHub annotations recorded only runner/tooling notices about Node 20 action
  deprecation, the Ubuntu label migration, and macOS arm64 queue capacity;
  there were no test failures.

## Acceptance mapping

This advances the input-boundary portion of `TEAM-CLI-001`. The row remains
unchecked for mapped paid/non-production entitlement, authenticated signed
fetch/cache/offline/expiry/cross-tenant observations, provider delivery,
reconciliation, and complete acceptance.

## Privacy boundary

No license key, policy body, customer source, provider token, private key,
browser cookie, payment data, or hosted payload is recorded.
