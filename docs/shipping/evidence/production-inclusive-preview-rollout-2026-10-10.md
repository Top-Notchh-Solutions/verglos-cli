# Production-inclusive Preview rollout — 2026-10-10

## Scope

This qualification covers the current Web head `e310c57afec730d0266e72a7adbfff59e5efa09a` and its isolated Vercel Preview deployment. It is code-rollout and read-only verification evidence; it is not authorization to run Test Mode payment activity against Production.

## Source qualification

- Focused organization-policy/signing/authorization/payment-route tests: **41 passed / 1 intentional skip / 0 failures**.
- `pnpm typecheck`: passed.
- `pnpm build`: passed; 47 routes generated.

## Isolated Preview deployment

- Deployment: `dpl_A56xwcNBrx3qVSfZ1VpUNUoKV5ec`.
- Build status: READY.
- Preview runtime configuration check: safe or payment-disabled.
- `/checkout`: HTTP 200; Test Mode banner present; canonical Pro monthly offer present; Cards is the only exposed hosted method.
- `GET /api/webhooks/razorpay`: HTTP 405, confirming the signed endpoint remains POST-only.
- `GET /api/razorpay/create-subscription`: HTTP 405.
- `GET /api/razorpay/create-order`: HTTP 405.

No payment, webhook, entitlement, account, customer, or database write was made by this rollout.

## Production migration preflight

Vercel's Production environment runner was used to invoke the application's read-only migration audit without printing the database value. The audit found:

- Expected migrations: **41**.
- Applied migrations: **39**.
- Missing tables: **2**.
- Pending migrations: `0039_client_projection_custody`, `0040_billing_invoice_metadata`.
- Preflight state: `blocked-missing-tables`.

The Production alias remains on the previously qualified deployment `9a3c32a`. The Preview head must not be promoted until a reviewed Production snapshot/restore point exists, migrations `0039` and `0040` are applied in order, and the post-migration audit passes. No Production migration or state write occurred.

## Backlog disposition

No checkbox changed. This advances the production-inclusive rollout and makes the exact deployment blocker explicit; it does not close `PLAN-WEB-014`, `PLAN-WEB-015`, `PRO-008`, or `QUAL-WEB-006`.
