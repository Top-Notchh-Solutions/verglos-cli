# QUAL-WEB-006 Preview organization-route revalidation — 2026-10-14

## Source and deployment

- Public Web contributor commit: `e555cd4b3accd569dd87549399fdfe6b6210b420`.
- Regular merge commit: `20fd975c404b72fed4590f3ec2425dcdb74ca1cc` from PR #176.
- Preview deployment: `dpl_7QutnWvsqKg1KmTU8sYDEtUkTaoE`.
- Preview URL: `https://verglos-av3b3b5gx-anuragyadav20062002s-projects.vercel.app`.
- Vercel CLI: `59.25.4`.

## Verification

The bounded Preview test identity was sent through Vercel's protected curl
path to `GET /api/v1/organizations`. The response was HTTP/2 `200`,
`cache-control: private, no-store`, with the synthetic Preview organization
projection. The request used the Vercel Preview test secret without recording
or printing its value. The short pre-existing Preview secret was replaced by a
generated 64-character Vercel Secret before the final redeploy; the temporary
local copy was deleted after verification.

The public Web change passed `pnpm typecheck`,
`pnpm test:negative-boundary`, `pnpm test:truth-registry`, and `pnpm build`.
PR checks passed typecheck/schema, GitGuardian, Vercel, and Vercel Preview
Comments. The PR was merged normally, without squashing.

## Boundary and disposition

This proves the route-level Preview synthetic-auth path for the organization
directory only. It does not prove human browser accessibility, paid or
large-data dashboard acceptance, SCM App installation, customer acceptance,
legal clearance, independent AppSec review, Production behavior, or npm
publication. `QUAL-WEB-006`, `TEAM-CLI-001`, and the AppSec-dependent Hunt
rows remain open. No score checkbox changed; current score remains
**229 checked / 51 unchecked / 280 total (81.8%)**.
