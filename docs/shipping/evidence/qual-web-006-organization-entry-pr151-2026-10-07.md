# QUAL-WEB-006 organization entry implementation — 2026-10-07

## Batch boundary

This is implementation and qualification progress for `QUAL-WEB-006`; it is
not full acceptance. The exact Web phase branch is
`feat/web-org-directory` at `07788c08d38731eae747a6e99d0b15fae017548a`.

## Change

- Added authenticated server-rendered `/orgs` directory backed by the
  actor-bound `organizationDirectoryForUser(user.id).list()` repository.
- Added active-membership organization links to slug-scoped `/home` routes.
- Added an `Organizations` link to the authenticated account navigation.
- Added source-contract tests for auth, user-bound listing, slug encoding, and
  navigation discoverability.

## Verification

- Focused organization-entry tests: **2/2 pass, 0 fail, 0 skips**.
- `pnpm typecheck`: passed.
- `pnpm db:check`: passed.
- `VERCEL_ENV=preview NODE_ENV=production pnpm build`: passed; 38 pages
  generated, including dynamic `/orgs`.
- `git diff --check`: passed.

## Hosted state and limits

PR #151: https://github.com/anuragyadav-git/verglos-web/pull/151

- Head: `07788c08d38731eae747a6e99d0b15fae017548a`.
- GitGuardian and Preview Comments: pass.
- `typecheck-and-schema`: in progress at the time of evidence capture.
- Vercel deployment: in progress at the time of evidence capture.
- No merge, deployment promotion, production/database/provider write, or
  browser mutation occurred.

This fixes the unscoped `/orgs` 404 in source and provides a discovery path,
but does not prove authenticated production rendering, human screen-reader
behavior, field CWV, or full `QUAL-WEB-006` acceptance.
