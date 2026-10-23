# QUAL-WEB-006 · keyless Preview auth-consumer qualification · 2026-10-08

## Scope

- Repository: `verglos-web`
- Web PR #167 source commit: `12bfe68`
- Merged Web `main` commit: `9841236c64a816fc90402cd90ff2bc93ce35382c`
- Hosted verification workflow: `37803193381`, job `113400501492`
- Runtime: Next.js `15.5.25`, Node `v26.4.0` locally; the repository declares
  Node 22.x and the local version mismatch is retained as a limitation
- Built server: `next start --port 3012` with `VERCEL_ENV=preview` and no
  Clerk, payment, database, or provider credentials
- Browser: Chrome DevTools page 11, local Preview only

## Defect and repair

After PR #166 correctly bypassed Clerk middleware when Preview had no
publishable key, direct `auth()`/`currentUser()` consumers still invoked Clerk
and returned HTTP 500 on `/activate`, `/cli-auth`, `/account`, and `/orgs`.
The same unsafe direct-consumer pattern existed in report loading, organization
guards, and related authenticated API routes.

PR #167 routes those consumers through `src/lib/auth/request-context.ts`.
When no Preview/local Clerk key or explicit test identity exists, the seam now
returns an anonymous request (`userId: null`) and no current user. When Clerk
configuration exists, production behavior still calls Clerk. Production runtime
configuration remains fail-closed for missing required auth configuration.

## Verification

- Focused route/auth contracts: **9 passed / 0 failed**.
- `pnpm typecheck`: passed.
- `VERCEL_ENV=preview pnpm build`: passed; 45 routes generated.
- Full serial suite: **862 passed / 24 explicit environment-gated skips / 0
  failed** across 886 tests.
- Built keyless route sweep: `/activate`, `/cli-auth`, `/account`, `/orgs`, and
  a report URL now return the expected login redirect rather than HTTP 500.
  Protected APIs fail closed: unauthenticated status routes return 401 and
  unsupported methods return 405; no protected route reached a database or
  provider side effect.
- Chrome DevTools rendered the redirected login surface for each former 500
  route and reported no console messages, warnings, or errors.
- Hosted workflow `37803193381` passed typecheck/schema, serial tests,
  private-runner E2E, negative-boundary, truth-registry, migration/schema
  checks, build, public-boundary, dependency/SBOM/license checks, tracked
  secret guard, and artifact upload.
- Hosted GitGuardian, Vercel Preview, and Vercel deployment checks passed.

## Boundary and disposition

No production, database, migration, payment, provider, entitlement, account,
or deployment write occurred. This repairs a concrete keyless Preview runtime
defect and strengthens `QUAL-WEB-006`; it does not close that backlog item.
Human screen-reader testing, authenticated paid/org data, large-data behavior,
complete route coverage, field/CrUX evidence, payment lifecycle evidence,
production reconciliation, and final public-truth work remain open. Backlog
remains **218 checked / 62 unchecked / 280 total (77.9%)**.
