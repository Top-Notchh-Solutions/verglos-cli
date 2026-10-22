# DIST-001 current merged-head package requalification · 2026-10-22

## Scope

This packet records the current public CLI package boundary at merged head
`db3510356ecd6c6e430d7dcb3b9354e514d777ee` (PR #167 merge). It is a fresh
qualification of the already-implemented package front door; it does not
claim legal clearance, trusted publication, Hunt independence, or final
release acceptance.

## Verification

In the clean detached CLI worktree, with no source or lockfile edits:

- `pnpm exec turbo run build --force`: **8/8** tasks passed.
- `node scripts/pack-public-packages.mjs <disposable-directory>`: **7** npm
  archives produced.
- `node scripts/check-packed-manifests.mjs <disposable-directory>`: passed
  for all **7** archives, including package allowlists, regular archive
  members, repository license bytes, and resolved workspace dependencies.
- `node scripts/verify-clean-consumer.mjs <disposable-directory>`: passed;
  all seven libraries imported, `verglos 2.0.0-alpha.1` ran, no external
  engine was installed, and the bounded signed A1 fixture completed through
  the restricted-process runtime.

The disposable archive directory and logs were outside the repository. No
registry call, npm publication, tag, provider, Production, database,
customer, legal, or AppSec state changed.

## Disposition

`DIST-001` remains unchecked because its contract still depends on
LOCAL/HUNT/RECORD surfaces and final legal/release qualification. This packet
confirms the current package implementation is not the blocker. The exact
source remains public CLI `origin/main`; the private tracker and evidence
bundle retain this record.

Current score: **239 checked / 41 open / 280 total (85.4%)**.
