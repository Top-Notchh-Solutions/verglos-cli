# QUAL-WEB-006 dashboard search concurrency hardening

Date: 2026-10-24

Web PR **#287** merged normally into `main` as
`9b0bf7df46ce09c463c9298da4afdddd7cdeb987` from source commit
`7768457b5bab1027af957e902144856686d9840c`.

## Production implementation

Organization dashboard search no longer starts one unbounded `Promise.all`
for every authorized project. The repository now uses an order-preserving
worker pool capped at **8** project searches. Each project still uses the
existing scoped tenant database handle and keeps its release and subject
queries scoped to that project. The cap prevents a 250-project organization
from creating up to 500 simultaneous database operations in one request.

## Verification

- Dashboard boundary suite: **5/5** passed.
- The new regression covers peak concurrency and input-order preservation.
- Invalid concurrency limits are rejected fail-closed.
- Web TypeScript check passed.
- `git diff --check` passed.

This is production-code implementation evidence for QUAL-WEB-006. The row
remains unchecked for authenticated Production capture, human/field evidence,
independent review, customer/recipient acceptance, and final release sign-off.
No customer data, database write, payment, deletion, publication, provider
mutation, or final release occurred. No checkbox changed; the score remains
**246 checked / 34 open / 280 total (87.9%)**, split **13 AppSec-dependent / 21
non-AppSec**.

Hosted Actions did not execute test steps; the account budget admission gate
failed immediately. Local verification above is the execution evidence for
this implementation.
