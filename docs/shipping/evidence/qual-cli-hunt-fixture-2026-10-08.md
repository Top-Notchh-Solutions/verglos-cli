# QUAL-CLI / HUNT test-fixture qualification — 2026-10-08

## Scope

The current CLI `main` head `111d3aad9ddd89285c24aaec142aa71a72e22905` exposed a
test-harness defect in the HUNT-009 execution tests. The tests inject the
separately provisioned private Hunt runtime from `packages/hunt/dist`, but the
CLI package test task did not build that fixture. A fresh checkout therefore
returned the intentional unavailable exit `78` for two success-path tests.

PR #82 at `806f2352f0f95d023a87ef8832a5a23aa47789a1` changes only the CLI test
task: it builds `@verglos/hunt` before running CLI tests. The runtime remains
outside the public CLI dependency graph and the production loader boundary is
unchanged.

## Local verification

Fresh worktree, Node `v26.4.0`, pnpm `9.15.9`:

- `pnpm test`: 924 tests, 908 pass, 0 fail, 16 explicit skips; 12 Turbo package
  tasks successful.
- HUNT-009 focused file: 5/5 pass, including positive execution, negative
  not-reproduced projection, binding drift, symlink denial, and unavailable
  runtime denial.
- `pnpm typecheck`: pass.
- `pnpm build`: pass.
- `git diff --check`: pass.

The local license inventory was not counted as a pass in this ad-hoc worktree:
the repository's CI workflows first inject the all-supported-architectures pnpm
configuration, while this macOS-only install did not. The existing workflow
preparation is unchanged by PR #82.

## Hosted verification

PR #82 opened against CLI `main` at
`806f2352f0f95d023a87ef8832a5a23aa47789a1` and merged as
`b852c263fe5aa26f593e4f815532a7ddb6e8d9ff`. Platform matrix run
`37786406937` passed all nine Ubuntu/macOS/Windows × Node 20/22/24 cells after
the isolated Windows Node 20 MCP build runner failure was rerun. Self-scan run
`37786406760` and the in-toto release binding in `37786406937` also passed.

## Boundary and disposition

- No production database, deployment, npm publication, provider, customer, or
  external repository operation occurred.
- This is implementation/test-fixture qualification only; it does not prove
  Hunt recipe provenance, legal clearance, sandbox independent review, or
  hosted provider delivery.
- HUNT-008–011, QUAL-CLI-004, and the dependent acceptance items remain
  unchecked until their stated provenance, external-review, and acceptance
  gates are satisfied.
