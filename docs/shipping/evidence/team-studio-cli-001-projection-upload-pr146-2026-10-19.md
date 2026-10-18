# TEAM-CLI-001 / STUDIO-CLI-001 implementation evidence — PR #146

Date: 2026-10-19

Public repository: `Top-Notchh-Solutions/verglos-cli`

Pull request: `https://github.com/Top-Notchh-Solutions/verglos-cli/pull/146`

Normal merge commit: `2f27f71cca38e7f95f67ac682e1f38c2e203fbc4`

Substantive commits preserved without squash:

- implementation: `a55c1c661d28b7c8861b57c7555b680a4fb6ff9d`
- regression test: `ae40cdb4659766bd4193ac5ab760b8bbaf94f4e1`

## Change

The Studio projection upload client now binds every request to the exact
organization/project route. Caller-supplied endpoints cannot widen the route
with query strings, fragments, backslashes, control characters, or an
alternate path. Response record identifiers are bounded and reject control
characters and unsafe values before they are returned to callers.

This is implementation hardening only. It does not claim hosted entitlement,
provider delivery, reconciliation, numeric paid/non-production allowance, or
authorized customer acceptance.

## Verification

- Workspace build: 8/8 packages passed.
- Focused Studio projection upload tests: 6/6 passed.
- CLI typecheck: passed.
- Full CLI test command completed without reported failures; the existing A2
  Docker target qualification remained an expected skip when its explicit
  integration flag was not enabled.
- `git diff --check`: passed.
- Protected PR checks: 12/12 successful, including standard/provenance,
  self-scan, in-toto, and Ubuntu/macOS/Windows Node 20/22/24 matrices.

## Shipping disposition

No backlog checkbox changed. `TEAM-CLI-001`, `TEAM-CLI-002`, and
`STUDIO-CLI-001` remain open for their external entitlement, hosted/provider,
reconciliation, and acceptance contracts. AppSec/Hunt state is unchanged.

Score remains **232 checked / 48 open / 280 total (82.9%)**.
