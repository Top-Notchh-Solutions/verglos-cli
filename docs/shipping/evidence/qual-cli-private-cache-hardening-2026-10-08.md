# CLI private entitlement/cache persistence hardening — 2026-10-08

## Scope

- Repository: `verglos-cli`
- Source commit: `2efbf42008e7c5c0a48bbe6f44ccf01b39d257f4`
- Pull request: #85
- Merge commit: `80fa930a8363aee103da8fa25fa37ccecffe77b0`
- Branch: `feat/cli-backend-qualification`
- Reviewed files:
  - `packages/cli/src/credentials.ts`
  - `packages/cli/src/entitlement.ts`
  - `packages/cli/src/private-cache-permissions.test.ts`

## Implementation

- Credentials, score state, and capability state now use bounded atomic
  temporary-file replacement instead of direct partial writes.
- Private JSON files are created with mode `0600`; the `.verglos` directory is
  created and corrected to mode `0700`.
- Capability invalidation removes the cache rather than leaving a partial JSON
  sentinel behind.
- Regression coverage verifies private modes and readable post-write state.

## Verification

- `pnpm --filter verglos typecheck` passed.
- `pnpm --filter verglos build` passed.
- Focused entitlement, organization-policy, and cache tests passed **34/34**.
- The complete CLI package test runner emitted passing results for every test
  file it executed, including the existing Hunt, record, process-safety,
  private-runner, and whoami suites.
- Final-head platform matrix run `37805630513` passed all nine Ubuntu/macOS/
  Windows × Node 20/22/24 cells and in-toto binding; Verglos self-scan
  `37805630213` also passed. PR #85 merged after the complete hosted result.

## Boundary and disposition

- No production, database, migration, payment, provider, deployment,
  registry, npm, customer, or release write occurred.
- The pre-existing generated `.artifacts/` directory was preserved and was not
  included in the PR.
- This strengthens the local CLI persistence/security substrate for the plan,
  entitlement, and runner tracks. It does not prove hosted signer activation,
  provider activation, independent review, legal clearance, trusted
  publishing, or customer acceptance.
- No backlog checkbox changed. Score remains **218 checked / 62 open / 280
  total (77.9%)**.
