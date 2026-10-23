# HUNT-009 supported recipe execution · PR #75 · 2026-10-07

## Result

CLI PR #75 (`6bde945c60ac34351c02a70f6e7a2cb24f98ae1d`) is merged. It adds
the gated supported-recipe execution command and keeps the private Hunt runtime
behind a validated fail-closed protocol boundary. The exact-head hosted checks
all passed: Ubuntu/macOS/Windows on Node 20/22/24, Verglos self-scan, and
in-toto release binding (11 checks total).

The merged source was re-run locally from the exact requalification worktree:
`pnpm test` in `packages/cli` exited 0. Focused HUNT-009 coverage passes for
exact trust/approval binding, positive execution, negative-probe
`not-reproduced`, binding drift and symlink denial, and unavailable private
runtime denial. The public runtime boundary rejects missing and malformed
private runtimes without packaging the private workspace dependency.

## Acceptance boundary

This is implementation and regression evidence, not final HUNT-009 acceptance.
HUNT-008 trusted/licensed recipe provenance and independent Hunt qualification
remain open, so no backlog checkbox changed. No external recipe was executed,
no customer repository was accessed, and no production operation occurred.

Backlog at capture: **218 checked / 62 unchecked / 280 total (77.9%)**.
