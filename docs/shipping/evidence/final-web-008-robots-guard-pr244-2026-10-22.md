# FINAL-WEB-008 `/reports` crawler-protection guard · 2026-10-22

## Scope

This packet records the code-side implementation and merged-head verification
for the final public route-index boundary. It does not represent customer
acceptance, founder truth-freeze, legal approval, provider action, field
performance, independent review, or final release sign-off.

## Public implementation

- Web source commit: `bb39370` (`test(web): guard private report robots rule`).
- Follow-up dependency commit: `8a3c3af`
  (`fix(web): patch Next.js security release`).
- Pull request: Web PR #244, merged normally with source branch preserved:
  `https://github.com/anuragyadav-git/verglos-web/pull/244`.
- Merge commit: `8ece40eca79586c75a301751edf9c6b473ff295d` on `origin/main`.
- `scripts/public-release-smoke.ts` now requires `/reports` in the
  `src/app/robots.ts` private-route protection tokens.
- `scripts/public-release-smoke.test.ts` now removes that token in a temporary
  source copy and proves the audit rejects the weakened robots contract.
- Next.js was updated from `15.5.25` to patched `15.5.28` so the hosted
  high-severity dependency gate is not left on the reported vulnerable range.

## Verification

Exact merged-head worktree:
`/private/tmp/verglos-web-public-proof-merged-244-20261022` at
`8ece40eca79586c75a301751edf9c6b473ff295d`.

- `node --import tsx --test scripts/public-release-smoke.test.ts`: **7/7**.
- `pnpm public:release-smoke`: **18 routes / 22 claims / 2 proof assets /
  0 issues**.
- `pnpm typecheck`: passed.
- `pnpm audit --audit-level=high`: exit **0**; two moderate advisories remain,
  with no high or critical advisory reported by this gate.
- Hosted type/schema run `39824724431`: passed.
- Hosted isolated PostgreSQL/protocol matrix run `39824724418`: PostgreSQL,
  macOS, Ubuntu, and Windows passed.
- Hosted Vercel deployment `N2SRCKNk4RgPNtMjf1Hz6Gy1Vtcj`: completed.
- Vercel Preview Comments and GitGuardian: passed.

## Boundary and disposition

No secrets were recorded or exposed. No customer, provider, Production,
database, migration, entitlement, publication, or release-sign-off operation
was performed. No file, branch, or deployment was deleted. The test mutation
uses a temporary source copy only and does not alter the checked-out source.

`FINAL-WEB-008` remains unchecked. Its remaining contract dependencies are
ACCEPT-003/009/010, founder truth-freeze, and final acceptance. The live
backlog score remains **239 checked / 41 open / 280 total (85.4%)**.
