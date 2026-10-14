# Hunt supported-recipe fixture-contract evidence

- **Date:** 2026-10-15
- **Public repository:** `Top-Notchh-Solutions/verglos-cli`
- **Pull request:** [#127](https://github.com/Top-Notchh-Solutions/verglos-cli/pull/127)
- **Contribution commits:**
  `165aefae0ebc2bc7586ecbaf8e379ab92013a8ec` and
  `2aaba53143865886e80334c4feb852fecbb58074`
- **Normal merge:** `fa77496b43d040fe8be977315078502e9e85b947`
- **Assignee:** `anuragyadav-git`

## Implemented contract

The supported Hunt recipe catalog now projects all five fixture outcomes
required by the shared recipe contract: positive, negative, timeout,
infrastructure failure, and unsupported. Catalog validation now compares each
recipe expectation with the corresponding catalog verdict and fails closed
with `fixtures_mismatch` when the metadata drifts. CLI and shared playbook
fixtures were updated to declare the unsupported outcome explicitly.

## Verification

- `pnpm --filter @verglos/hunt test` passed.
- `pnpm --filter verglos test` passed.
- `pnpm --filter @verglos/shared test` passed.
- `pnpm --filter @verglos/hunt typecheck` passed.
- `pnpm --filter verglos typecheck` passed.
- `node scripts/check-public-boundary.mjs` passed.
- `git diff --check` passed before commit.
- PR #127 hosted checks passed: self-scan, in-toto, and Ubuntu/macOS/Windows
  Node 20/22/24 (11 checks total).

## Acceptance boundary

This is a public implementation and contract-verification slice. It does not
close HUNT-008, HUNT-009, HUNT-010, HUNT-011, or QUAL-CLI-004. Supported-rule
approval, trusted/licensed recipe provenance, hosted entitlement, authorized
target evidence, independent AppSec review, `.vgl` binding, and final
acceptance remain open. No backlog checkbox or score changed; the live score
remains **230 checked / 50 unchecked / 280 total (82.1%)**.

The independent-review runbook now pins the exact merge
`fa77496b43d040fe8be977315078502e9e85b947`. No npm publication, tag,
deployment, customer source, secret, private tracker content, squash, rebase,
force-push, empty commit, or artificial contribution activity was used.
