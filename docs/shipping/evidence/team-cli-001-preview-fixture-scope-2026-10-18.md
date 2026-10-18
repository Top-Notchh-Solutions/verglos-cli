# TEAM-CLI-001 isolated Preview fixture scope qualification — 2026-10-18

## Scope and privacy boundary

This packet records a real, isolated Preview qualification attempt for
`TEAM-CLI-001`. It does not claim a signed policy fetch, does not alter
Production, and does not create billing, provider, customer, or database
evidence for the production organization. No secret value, license bearer,
private key, customer source, or browser cookie is recorded.

## Source and deployment

- Web source reviewed: `f8b420e012b69c9d8b6052c9da16c1633582b4c7`.
- Preview deployment: `dpl_GKL8suKuzpUNBXnCf275vHfw4AGE`.
- Preview URL: `https://verglos-bgsd8ht2m-anuragyadav20062002s-projects.vercel.app`.
- Vercel target/status: `preview`, `Ready`.
- Build: 47/47 generated pages; Vercel reported a 1m02s build.
- A fresh hidden Preview test-auth secret was rotated through the Vercel CLI;
  its value was never printed or stored in this repository.

## Hosted observations

The Preview-only test-auth header was used only through the Vercel CLI against
the isolated deployment:

- `GET /api/v1/organizations` returned HTTP 200 and exposed only the fixture
  organization `Private runner qualification 2026-10-18`, whose database
  organization ID was `bca7f024-3053-4f56-af0a-207bf0138862` and whose role was
  `owner`.
- `GET /api/v1/organizations/46e61879-83e8-45ab-896c-5f61910bcabb/projects`
  returned HTTP 403 `organization access denied` for the real production
  organization.
- `GET /api/v1/organizations/46e61879-83e8-45ab-896c-5f61910bcabb/projects/821854d4-afe0-414b-a630-28bfecb064f2/policies`
  returned HTTP 403 `organization access denied` rather than crossing tenant
  boundaries.
- `GET /api/v1/organizations/bca7f024-3053-4f56-af0a-207bf0138862/projects`
  returned HTTP 200 with an empty project list.
- The isolated fixture therefore had no project/policy to sign or fetch. The
  existing founder license status was separately valid on Production, but the
  production policy route returned HTTP 404 `policy unavailable` because the
  license was not mapped to the requested organization/repository policy
  binding. No bypass was attempted.

## Existing-browser boundary

The already-open Verglos owner tab (page 3) was temporarily navigated to the
Preview checkout with the hidden test-auth header held in memory. Vercel
Protection redirected it to the Vercel login page; no sign-in or checkout
action was performed. The header was cleared and the same tab was restored to
`https://verglos.com/account`. No new Chrome window or tab was opened and no
provider, payment, or account state changed.

## Acceptance disposition

This packet proves an isolated Preview fixture boundary and fail-closed
tenant authorization only. It does **not** close `TEAM-CLI-001`. The missing
artifacts remain:

1. a valid license bearer mapped to the exact organization owner and bound
   repository in the qualification deployment; and
2. authenticated CLI signed-envelope fetch, visible digest, atomic cache,
   offline-TTL, expiry, cross-tenant denial, and reconciliation evidence
   against that live binding.

The safe next action is to use an already authorized paid/non-production
fixture or an approved isolated Test Mode entitlement path, then run the CLI
remote/cache/offline/cross-tenant matrix. Do not modify Production or bypass
the license and organization checks. `TEAM-CLI-002` and `TEAM-WEB-006` remain
dependent; this boundary is unrelated to the held Hunt AppSec gate.

## Score and artifact status

The live private backlog remains **232 checked / 48 open / 280 total
(82.9%)**. No checkbox changed. This packet is private shipping evidence and
must not be copied to a public repository.
