# Local test database isolation audit — 2026-10-08

## Scope

The database variable in `verglos-web/.env.test.local` was inspected through
the local environment mechanism. The credential value, host credentials,
Neon project/branch/endpoint identifiers, and application rows were not
recorded. A bounded PostgreSQL metadata/aggregate query was executed; no
write, migration, payment, webhook delivery, entitlement, or deployment
operation occurred.

## Result

The endpoint reports PostgreSQL database `neondb` and exposes Neon project,
branch, and endpoint settings. It is populated rather than a fresh isolated
test database:

- Drizzle migration records: **26**
- users: **2**
- licenses: **1**
- organizations: **1**
- billing payments: **0**
- billing subscriptions: **0**
- Razorpay webhook events: **4**
- reports: **0**
- record receipts: **0**
- account-deletion requests: **0**

## Disposition

The database cannot be treated as an isolated Preview/payment database. The
Preview deployment remains without `DATABASE_URL` and without an enabled
payment-method configuration. No payment lifecycle test was attempted. The
credential value remains private and is not reused; R-041 rotation/revocation
and a separately provisioned empty non-production database remain open.
