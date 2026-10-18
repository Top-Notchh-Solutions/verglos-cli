# TEAM-WEB-006 SCM dashboard implementation — 2026-10-18

## Public source and merge

- Repository: `anuragyadav-git/verglos-web`
- Pull request: [#203](https://github.com/anuragyadav-git/verglos-web/pull/203)
- Normal merge: `5ee6fb281c5107d650aada2d04d0eb3b06fd5682`
- Implementation: `2db69edfc61270d5fb9373000ceb7e7021479d2b`
- Regression test: `d154a65d2396f85c589e87ec1f8e9af0bea6f35c`
- No squash, rebase, force-push, empty, or documentation-only commit was
  used.

## Implementation

The organization dashboard now exposes `/orgs/[organizationSlug]/scm`, a
read-only tenant-scoped SCM installation projection. It renders provider and
immutable account/repository identity, project binding, lifecycle status,
token-expiry metadata, and reauthorization metadata. The query explicitly
excludes encrypted webhook/provider token fields and raw provider payloads;
the organization navigation exposes the route as `SCM`.

## Verification actually run

- `pnpm test:dashboard-scm` — **1/1 passed**.
- `pnpm typecheck` — passed.
- `pnpm build` — passed; `/orgs/[organizationSlug]/scm` compiled as a dynamic
  route.
- `git diff --check` — passed.
- Hosted `typecheck-and-schema` — passed in 2m56s.
- Vercel — passed.
- Vercel Preview Comments — passed.
- GitGuardian Security Checks — passed.

## Disposition

This is implementation progress supporting `TEAM-WEB-006` and
`GITHUB-WEB-001`; it does not prove a provider check was delivered, retried,
reconciled, or accepted. Those rows remain unchecked. No AppSec state changed.
The private backlog score remains **232 checked / 48 open / 280 total
(82.9%)**.

