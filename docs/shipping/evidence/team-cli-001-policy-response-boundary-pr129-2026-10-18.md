# TEAM-CLI-001 policy response boundary — 2026-10-18

## Scope

This packet records a public implementation slice for the organization policy
client. It is not hosted entitlement, provider delivery, customer acceptance,
or independent AppSec evidence.

## Public source and history

- Repository: `Top-Notchh-Solutions/verglos-cli`
- Pull request: #129
- Normal merge commit: `9eba5102a1c0f9d7ee13b28bb2cc28bb50766eae`
- Merge parents: `50bcab42eadfa8796d86d1f7a8aaee3010c65647` and
  `9d0646034b55e83ac1c997699c7cd910353e2bc4`
- Implementation commit: `36fb82f3` (`fix(cli): bound organization policy response reads`)
- Regression-test commit: `9d064603` (`test(cli): cover organization policy body limits`)
- `origin/main` was verified at the normal merge commit.

The merge preserves the implementation and test commits; no squash, rebase,
force-push, empty, duplicate, or artificial commit was used.

## Implementation

`packages/cli/src/organization-policy-fetch.ts` now validates the caller's
timeout against a ten-second maximum and reads the response through a bounded
streaming reader. The reader cancels an oversized body before JSON parsing and
caps the policy response at 1 MiB. This prevents an unbounded response body
allocation while preserving the existing fail-closed error classification.

## Verification

Executed in the clean PR worktree:

- `pnpm install --frozen-lockfile` — passed.
- `pnpm build` — passed, workspace build **8/8**.
- `node --import tsx --test src/organization-policy-fetch.test.ts src/organization-policy-cache.test.ts` — **9/9 passed**.
- `pnpm --filter verglos test` — passed with no failures; the existing Docker
  target-code cases remain explicit environment-gated skips when their flag is
  not enabled.

The focused tests cover streamed oversized responses and rejection of a
timeout above the public bound, in addition to the existing signed fetch,
cache, offline, scope, and malformed-response cases.

## Acceptance mapping and remaining work

This advances the code-side bounded-fetch portion of `TEAM-CLI-001`. The row
remains unchecked. Still required are the mapped paid/non-production
entitlement, authenticated signed CLI fetch/cache/offline/expiry/cross-tenant
observations, provider delivery/reconciliation, and the row's final acceptance
mapping. These are non-AppSec external artifacts and are not replaced by this
local implementation result. Hunt/AppSec rows remain on their separate hold.

## Privacy boundary

No policy document, source tree, credential, bearer, private key, provider
payload, customer data, or browser state is included in this packet.

