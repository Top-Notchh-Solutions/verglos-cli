# QUAL-WEB-005 current-head privacy/deletion full suite · 2026-10-24

## Exact source and isolated execution

- **Web merged source:** `257e1cc8e0b467d16966433033589111f62f56f0` on
  `origin/main`; the tested branch head was `7307ae5e0cea18e6d0803aa179fafcc2a0ce36f8`,
  contained in that merge.
- **Runtime:** macOS arm64, Node `v26.4.0`.
- **Database:** disposable local PostgreSQL `verglos_test` fixture on
  `127.0.0.1:55440`; both `TEST_DATABASE_URL` and
  `ACCOUNT_DELETION_TEST_DATABASE_URL` were explicitly bound to this isolated
  database. No remote `.env.test.local` database was used.
- **Command:** `node --import tsx --test --test-concurrency=1` with the
  account-deletion holds, inventory, store, worker, job-integration, route
  contract/integration, customer-held-digest contract, and privacy-page tests.

The focused suite passed **25/25**, with **0** failures, skips, or
cancellations. It covered the authenticated same-origin request surface,
explicit confirmation, idempotency, customer-held digest preservation,
versioned deletion inventory, legal holds, lease/retry behavior, malformed and
unsupported kinds, failure rollback, worker completion, audit receipt shape,
and route cleanup.

After the run, a direct read-only check of the isolated fixture found zero
rows for the named fixture in `users`, `account_deletion_requests`,
`account_deletion_jobs`, `account_deletion_receipts`, and
`customer_held_record_digests`.

## Boundary and disposition

This is local implementation and qualification evidence only. It did not issue
an account deletion against Production, a customer-held database, or an
external customer account. It does not create legal/customer-held-record
disposition, restore/rollback acceptance, independent review, or final-release
acceptance. `QUAL-WEB-005` remains unchecked. No application data outside the
disposable fixture was deleted or overwritten. Score remains **246 checked /
34 open / 280 total (87.9%)**, split **13 AppSec-dependent / 21 non-AppSec**.
