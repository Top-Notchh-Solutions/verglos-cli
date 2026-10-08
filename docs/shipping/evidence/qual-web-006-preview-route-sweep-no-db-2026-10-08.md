# QUAL-WEB-006 · keyless Preview route sweep and public receipt fallback · 2026-10-08

## Scope

- Repository: `verglos-web`
- Web PR #168 source commit: `fb40f89`
- Merged Web `main` commit: `cedf199855a5c4734122ae4849253156328cff1b`
- Hosted verification workflow: `37804005137`, job `113403373006`
- Built runtime: Next.js `15.5.25`, `VERCEL_ENV=preview`, no database,
  Clerk, payment, or provider credentials

## Finding and repair

A comprehensive built-route sweep found that the public receipt JSON route
returned HTTP 500 when Preview had no `DATABASE_URL`; the exception was the
expected local configuration absence, but the response was not bounded for a
database-less Preview. PR #168 catches only that exact missing-configuration
case and returns HTTP 503 with `Cache-Control: no-store`. Other database errors
still propagate as real server failures.

## Verification

- Focused receipt tests: **10 passed / 0 failed**.
- `pnpm typecheck`: passed.
- `VERCEL_ENV=preview pnpm build`: passed; 45 routes generated.
- Runtime `/api/v1/receipts/receipt-preview-no-db`: HTTP **503**.
- Comprehensive manifest-driven keyless route sweep: no unexpected HTTP 500s;
  the only remaining 500 responses were the three cron endpoints' existing
  explicit service-unavailable responses when `CRON_SECRET` is absent.
- Hosted workflow `37804005137` passed typecheck/schema, serial,
  private-runner E2E, negative-boundary, truth-registry, migration/schema,
  build, public-boundary, dependency/SBOM/license, tracked-secret, and upload
  checks. GitGuardian and Vercel checks passed.

## Boundary and disposition

No production, database, migration, payment, provider, entitlement, account,
or deployment write occurred. This strengthens `QUAL-WEB-006` and the
database-less Preview runtime contract but does not close a backlog checkbox.
Authenticated/field qualification, payment lifecycle, production
reconciliation, and final truth gates remain open. Backlog remains **218
checked / 62 unchecked / 280 total (77.9%)**.
