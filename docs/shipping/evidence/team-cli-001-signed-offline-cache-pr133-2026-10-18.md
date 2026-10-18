# TEAM-CLI-001 signed offline-cache authenticity — 2026-10-18

## Scope

This packet records a bounded CLI hardening slice for the organization-policy
fetch/cache contract. It is implementation evidence only; it is not entitlement,
provider-delivery, customer-acceptance, or AppSec evidence.

## Public source and commits

- Repository: `Top-Notchh-Solutions/verglos-cli`
- Pull request: [#133](https://github.com/Top-Notchh-Solutions/verglos-cli/pull/133)
- Normal merge: `4aa62286e31cc7e9fcbeef0eebc5a383b4d6a0fc`
- Implementation: `df615be38fb6e3409ca601781e594e39fd438803`
- Regression test: `77de3ab5ff3349d3766b58ccdbf26b6b02d49efd`
- No squash, rebase, force-push, or documentation-only commit was used.

## Change

The offline cache now retains the signed organization-policy envelope identity:
key ID, signature, signer, and signed timestamp. Offline resolution reconstructs
and verifies that envelope against the trusted active key before accepting the
cached policy. A cache actor can no longer replace both policy JSON and its
self-consistent digest without also producing the trusted signer signature.

The cache parser bounds and validates those retained fields before persistence.
Existing unsealed cache files fail closed rather than being treated as trusted.

## Verification actually run

- `pnpm --filter @verglos/shared build` — passed.
- `pnpm -C packages/cli build` — passed.
- `pnpm -C packages/cli exec tsc --noEmit` — passed.
- Shared organization-policy, CLI cache, and CLI fetch tests — **15/15 passed**.
- `git diff --check` — passed.
- Hosted PR checks — **11/11 passed**: Ubuntu/macOS/Windows Node 20/22/24,
  Verglos self-scan, and in-toto release binding.

## Security regression covered

The new shared test replaces cached policy JSON and recomputes its digest while
retaining the original signature. Offline resolution returns `invalid-signature`.
The existing remote verification, offline fallback, expiry, body-size, scope,
endpoint, redirect, and cache-file-boundary tests remain green.

## Disposition

Keep `TEAM-CLI-001` unchecked. This commit does not prove a mapped paid or
non-production entitlement, authenticated hosted CLI fetch/cache/offline/
expiry/cross-tenant observations, provider delivery, reconciliation, or complete
acceptance. It does not change the independent Hunt/AppSec hold set.

Score remains **232 checked / 48 open / 280 total (82.9%)**.
