# QUAL-WEB-005/006 dual-database serial recheck — 2026-10-24

## Result

The current merged Web candidate was exercised with the two local database
fixtures its integration tests require:

- **Full serial suite:** 928 tests, **927 passed**, **0 failed**, **0
  cancelled**, **1 designed skip**, exit `0`, duration **13,854 ms**.
- **Billing migrated-baseline integration:** **1/1 passed**, 0 skipped.
- **Account-deletion migrated-baseline integration:** **1/1 passed**, 0
  skipped.

The one serial-suite skip is the account-deletion test's intentional guard: the
general serial database is deliberately fresh and does not contain the reviewed
application migration tables. The same account-deletion test passes when run
against the separately migrated local fixture, so this is a fixture-boundary
skip, not a product failure.

## Bound source and fixtures

- Web source tested: `705a85e2b7b9d847a85748463aa0d797c60b384f`.
- The tested tree is content-equivalent to merged Web `origin/main`
  `cb266b83406bbfffbd5ab02189556e60973a63a6`.
- General serial fixture: fresh local PostgreSQL 16 `verglos_test` on loopback
  port `55441` (`TEST_DATABASE_URL`).
- Migrated baseline fixture: local PostgreSQL 16 `verglos_test` on loopback
  port `55440` (`BILLING_TEST_DATABASE_URL` and the focused account-deletion
  run).
- Workstation runtime: Node `v26.4.0`, pnpm `10.34.5`; the repository's Node
  22 engine warning remains recorded.

No remote or Production database was used. The focused integration tests use
owner-controlled synthetic fixtures and clean their own test identities. No
customer repository, payment provider, Vercel deployment, package registry,
GitHub Actions runner, tag, or release was changed.

## Acceptance boundary

This is local, database-backed implementation evidence for `QUAL-WEB-005`,
`QUAL-WEB-006`, and the account-deletion contract. It does not create or
substitute for hosted Production deletion, human screen-reader or field-CWV
evidence, customer/recipient or commercial acceptance, provider publication,
independent review, AppSec/Hunt review, or final release/go-no-go sign-off.

No backlog checkbox is changed by this recheck.
