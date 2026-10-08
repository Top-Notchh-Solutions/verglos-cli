# CLI backend, Hunt, and distribution qualification — 2026-10-08

## Scope

This batch used the isolated CLI worktree `feat/cli-backend-qualification` at
source `94829e1a4fc8e42dd67545e99cbe9a3a837b9482` (CLI `origin/main`). It
covered implementation/qualification evidence for HUNT-008–011,
PLAN-CLI-001/002/004, TEAM-CLI-001/002, ENT-CLI-001, QUAL-CLI-004/006,
LIC-002/003, and DIST-001–003/006. These IDs remain open unless their
individual external acceptance criteria are separately satisfied.

## Local results

- Docker Desktop was reachable at server `29.7.2`, macOS arm64.
- The repository's pinned fixture `postgres:15-alpine` with digest
  `sha256:2bf082886c059b4cf5af3f9e8d3a8916c35699062899061c13bc32d5921c631a`
  was pulled and used by the evidence harness.
- `scripts/hunt-adversarial-evidence.mjs` completed with **60 pass / 1
  explicit macOS namespace skip / 0 fail**, Node `v26.4.0`, source commit
  `94829e1a4fc8e42dd67545e99cbe9a3a837b9482`.
- `pnpm --filter verglos test` exited 0 after the workspace build. The
  configured CLI package tests passed; the Hunt package's ordinary suite was
  **45 pass / 0 fail**, with its 16 Docker-runtime cases skipped until the
  integration flag was enabled.
- `pnpm build`, `pnpm typecheck`, and `pnpm lint` exited 0. Turbo reused
  existing cache entries for these commands; the full CLI test command was
  executed through the package test runner.
- The release/public-boundary contract tests passed **10/10**.
- `check-package-contents.mjs` passed for all six public packages,
  `check-public-boundary.mjs` passed, and `check-packed-manifests.mjs` passed
  for all six generated npm archives.
- The focused release-script suite passed **12/12**, covering deterministic
  notices, license inventory failure behavior, SBOM component preservation,
  and clean public packing.
- `pnpm pack:public` passed after installing all lockfile optional-platform
  packages using the same `supportedArchitectures` setup as the release
  workflow. The temporary setup was reverted in the worktree and no source
  change was made.

## Distribution blocker discovered

The strict release sequence stopped at:

```text
node scripts/license-inventory.mjs --require-clear
```

It reported seven unresolved review blockers:

- `glob@13.0.6` — BlueOak-1.0.0;
- `lru-cache@11.5.2` — BlueOak-1.0.0;
- `minimatch@10.2.6` — BlueOak-1.0.0;
- `minipass@7.1.3` — BlueOak-1.0.0;
- `minipass-flush@1.0.7` — BlueOak-1.0.0;
- `path-scurry@2.0.2` — BlueOak-1.0.0;
- nested `benchmark@1.0.0` under `fast-uri@3.1.7` — license conflict with
  the containing package.

The license inventory is intentionally fail-closed; no blocker was marked
clear and no release archive was accepted. LIC-002/003 and DIST-001–003 remain
open pending legal/redistribution disposition or a reviewed dependency change.

## Boundaries and limitations

No production, database, migration, deployment, provider, payment, registry,
customer, reviewer, or npm publication operation occurred. The Docker report
proves the pinned local/CI adversarial suite only; it is not an independent
security review, does not prove customer workload safety, and the macOS run
cannot prove Linux namespace isolation. Hunt trusted publisher roots, licensed
recipe provenance, independent review, and approved operational execution
remain open. The CLI backlog count therefore remains **218 checked / 62 open /
280 total (77.9%)**.
