# STUDIO-CLI-001 Preview allowance requalification — 2026-10-19

## Scope

This is a fresh owner-authorized, Preview-only qualification of the current
hosted Web custody boundary. It does not qualify Production, change a
license, write a customer record, or change AppSec/Hunt status.

- Web source commit: `390fd3f82b2a59003e30e2362ab593ef1db4b982`
- Preview deployment: `verglos-nwk48v7ww-anuragyadav20062002s-projects.vercel.app`
- Deployment inspect identifier: `56a1dDZnB81oMqpYJWtndLC1PEYN`
- Qualification organization: `bca7f024-3053-4f56-af0a-207bf0138862`
- Qualification project: `3919e928-b680-430c-ba43-a68eeab89263`
- Repository binding: `Top-Notchh-Solutions/verglos-cli`

The disposable worktree was linked with the Vercel CLI and deployed as
Preview. A temporary local environment file created by the CLI was removed
after the run. No credential, token, or secret value is included here.

## Observations

Using the existing owner-authorized Preview test-auth mechanism through the
Vercel CLI:

1. `GET /api/v1/organizations` returned the qualification organization with
   role `owner`.
2. `GET /api/v1/entitlement/capabilities` returned `plan=free`,
   `real_plan=free`, `active=true`, and the catalog version `2026-10-02.0`.
   The active free allowance is `recordsPerMonth=unset`; the catalog’s
   inactive Studio row advertises `2000`, but that inactive catalog value was
   not treated as an entitlement.
3. `GET /api/v1/organizations/<org>/projects` returned the active,
   repository-bound Preview qualification project.
4. `GET /api/v1/organizations/<org>/projects/<project>/receipts` returned
   HTTP `200` with an empty receipt list.
5. A schema-valid redacted receipt projection was submitted to the exact
   organization/project route. The route returned HTTP `403` with
   `hosted record allowance is not configured` before persistence.
6. A read using a different organization identifier returned HTTP `403` with
   `organization access denied`.

No receipt was admitted and no hosted database write occurred. The result
demonstrates the intended fail-closed behavior for an unentitled Preview
fixture; it is not a Studio entitlement or recipient-acceptance result.

## Disposition

`STUDIO-CLI-001` remains unchecked. The implementation and tenant-bound
route are qualified, but closure still requires an approved numeric paid,
non-production allowance (Pro or Studio as applicable) and an authorized
Studio recipient/customer acceptance observation showing only the approved
redacted projection is received.

TEAM-CLI-001 remains checked. AppSec/Hunt rows were not changed. The ledger
score remains **235 checked / 45 open / 280 total (83.9%)**.
