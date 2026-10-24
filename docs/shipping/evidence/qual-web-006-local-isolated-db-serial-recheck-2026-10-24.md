# QUAL-WEB-006 local isolated-database serial recheck — 2026-10-24

## Result

The current Web implementation tree passed the complete serial suite against a
fresh, isolated local PostgreSQL database:

- **928 tests total**
- **926 passed**
- **0 failed**
- **0 cancelled**
- **2 designed database skips** (the serial harness intentionally leaves the
  separately gated `BILLING_TEST_DATABASE_URL` migrated-baseline test out of
  this fresh `TEST_DATABASE_URL` database)
- **14,035 ms** test duration

The run exited `0` and was executed with `pnpm test:serial` from the Web
worktree. The repository's Node 22 engine warning was retained because the
workstation runtime is Node `v26.4.0` with pnpm `10.34.5`.

## Bound source and database

- Web source tested: `705a85e2b7b9d847a85748463aa0d797c60b384f`
- The tested tree is content-equivalent to Web `origin/main`
  `cb266b83406bbfffbd5ab02189556e60973a63a6` at capture time.
- Database: fresh local PostgreSQL `16-alpine`, database `verglos_test`,
  bound to loopback port `55441`.
- Container: `verglos-shipping-test-20261024`.
- No remote database URL, production database, customer repository, payment
  provider, Vercel deployment, package registry, or GitHub Actions runner was
  used or changed.

The database was created solely for this run. The test command used a
process-local `TEST_DATABASE_URL`; the password and any environment-file
contents are intentionally not recorded.

## Acceptance boundary

This is local implementation and database-backed regression evidence for
`QUAL-WEB-005`, `QUAL-WEB-006`, and the related non-AppSec candidate surfaces.
It does not create or substitute for:

- human screen-reader or field Core Web Vitals evidence;
- authorized customer/recipient or commercial acceptance;
- provider publication, Production deletion, or external lifecycle receipts;
- independent review, AppSec/Hunt review, or final release/go-no-go sign-off.

No backlog checkbox is changed by this recheck. No file, branch, database
record outside the disposable local test database, customer data, package,
tag, release, or deployment was deleted or overwritten.
