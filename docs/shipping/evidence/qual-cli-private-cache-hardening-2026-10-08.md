# CLI private entitlement/cache persistence hardening — 2026-10-08

## Scope

- Repository: `verglos-cli`
- Source commit: `ecc6a3ae848ad2c900565acac49243eb0c0f2d83`
- Pull request: #85
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
- Hosted in-toto binding passed in run `37805219794`.
- Hosted platform matrix and Verglos scan were pending at capture time:
  `37805219794` and `37805219844`.

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
