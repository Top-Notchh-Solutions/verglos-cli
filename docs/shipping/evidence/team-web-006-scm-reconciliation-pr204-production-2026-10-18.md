# TEAM-WEB-006 SCM repository-scope reconciliation — 2026-10-18

## Scope

This evidence records the owner-authorized production cutover for the
organization GitHub App installation and the corresponding bounded dashboard
projection. It does not claim provider check delivery, retry qualification,
customer acceptance, or AppSec approval.

## Code and hosted verification

- Repository: `anuragyadav-git/verglos-web`
- Pull request: #204, merged normally; no squash merge.
- Merge commit: `a32f1589cd11c0f1b7fb6f0d12b2268ed8aec9b8`
- Preserved source commits:
  - `35e22c52d65b16531349fff58931b1400851f474` — reconciliation implementation
  - `bf087e2716fd677bd89f73b1257b3871fe9f4038` — transactional audit-write fix
  - `24865d9511f8cdab79854e62d05e2d82ac25dbed` — reconciliation regression tests
  - `f9bbcff521713710d1ed83e3cc7844b070620b9f` — scoped transaction boundary fix
- Local verification: `pnpm typecheck`; focused reconciliation, SCM route
  contract, and tenant-scope tests **26/26**; `git diff --check` passed.
- Hosted verification: protected `typecheck-and-schema`, Vercel, Vercel Preview
  Comments, and GitGuardian checks passed.

The implementation is tenant-scoped, approval-gated, provider-identity-bound,
transactional, and returns only bounded reconciliation counts. The scoped
database transaction facade prevents the route from obtaining an unscoped
database client.

## Production deployment

- Deployed exact `origin/main` commit `a32f1589cd11c0f1b7fb6f0d12b2268ed8aec9b8`.
- Vercel deployment: `dpl_7vfLaPXRcjVPkRUVNKAazS8qBbtH`
- Ready deployment URL:
  `https://verglos-r24e5r3jq-anuragyadav20062002s-projects.vercel.app`
- Production alias: `https://verglos.com`
- Build completed successfully and the deployment reached `READY`.

## Owner-authorized production observations

The existing authenticated owner session was used. No secret, token, private
key, webhook payload, or customer source was read or recorded.

1. The qualification project
   `821854d4-afe0-414b-a630-28bfecb064f2` was updated with the working
   repository URL `https://github.com/Top-Notchh-Solutions/verglos-cli`.
   The bounded API response was HTTP 200 and returned the project identity and
   repository URL only.
2. The GitHub installation `172686102` was reconciled against the provider
   grant with repository `1310272752` bound to that project. The bounded API
   response was HTTP 200:
   `createdCount=1`, `refreshedCount=0`, `revokedCount=1`, `activeCount=1`.
3. The post-reconciliation organization API returned one active binding:
   `Top-Notchh-Solutions/verglos-cli`, repository ID `1310272752`, installation
   `172686102`, project ID
   `821854d4-afe0-414b-a630-28bfecb064f2`. The stale
   `Top-Notchh-Solutions/verglos-archive` binding, repository ID `1305731597`,
   is explicitly `revoked` and is not active.
4. The production `/orgs/top-notchh-solutions/scm` page rendered the active
   CLI binding and the revoked archive record. It rendered bounded identity,
   lifecycle, project, and expiry fields only; secret/token fields and raw
   provider payloads were not rendered.

## Disposition

This closes the implementation and live cutover portion of SCM repository-scope
reconciliation, but it does not close `TEAM-WEB-006` or `GITHUB-WEB-001` as a
whole. Provider check delivery, retry behavior, delivery evidence, and final
acceptance remain separate requirements. No AppSec state changed. The private
ledger score remains **232 checked / 48 open / 280 total (82.9%)**.

