# FINAL-WEB-001 public truth-registry wiring — 2026-10-17

## Public implementation

- Repository: `anuragyadav-git/verglos-web`
- Branch: `feat/final-web-001-truth-registry-20261017`
- Commit: `5ada115`
- Pull request: `https://github.com/anuragyadav-git/verglos-web/pull/177`
- Assignee: `anuragyadav-git`

The homepage plan copy now derives from the server-side entitlement catalog.
Inactive paid plans cannot render a purchasable price, the verified Pro price
is projected in INR, and the free zero-price plan is allowed without implying
checkout. Homepage claims are evaluated against a frozen public truth snapshot
and fail closed when a claim needs correction or removal. The same version and
plan projections are reused by root metadata and `/llms.txt`.

## Verification

- `pnpm test:truth-registry`: **28 passed / 0 failed / 0 skipped**
- `pnpm typecheck`: passed
- `pnpm build`: passed; **47/47** static pages generated
- `git diff --check`: passed
- Runtime note: pnpm reported the repository's Node `22.x` engine warning
  because the local environment was Node `v26.4.0`; tests, typecheck, and build
  completed successfully.

## Acceptance boundary

This is a substantive FINAL-WEB-001 implementation slice. It does not by
itself close the row: the full public claim map across all public docs/surfaces
and the row's remaining acceptance artifacts still require reconciliation.
No production deployment, publication, browser-session change, database
operation, or unrelated documentation change was made.
