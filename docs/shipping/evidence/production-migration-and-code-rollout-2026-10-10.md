# Production migration and code rollout — 2026-10-10

## Safety preflight

- A Neon data-and-schema child branch named `pre-migration-2026-10-10` was
  created from the `verglos` project's `production` branch with one-day
  auto-delete. Its branch audit reached 41/41 migrations with zero missing
  tables before any Production change.
- The migrations are additive-only: `0039_client_projection_custody` creates
  bounded redacted Studio custody storage and `0040_billing_invoice_metadata`
  creates provider invoice metadata projection storage. No existing rows were
  rewritten or deleted.

## Production database change

- The guarded `pnpm db:migrate` runner was invoked through Vercel's Production
  environment.
- Post-write read-only audit: **41 expected / 41 applied / 0 pending / 0
  missing tables**; preflight state `inventory-only-full-audit-required`.

## Production code rollout

- Deployment: `dpl_3H8Ejwb7wfbPMD8f7TuXZ5gYcw3v`.
- Source: Web `e310c57afec730d0266e72a7adbfff59e5efa09a`.
- Build/runtime configuration: passed; 47 routes generated; READY and aliased
  to `https://verglos.com`.
- Smoke: `/` HTTP 200, `/checkout` HTTP 200, Cards-only hosted method;
  Production subscription creation is disabled; webhook/order/subscription
  GET probes return HTTP 405 as required for POST-only routes.

## Boundary and backlog

No payment, provider, webhook, entitlement, account, customer-data, or
Production application-state write occurred. This rollout advances the hosted
Studio/invoice implementation and Production readiness, but does not close
`STUDIO-CLI-001`, `PRO-008`, `PLAN-WEB-014`, or `PLAN-WEB-015`; their external
recipient/provider lifecycle evidence remains missing. Score remains **223
checked / 57 unchecked / 280 total (79.6%)**.
