# PLAN-WEB-014 · local Docker webhook regression support

Date: 2026-10-10
Environment: disposable local PostgreSQL 15 Docker database
Status: code-side support; not provider acceptance

## Result

The Web payment webhook integration suite ran against the local Docker
database after the Neon URL was correctly refused by the test file's
localhost-only isolation guard.

- database-backed integration tests: **5/5 passed**;
- focused route/webhook tests: **28/28 passed**.

The passing cases include captured subscription entitlement ordering,
replay/idempotency claims, monotonic partial/full refund watermarks, failed
payment no-grant behavior, invoice-bound subscription success/failure,
subscription expiry projection, lifecycle ordering, and retry semantics.

## Boundary

This is disposable local code/regression evidence. It does not replace a
provider-delivered renewal, provider replay, provider out-of-order delivery,
or hosted Preview acceptance. The Docker fixture was separate from Neon,
Preview, Production, and Razorpay state.

No secrets, provider identifiers, database URLs, customer data, or raw
payloads are included.
