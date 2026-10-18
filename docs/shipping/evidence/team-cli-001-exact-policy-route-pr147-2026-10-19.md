# TEAM-CLI-001 exact policy-route binding evidence

Date: 2026-10-19 UTC
Scope: code-side TEAM-CLI-001 hardening only

## Public implementation

- Repository: `Top-Notchh-Solutions/verglos-cli`
- PR: #147, merged normally: https://github.com/Top-Notchh-Solutions/verglos-cli/pull/147
- Merge commit: `5bf7ae70a0e8169f169750cfc188baf4d13685db`
- Implementation commit: `b761dee41d3f9a46fc8ebd60135eaefe6acdb154`
- Regression-test commit: `e28d831a5bf7b793a5f6434480b3c88bceee9f96`

The CLI organization-policy fetcher now requires the endpoint to be the exact
organization/repository policy route derived from the requested scope. A
same-origin alternate route is rejected before a request, and the bearer is
sent only to the exact tenant/repository route. Existing bounded timeout,
response-size, redirect, signature, cache, and offline behavior remains in
place.

## Verification actually run

- `pnpm install --frozen-lockfile`: passed.
- Focused policy-fetch tests: **10 passed, 0 failed, 0 skipped**.
- `pnpm build`: passed, workspace **8/8**.
- `pnpm --filter verglos typecheck`: passed.
- `pnpm --filter verglos test`: passed, exit code **0**.
- `node scripts/check-public-boundary.mjs`: passed.
- Protected PR checks: **12/12 passed**, including Linux, macOS, Windows,
  self-scan, standard/provenance validation, and in-toto release binding.

## Shipping disposition

This evidence advances the implementation and closes the exact-route
hardening subtask. It does **not** check TEAM-CLI-001. The row still requires
valid mapped paid/non-production entitlement, authenticated signed hosted CLI
fetch/cache/offline/expiry/cross-tenant/reconciliation evidence, and provider
delivery/reconciliation completion. No credentials, license values, private
keys, customer source, or policy document were recorded here.

Score remains **232 checked / 48 open / 280 total (82.9%)**. AppSec/Hunt
holds remain unchanged.

## Current owner-session entitlement recheck

Using the already-open authenticated owner page only, the account overview
still reports `FREE` and “No license key yet”; the account billing path is not
implemented (`404`). The existing checkout page exposes a Pro Razorpay payment
flow, but no payment or entitlement mutation was initiated. The browser was
restored to the organization policy page after this read-only check. This
confirms the remaining blocker is real hosted entitlement state, not a missing
CLI route implementation.
