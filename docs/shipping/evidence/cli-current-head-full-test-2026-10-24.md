# CLI current-head full monorepo test · 2026-10-24

## Controlled execution

- CLI source: `aad2c74395a5c381c955ab9dfab7462295564840`, including the
  version-bound SBOM/SPDX release-sidecar fix merged in CLI PR #241 as
  `8e87c81d2e6cd28dd79e05eff18ccedd3e93b8d9`.
- Command: `pnpm test` in the clean CLI implementation worktree. Turbo ran
  the eight package test targets with remote caching disabled.
- No npm publication, registry write, release tag, GitHub Actions run, or
  provider/Production action was performed.

## Result

Turbo completed **13/13 tasks successfully**, with **0 failed tasks** and no
test task cancellation. The package logs include the repository's explicit
Docker Hunt integration skips where a pinned Hunt image and opt-in integration
flag are required; those designed skips are not represented as adversarial
security evidence.

## Shipping disposition

This refreshes current-head CLI implementation/regression evidence for the
distribution and release-contract surfaces. It does not open trusted npm
publication/provenance, provider/Production, independent AppSec/Hunt,
customer/recipient, or final release gates. No checkbox changed. The
authoritative tracker remains **245 checked / 35 open / 280 total (87.5%)**,
partitioned as **13 AppSec-dependent / 22 non-AppSec**. Existing untracked
local artifact drafts were left untouched.
