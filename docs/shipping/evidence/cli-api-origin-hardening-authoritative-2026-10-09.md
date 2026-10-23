# Authoritative CLI API-origin hardening — 2026-10-09

## Scope

This is the authoritative-source correction for the CLI transport hardening
batch. The earlier local `439b782d` change was made in a stale checkout and is
not the release source. The same boundary is now implemented and verified in
the authoritative CLI worktree at commit
`1972af3abe648312a427c20dc96bbcce54db55a`.

## Implementation

`getTrustedApiOrigin` accepts only a bare HTTPS origin, canonicalizes a
trailing slash, and rejects HTTP, path-bearing, query-bearing,
fragment-bearing, userinfo-bearing, malformed, empty, and non-string values.
The boundary is applied before request construction to:

- license validation and status;
- unlock-token refresh;
- entitlement capability fetch and cache identity;
- device-code login;
- monitor registration and the shared authenticated monitor fetch;
- organization-policy fetch;
- private-runner poll and result upload; and
- account score synchronization.

Unsafe saved configuration fails closed before `fetch`; no license bearer is
sent to the configured unsafe destination. Explicit custom/self-hosted HTTPS
origins remain supported when they satisfy the origin contract.

## Verification

- Focused transport, entitlement, monitor, policy, runner, and account-sync
  tests: **24/24 passed**.
- Complete CLI package process suite: **44/44 passed**.
- Workspace typecheck graph: **12/12 tasks passed**.
- Workspace build graph: **12/12 tasks passed**.
- `git diff --check`: passed.
- Regression evidence: unsafe saved HTTP configuration caused **zero fetch
  calls** on the shared authenticated monitor path.

## Production and release boundary

This commit is CLI-only. Production remains part of the end-to-end shipping
goal, but no Web deployment was needed for this batch. No npm publish, tag,
protected release approval, Production plan/provider/payment call, database or
migration write, entitlement change, account change, or customer-data write
occurred. The current Web Production operation remains the previously
qualified fail-closed code-rollout stage.

## Disposition

This is backend/security progress. It does not close `PLAN-CLI-003`,
`QUAL-CLI-006`, Gate 4, or any external reviewer, legal, protected-release,
rollback, or final-acceptance gate. The live private score remains
**219 checked / 61 unchecked / 280 total (78.2%)**; no checkbox changed.
