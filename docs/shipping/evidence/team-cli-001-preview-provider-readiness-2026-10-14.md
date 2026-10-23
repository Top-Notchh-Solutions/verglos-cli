# TEAM-CLI-001 Preview provider-readiness audit — 2026-10-14

## Scope

This is a read-only audit of the remaining hosted provider prerequisite for
`TEAM-CLI-001`, using the exact Web merge head
`a54d70dfacfaf9506b1336b788d9cd86c9ca74d7` and the linked Vercel Preview
project. It does not create a GitHub App, install an App, write a database
row, publish a policy, or change Production.

## Commands and versions

- Vercel CLI `59.25.4`, identity `anuragyadav20062002`;
- Node `v26.4.0`, pnpm `9.15.9`, GitHub CLI `2.89.0`;
- `vercel env ls --json`, projected only environment-key names and targets;
- `gh api orgs/Top-Notchh-Solutions/installations`;
- `gh api repos/Top-Notchh-Solutions/verglos-web`, projected repository metadata
  only.

## Results

- Preview contains the organization-policy signer variables
  `VERGLOS_ORGANIZATION_POLICY_PRIVATE_KEY`,
  `VERGLOS_ORGANIZATION_POLICY_SIGNER_ID`, and
  `VERGLOS_ORGANIZATION_POLICY_ISSUER`, plus the bounded Preview test-auth
  fixture variables. No values were printed or recorded.
- Preview contains no `VERGLOS_GITHUB_APP_ID`,
  `VERGLOS_GITHUB_APP_PRIVATE_KEY`, or
  `VERGLOS_GITHUB_WEBHOOK_SECRET` environment key.
- The Top Notchh Solutions GitHub organization installations are only:
  `vercel` installation `135902108` and `neon-postgres` installation
  `161075107`. No dedicated Verglos GitHub SCM App is installed.
- `Top-Notchh-Solutions/verglos-web` exists as a private repository. No source,
  credentials, cookies, or private deployment bypass was exposed.

## Acceptance mapping

The Web installation route requires the server-held GitHub App ID, private key,
and webhook secret before it can exchange an installation ID for a
provider-authoritative installation token and repository projection. The
repository-policy route then requires one active GitHub installation with a
bound project, one effective published canonical policy, an active mapped
license, and the configured Preview signer before it can return a signed
envelope. The existing code-side route contracts remain qualified; this audit
does not provide those hosted rows or the authenticated CLI
fetch/cache/offline/cross-tenant trace.

## Disposition

`TEAM-CLI-001` remains unchecked and the score remains **228 checked / 52
unchecked / 280 total (81.4%)**. The next safe action is to create or select a
dedicated least-privilege GitHub App, install it only on one authorized
non-Production repository, configure its three server-held Preview secrets,
and then run the bounded Preview installation, policy publication, and signed
CLI fetch/cache/offline/cross-tenant qualification. Until that happens, no
provider installation, policy row, or live signed fetch may be claimed.

No browser tab was navigated or opened. No public repository, Vercel
Production, GitHub installation, database, payment, entitlement, npm, or
customer state changed.
