# QUAL-CLI-006 · CLI process-entry repair addendum · 2026-10-11

## Scope

This addendum records a real test-harness defect found while requalifying the
current CLI shipping worktree. Several process tests constructed the CLI entry
as the nonexistent monorepo-root `src/index.ts`; the CLI entry actually lives
at `packages/cli/src/index.ts`.

## Implementation

Commit `0ef96caab27474d3495b9d4ac0a77851059eb873` updates the shared
`packages/cli/src/cli-fixture.ts` launcher helper to canonicalize any legacy
`src/index.ts` argument to the package-local entry resolved from the helper's
module URL. Fixture paths remain unchanged, and the existing Windows path
normalization remains in force.

## Verification

- Record create/verify process tests: **11/11 passed**.
- Full QUAL-CLI-006 focused set: **34/34 passed**.
- Covered record create/verify/export, Sigstore offline validation and
  tamper/identity guards, rollback plan/rehearsal, standards corpus,
  platform-matrix contract, release checksums/SBOM, and clean-consumer
  verification.
- CLI dependency-graph Turbo typecheck/build: **12/12 successful**.
- `git diff --check`: passed.

## Acceptance boundary

This is qualification progress only. `QUAL-CLI-006` remains unchecked because
the release still lacks a trusted keyless Fulcio/Rekor identity bound to the
protected publishing pipeline, final licensing clearance, independent review,
and final release acceptance. No npm publication, Production write, database
write, provider operation, or release promotion occurred.

## Decision

Keep the checkbox open. Owner: CLI/release qualification. Next action: bind the
authorized protected release identity and obtain the remaining legal,
independent-review, and release-approval artifacts before final acceptance.
