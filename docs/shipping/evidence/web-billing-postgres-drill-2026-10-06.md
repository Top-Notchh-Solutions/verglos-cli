# Web billing PostgreSQL drill — 2026-10-06

An isolated disposable Docker PostgreSQL 15.17 database (`verglos_test`) was
started locally to promote the two billing integration tests from skips. The
repository migration command was run with the explicit localhost test URL.

The migration failed before creating application tables because migration
`0000_rename_sentinel_to_pro` assumes a pre-existing legacy `licenses` table.
The disposable database was then removed. No production database, hosted
environment, or user data was touched.

This confirms the known migration-baseline blocker rather than proving billing
integration. The focused suite therefore remains 18 passed / 2 skipped, and
the PostgreSQL-backed lifecycle evidence is still absent pending an explicitly
prepared isolated migrated fixture or hosted CI database service.
