# Web landing qualification runtime boundary

**Date:** 2026-10-23 (IST)  
**Repository:** `verglos-web`  
**Source:** `ccd77d6`  
**Merged PR:** #253  
**Merge commit:** `16ceddc9855e75e04f10ddd276fae16c7ef09e01`

The hosted landing browser job now starts the built server with:

- `VERCEL_ENV=preview`, so production runtime-secret validation is not
  triggered for this local-only qualification server;
- `RAZORPAY_ENABLED_PAYMENT_METHODS=""`, so the job cannot initialize hosted
  checkout or contact a payment provider;
- no production database, Clerk, provider, or customer credentials.

The public-release contract test asserts this workflow boundary. Local
verification passed **12/12** public-release tests and `pnpm typecheck`.

This makes the browser qualification executable without weakening production
runtime validation: actual production deployments still use
`VERCEL_ENV=production` and fail closed on missing configuration. It does not
close hosted/browser/field acceptance, independent AppSec/Hunt review, or
final release sign-off. No provider, Production, database, customer, or
release state was changed, and nothing was deleted.
