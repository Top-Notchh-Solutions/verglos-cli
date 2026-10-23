# DIST-002/003 publication archive snapshot boundary · CLI PR #170 · 2026-10-23

## Implementation

Public `verglos-cli` source commit `18d5bc29` hardens the npm publication
preflight. The publisher now validates a bounded regular archive through an
opened handle with identity and size rechecks, extracts the package manifest
from the validated bytes, and publishes a private temporary snapshot of those
same bytes. Symlinked/non-regular archives fail before registry access.

PR #170 merged normally into `main` as merge commit
`7dca4d00c7a4fd2b4288b1f6aa0a1d226806a87f`:

<https://github.com/Top-Notchh-Solutions/verglos-cli/pull/170>

## Verification

- Focused publication/workflow tests: **7 passed / 0 failed**.
- Full monorepo `pnpm exec turbo run test typecheck build --force`:
  **23/23 tasks successful**.
- Required hosted PR checks: **12/12 passed**: standard/provenance validators
  `39845246016`, self-scan `39845246187`, platform/in-toto run `39845250449`,
  and all Ubuntu/macOS/Windows Node 20/22/24 cells.
- Merge mode: normal merge commit; no squash, rebase, force push, or branch
  deletion.

## Boundary and disposition

This is substantive repository-owned implementation progress for `DIST-002` and
`DIST-003`. It does not perform npm publication, immutable attestation,
protected-environment approval, legal/license clearance, provider action,
customer/recipient acceptance, independent review, or final release sign-off.
Both backlog checkboxes are therefore unchanged. Score remains **239 checked /
41 open / 280 total (85.4%)**. No registry, provider, Production, customer,
database, deployment, or release state was changed or deleted.
