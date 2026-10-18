# TEAM-CLI-001 Preview policy provisioning and provider-boundary recheck — 2026-10-18

## Scope and privacy boundary

This packet records a real, isolated Preview qualification attempt for the
hosted CLI entitlement and policy path. It uses only the existing authorized
owner session and the protected Vercel CLI request path. It does not modify
Production, create billing state, or record a secret, license bearer, private
key, customer source, or browser credential.

No new Chrome window or tab was opened. The old archive repository was not
used; the active repositories are `verglos-web` and `verglos-cli`.

## Implementation and deployment context

- Web PR #195, `Bound GitHub App provider requests`, merged normally with
  merge commit `8362bba7529ff888c6c3742638078845d6c97f91`.
- PR checks passed: Vercel, Vercel Preview Comments, GitGuardian Security
  Checks, and `typecheck-and-schema`.
- The change adds a bounded ten-second timeout to each GitHub App provider
  request and tests that provider calls receive an abort signal.
- The protected Preview qualification deployment was rebuilt after the
  merge and reached `Ready`: deployment `dpl_4eTQjNJUwjuU2PM9S8hg8GWTdXDX`,
  URL `https://verglos-dworgdr9d-anuragyadav20062002s-projects.vercel.app`.
- The deployment completed a production build with **47/47** generated
  pages. The protected `vercel curl` checks below targeted this deployment.

## Fixture organization, project, and policy

The protected Preview test identity exposed only the isolated fixture
organization:

- organization ID: `bca7f024-3053-4f56-af0a-207bf0138862`
- organization name: `Private runner qualification 2026-10-18`
- role: `owner`
- project ID: `3919e928-b680-430c-ba43-a68eeab89263`
- project external ID: `preview-team-qualification-20261018`
- project name: `Preview team qualification`
- environment: `qualification`
- repository URL: `https://github.com/Top-Notchh-Solutions/verglos-cli`
- project status: `active`

The policy was created and published through the protected organization API:

- policy row ID: `c8be1992-0225-4b8f-a730-cc59a641fbf8`
- policy ID: `verglos.policy.team-qualification-20261018`
- version: `1.0.0`
- status: `published`
- digest algorithm: `canonical-json-v1`
- digest: `sha256:055bd90bca9822faa7219224aeba42ed4c201ab9ed81df9ca9efa167a9ad8a02`
- effective time: `2026-10-18T15:00:00.000Z`

The digest was calculated from the bounded policy document by the Web
repository's `canonicalPolicyDocumentDigest` implementation. The document
requires a critical finding check, owner approval, complete coverage, current
freshness, and artifact matching; it does not contain a customer policy
document in this private packet.

## Entitlement and provider observations

- The device-code flow produced a bounded authorization result with plan
  `founder` and `has_license_key: true`; the license value was not recorded.
- The fixture organization remained isolated from the real organization. A
  cross-tenant project request returned HTTP `403 organization access denied`.
- The corrected public repository ID for
  `Top-Notchh-Solutions/verglos-cli` is `1310272752`.
- The installed organization GitHub App installation is `172686102`.
- A protected SCM installation request using the exact repository binding
  (`installationId` and `repositoryId` supplied as the required decimal JSON
  strings) returned the bounded response `GitHub App installation exchange
  unavailable` with zero stored installations.
- A follow-up read returned `count: 0`; no provider token or installation
  credential was persisted by the qualification attempt.

The provider result is an infrastructure/provider-availability observation,
not a successful provider-delivery result. The new Web implementation now
places a ten-second upper bound on each GitHub App request and the merged
tests cover the abort-signal contract.

## Acceptance disposition

This packet advances the Preview policy and project substrate but does **not**
check `TEAM-CLI-001`. The row still requires a valid mapped paid or approved
non-production entitlement plus authenticated CLI signed-envelope fetch,
visible digest, atomic cache, offline-TTL, expiry, cross-tenant denial, and
reconciliation/provider-delivery evidence against that exact live binding.

`TEAM-CLI-002` and `TEAM-WEB-006` remain dependent. `HUNT-008` through
`HUNT-011`, `QUAL-CLI-004`, and downstream AppSec-dependent rows remain held
for the independent Hunt/AppSec report. No backlog checkbox changed.

## Score and artifact status

The live private backlog remains **232 checked / 48 open / 280 total
(82.9%)**. This packet is private shipping evidence and must not be copied to
`verglos-web`, `verglos-cli`, or the old archive repository.
