# Production read-only smoke — 2026-10-09

## Deployment

- Vercel deployment `dpl_CvNvt9YEQLMhnEB8htL7eiCocbmG` was independently
  inspected as `READY` with target `production`.
- The deployment is aliased to `https://verglos.com`.
- No environment value, credential, payment identifier, database URL, or
  personal data was printed or retained.

## Checks

Read-only unauthenticated requests returned:

- `/` — HTTP 200; public revalidation cache policy.
- `/checkout` — HTTP 200; private no-store cache policy.
- `/docs` — HTTP 200; public revalidation cache policy.
- `GET /api/razorpay/create-subscription` — HTTP 405, as required for the
  POST-only route.

The rendered public HTML for `/`, `/checkout`, and `/docs` contained no
provider key marker, Test Mode marker, session-token marker, or database URL.
No browser payment interaction, authenticated account mutation, provider
call, database write, migration, entitlement change, or customer-data change
was performed.

## Disposition

This confirms the current fail-closed Production code boundary and public
route health. It does not qualify Production plan configuration, payment or
subscription lifecycle, migration/backfill, entitlement activation, or
rollback/restore. Those remain behind their operation-specific preflights.
