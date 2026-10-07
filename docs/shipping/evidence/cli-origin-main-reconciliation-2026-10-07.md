# CLI exact-head reconciliation and Hunt adversarial qualification — 2026-10-07

## Scope

- The founder-owned CLI checkout at `verglos-cli` was left untouched because it
  contains untracked founder assets and private shipping material.
- `git fetch --prune origin main` reconciled the remote default branch to
  `7d060b2852551cc017bbb2b5f70bad22843e7273` (`feat(shared): restore
  standards importer corpus`).
- A clean worktree at
  `/Users/anuragyadav/Developer/TopNotchh-Workspace/.worktrees/cli-shipping-next`
  tracks `origin/main` at that exact head.

## Verification

- `pnpm install --frozen-lockfile`: 9 workspace projects, lockfile current;
  224 packages installed/reused.
- `pnpm exec turbo run test typecheck build --force`: **23/23 tasks passed**.
- This included the current Hunt execution/trust/runtime/MCP tests and the
  restored shared standards-importer corpus.
- Docker client/server: **29.7.2 / 29.7.2**.
- Bounded command:
  `VERGLOS_HUNT_TEST_IMAGE=postgres:15-alpine`
  `VERGLOS_HUNT_TEST_DIGEST=sha256:2bf082886c059b4cf5af3f9e8d3a8916c35699062899061c13bc32d5921c631a`
  `node scripts/hunt-adversarial-evidence.mjs .artifacts/hunt-adversarial`
- Exact-head Hunt result: **60 passed, 1 skipped, 0 failed, exit 0**, on
  macOS arm64 with Node `v26.4.0`.

## Limits and disposition

The adversarial result is local/CI harness evidence only. The skipped assertion
requires a Linux host; the run is not independent security review, official
publisher-root qualification, legal/trusted-publishing review, or customer or
production workload evidence. HUNT-008/009/010/011 and QUAL-CLI-004/006 remain
open for the trusted recipe/publisher, official validator, independent review,
and Linux isolation requirements. No backlog checkbox changed; the authoritative
count remains **218 checked / 62 unchecked / 280 total (77.9%)**.

No production, provider, payment, database, deployment, migration, credential,
customer-state, or browser-state write occurred. The generated local
`.artifacts/hunt-adversarial` report is not public evidence.
