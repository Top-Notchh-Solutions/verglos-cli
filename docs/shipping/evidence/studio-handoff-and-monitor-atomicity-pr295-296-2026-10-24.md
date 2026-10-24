# Web PR #295/#296 production implementation evidence · 2026-10-24

## Scope

This packet records two normal Web merges performed during the non-AppSec
implementation pass. It contains implementation and provider/Production
runtime evidence only. It does not claim recipient/customer acceptance,
independent review, AppSec/Hunt review, field performance, or final release
sign-off.

## Web PR #295 · monitor registration atomicity

- Implementation commit: `696533e4ad76a04b76d4f8b214e2aa720efdcb49`.
- Normal merge commit: `af53e965e07366fe2d07090b8c1fdf311a60b29e`.
- Pull request: `https://github.com/anuragyadav-git/verglos-web/pull/295`.
- Production deployment: `dpl_Gpdxuh6ybsJjmyBnYZyNHaiWbERp` at
  `verglos-a833ahsv1-anuragyadav20062002s-projects.vercel.app`, target
  `production`, state `READY`.
- Code change: monitor registration now uses a conflict-safe insert/update
  inside one transaction and rotates encrypted channel credentials in that
  same transaction. Concurrent CLI retries no longer fail the advertised
  upsert on a read-then-insert race, and a credential-rotation failure rolls
  back the registration update.
- Focused command:
  `node --import tsx --test src/lib/monitor/route-error-contract.test.ts src/lib/monitor/channel-credentials.test.ts`
  — **7/7 passed**.
- `pnpm typecheck` — passed under the workstation Node 26.4.0 warning; the
  package contract remains Node 22.x.
- `git diff --check` — passed.

## Web PR #296 · exact handoff expiry boundary

- Implementation commit: `246ec0f1c6afb79121df981c28d8134fa0e7681c`.
- Normal merge commit: `a73a479847a6b4667ac33304ccf169b43ed584d7`.
- Pull request: `https://github.com/anuragyadav-git/verglos-web/pull/296`.
- Merged-head Production deployment: `dpl_E7wmp4QBPHx1aiXuSyiYTKhqhUSm`,
  target `production`, state `READY` when rechecked after the build completed.
- Code change: one domain helper now resolves `now >= expiresAt` as expired;
  handoff listing and revocation use the same boundary as acknowledgement.
  An issued handoff cannot appear live or be revoked at the exact expiry
  instant.
- Focused command:
  `node --import tsx --test src/lib/organizations/handoff-receipt.test.ts src/lib/organizations/handoff-route-contract.test.ts src/lib/organizations/handoff-page-contract.test.ts`
  — **33/33 passed**, including the exact-expiry regression.
- `pnpm typecheck` — passed under the workstation Node 26.4.0 warning; the
  package contract remains Node 22.x.
- `git diff --check` — passed.

## Ready Production matrix for the preceding merged head

The Ready PR #295 deployment above was checked read-only with `redirect:
manual` for `/`, `/proof`, `/checkout`, `/llms.txt`, `/robots.txt`, and
`/sitemap.xml`:

- `https://verglos.com`: **6/6 HTTP 200**.
- `https://www.verglos.com`: **6/6 HTTP 308** to the canonical host.
- Exact Vercel deployment hostname: **6/6 HTTP 302** to Vercel SSO; no
  protection bypass was attempted.

The merged-head PR #296 Production deployment was then checked with the same
read-only `redirect: manual` matrix:

- `https://verglos.com`: **6/6 HTTP 200**.
- `https://www.verglos.com`: **6/6 HTTP 308** to the canonical host.
- Exact Vercel deployment hostname: **6/6 HTTP 302** to Vercel SSO; no
  protection bypass was attempted.

## Hosted budget and acceptance boundary

GitHub Actions runs for these PRs failed at the account's blocked `$0`
Actions budget/runners before repository qualification steps. They were not
rerun. Vercel deployment is separate provider state and was observed without
customer-data or database mutation.

`STUDIO-CLI-001` remains unchecked: its implementation is materially advanced,
but authorized recipient acknowledgement, independent review, and final
release acceptance are still absent. The shipping score remains **246 checked
/ 34 open / 280 total (87.9%)**, split **13 AppSec-dependent / 21 non-AppSec**.
No file, branch, database row, customer record, provider account, or release
artifact was deleted or overwritten.
