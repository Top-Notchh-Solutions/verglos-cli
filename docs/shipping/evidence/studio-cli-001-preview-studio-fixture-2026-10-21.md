# STUDIO-CLI-001 Preview Studio fixture qualification · 2026-10-21

## Scope

This packet records owner-authorized, bounded Preview qualification of the Web
Studio entitlement and hosted client-projection path. It is synthetic
non-production evidence. It does not claim customer acceptance, independent
recipient review, provider payment, Production entitlement, or AppSec/Hunt
completion.

## Source and deployment

- Web implementation commit: `938dd7e feat(web): add Preview Studio entitlement fixture`.
- Follow-up correctness fix: `a3819c1 fix(web): resolve Studio workspace allowance from app db`.
- Final clean Preview deployment: `dpl_FZpAVi1Hbj8iQhpuyyvb9gUSucoe`,
  `https://verglos-j73582fkd-anuragyadav20062002s-projects.vercel.app`.
- Final deployment status: Ready. Remote build compiled successfully and
  generated **49/49** static pages. Build logs included one transient registry
  fetch retry; the build completed successfully.
- The final deployment was built from a clean detached worktree at `a3819c1`.
  The temporary migration runner used for Preview database repair was absent
  from that worktree and its two temporary deployments were removed after the
  qualification run.

## Implementation evidence

- Added a fail-closed Preview-only Studio fixture. It requires Preview
  environment, active license, the exact configured test identity, the
  explicit Studio flag, and the canonical numeric allowance (`2000`).
- Production cannot reach the fixture, and the public Studio catalog remains
  inactive/non-purchasable.
- `resolveOrganizationPlan` now joins the creator user for identity binding;
  Studio workspace allowance resolution uses the authorized application DB
  context rather than the tenant-scoped facade's root-table query.
- Focused regression run after the fix: **27/27 passed**, including fixture,
  capability, organization entitlement, and workspace admission tests.
- Typecheck and `git diff --check` passed.

## Preview database qualification

The existing Preview database had the application tables through migration
`0039`, but was missing the already-reviewed `0040_client_workspaces`,
`0041_handoff_receipts`, and `0042_private_runner_credentials` migrations.
The encrypted Vercel `DATABASE_URL` could not be pulled into a local process,
so a temporary Preview-only, auth-gated runner applied those exact migration
SQL files. It returned:

```text
0040_client_workspaces
0041_handoff_receipts
0042_private_runner_credentials
```

The helper deployments were deleted after use. No Production database was
changed.

## Hosted route observations

The qualification deployment was built from the same committed product code
as the final deployment, with only the temporary migration runner added for
database repair.

- Authenticated Preview identity: configured synthetic fixture identity; no
  secret value is recorded here.
- Organization: `bca7f024-3053-4f56-af0a-207bf0138862`, external ID
  `org_86c33589-b7dc-4237-8e78-ed2a7bb110be`.
- Project: `3919e928-b680-430c-ba43-a68eeab89263`.
- Client workspace creation returned `201` and created
  `0659d062-c87b-4d29-aa8b-b7c00962a4bb`.
- Safe client projection upload returned `201` with committed hosted usage:
  `sha256:bd991b619e5e8cf4a0ab72ca466202ff829ecbda9cb29818a268971965ff1320`.
- Projection readback returned the same digest and only safe projection fields
  (`decision`, schema/version, digests, coverage/signer status, limitation,
  organization, and workspace identifiers).
- A projection containing `source: private` was rejected with
  `400 private_field`.
- A cross-tenant projection read was rejected with `403 organization access
  denied`.
- Synthetic handoff issuance returned receipt
  `b4355d1b-4f74-440b-a7fa-2c699e359ace`; the owner-authorized Preview
  acknowledgement returned success and the hosted list read back state
  `acknowledged` with acknowledgement digest
  `sha256:95e977fece1ecd65f0db9f3e57a7b87e8bfdbf7e5884ad31f58e6bd8914845df`.
  The raw one-time acknowledgement token is intentionally not recorded.

## Acceptance boundary

This proves the implemented Preview route, entitlement guard, bounded hosted
projection, usage commit, tenant isolation, private-field rejection, and
single-use handoff acknowledgement behavior. It does not satisfy the row's
independent/customer acceptance contract: the recipient is a synthetic
`example.test` fixture controlled by the owner, not an independent customer or
external recipient. `STUDIO-CLI-001` therefore remains unchecked and the
shipping score remains **239 checked / 41 open / 280 total (85.4%)**.
