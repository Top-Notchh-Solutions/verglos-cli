# ENT-CLI-001 private-runner read binding · 2026-10-23

## Implementation

- **Source commit:** `9218819a33a97e5944e57f2ac4bfa2174fc17f2e`
- **Pull request:** CLI PR #192
- **Merge commit:** `622d59ffb31a27cc6651e78fa1212a3767c5fcc3`
- **Source branch:** `codex/ent-cli-001-runner-read-binding-20261023` (preserved)
- **Contract change:** private-runner trusted-key and replay-cache reads now use
  bounded regular-file handles with `O_NOFOLLOW`, opened-handle identity and
  file-type checks, post-read identity/size checks, and short/oversized-read
  rejection. Existing protocol callers use the bound helper.

## Verification

- Focused private-runner tests: **13/13 passed**.
- CLI typecheck: passed.
- Full CLI package test target: passed with only the two existing explicit
  Hunt Docker integration skips.
- Forced workspace build graph: **7/7 tasks passed**.
- `git diff --check`: passed.
- Hosted standard validation `39898377713`: **success**.
- Hosted self-scan `39898377746`: **success**.
- Hosted platform matrix/in-toto `39898377834`: **success**, including all
  Ubuntu/macOS/Windows × Node 20/22/24 cells and the in-toto release-binding
  job.

## Boundary

This is implementation and hosted qualification evidence for `ENT-CLI-001`.
The backlog row remains unchecked for operational runner enrollment and
approved execution, cross-platform operational acceptance, independent review,
enterprise/customer acceptance where required, and final release decision.
No provider, customer, Production, deployment, registry publication, tag,
release, or public version action occurred. Nothing was deleted or overwritten.
The live score remains **244 checked / 36 open / 280 total (87.1%)**.
