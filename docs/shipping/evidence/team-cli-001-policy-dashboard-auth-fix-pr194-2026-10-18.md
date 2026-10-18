# TEAM-CLI-001 Preview policy-dashboard auth correction — 2026-10-18

## Trigger and bounded diagnosis

The first dashboard deployment from Web PR #193 matched the policy route but
returned HTTP `500` for an unauthenticated protected Preview request. Vercel
logs identified the cause as Clerk `auth()` being called while the Preview
test-auth configuration intentionally exported a no-op middleware. No source,
secret, license bearer, browser cookie, customer data, or database write was
involved.

The shared request-auth seam was corrected so a complete Preview fixture
configuration selects the bounded Preview identity when its header is valid,
and otherwise returns an anonymous identity without calling Clerk. Production
and ordinary local Clerk configurations continue to select Clerk.

## Public source and contribution history

- Follow-up PR: [#194](https://github.com/anuragyadav-git/verglos-web/pull/194),
  assigned to `anuragyadav-git` and merged normally.
- Implementation commit: `e84643bd502458fefc679de48ccf7cb9445a873b`.
- Regression-test commit: `74a6ceac798ce183202a25d2e4c43c2a886e2ead`.
- Normal merge commit: `7e78ec8414564f313a69f83fb8789550a1f0caba`.
- No squash, rebase, force-push, empty, duplicate, or artificial commit was
  used.

## Verification

The disposable worktree recorded:

- `git diff --check` — exit 0.
- `node --import tsx --test src/lib/auth/preview-test-auth.test.ts src/lib/organizations/policy-lifecycle.test.ts` —
  **21 passed / 0 failed / 0 skipped**.
- `pnpm typecheck` — exit 0.
- `pnpm build` — exit 0; Next.js generated **47/47** pages.
- Hosted Actions run `39128474400`, job `117678523046` —
  `typecheck-and-schema` passed.
- Hosted GitGuardian and Vercel Preview Comments — passed.

## Hosted route recheck

- Corrected Preview deployment: `dpl_2Nv1PZPEX4mf6fHdDgu3Ksa4nPpT`.
- Status: `Ready`.
- URL: `https://verglos-1oh1gi4o3-anuragyadav20062002s-projects.vercel.app`.
- Read-only `vercel curl` to
  `/orgs/top-notchh-solutions/policy` returned HTTP `307` with a login
  location rather than HTTP `500`.
- `vercel logs` for the corrected deployment returned no logs/errors for the
  route check.

This proves the unauthenticated failure boundary is corrected. It does not
prove an authenticated policy row, a mapped paid entitlement, or the CLI
signed fetch/cache/offline/expiry/cross-tenant/provider matrix.

## Acceptance and score

The visible policy-digest implementation remains progress toward
`TEAM-CLI-001`; the row stays unchecked for its entitlement and live CLI/
provider evidence. `TEAM-CLI-002` and `TEAM-WEB-006` remain dependent. The
live private score remains **232 checked / 48 open / 280 total (82.9%)**.
This packet is private shipping evidence and must not be copied to a public
repository.
