# HUNT Scout target manifest contribution — PR #113

## Shipping identity

- Public PR: https://github.com/Top-Notchh-Solutions/verglos-cli/pull/113
- Source commits: `ee6dfa8d` (`feat(cli): add bounded Hunt target scouting`) and
  `3dae438e` (`test(shared): update contract schema count`). Both are preserved
  as ordinary substantive commits; no squash or force-push was used.
- Regular merge commit: `a399d00317dc495613483b934bb01f30f3ec5bb8`.
- Merge parents: prior public `main`
  `14d82d6d58547844084320121d390b79e0274103`, and feature head
  `3dae438e35d197d53c622495ec6718fabe8b53ae`.
- Merged at `2026-10-13T08:32:42Z`.

## Contract-aligned implementation

The public CLI now provides `verglos hunt scout <project> --json` as a bounded,
offline, read-only Scout/Context contribution. The manifest schema is
`urn:verglos:schema:hunt-target-manifest` and binds the inventory to the exact
resolved package or repository subject identity. It records frameworks,
entrypoints, route/API candidates, dependency boundaries, agent/MCP tool
candidates, candidate sinks, coverage, and explicit limitations.

The implementation is intentionally static. It does not run project code or
package lifecycle scripts, upload source, execute an attack, produce a proof or
counterexample, perform remediation/retest, or claim reachability or a
vulnerability. It extends the Scout/Context side of HUNT-008 and HUNT-009;
neither counted row is complete.

## Evidence

Local validation in the isolated public feature worktree:

- `pnpm install --frozen-lockfile` completed.
- Focused shared Scout tests passed `2/2`.
- Focused CLI Scout tests passed `2/2`.
- Local command-options plus Scout tests passed `6/6`.
- `pnpm --filter @verglos/shared test` passed.
- `pnpm --filter verglos test` passed, including the final Scout rerun.
- Forced dependency-graph build passed `7/7` Turbo tasks.
- Forced dependency-graph typecheck passed `13/13` Turbo tasks.
- `git diff --check` passed.

Protected verification:

- Verglos self-scan run `38368762038` passed all steps.
- Platform matrix run `38368762158` passed the in-toto binding and all nine
  Ubuntu/macOS/Windows Node 20/22/24 cells.
- The PR therefore passed all eleven required checks before merge.

The fixture suite included a package lifecycle script that would have created a
marker. The marker was not created. The JSON assertions also confirmed that the
temporary absolute root and source script body were absent from the manifest.

## Privacy and boundary

The scanner is bounded to 512 files, 4 MiB total input, 512 KiB per file, and
depth 12; it skips dependency/build/cache directories and symlinks. It emits
relative paths and candidate metadata only. No customer source, credentials,
provider state, entitlement state, external network, hosted target, database,
or production system was used. Owner authorization covered this public-safe
contribution, but it is not independent AppSec review, provider confirmation,
customer acceptance, legal clearance, or final release approval.

## Acceptance disposition

This evidence records a shipped implementation contribution and its protected
verification. HUNT-008 and HUNT-009 remain unchecked pending their complete
acceptance criteria, including supported-rule/trusted-provenance treatment,
authorized target execution and proof/retest, hosted entitlement where
required, isolation qualification, independent review, and final release
acceptance. The next aligned dependency is the attack-hypothesis/planner
mapping that consumes this target manifest; it must preserve the same
execution-free and source-free boundary.

Score unchanged: **228 checked / 52 unchecked / 280 total (81.4%)**.
