# PLAN-WEB-014 Docker payment revalidation — 2026-10-10

## Scope

Revalidated the payment integration batch against the reviewed disposable
PostgreSQL migration baseline after the first invocation was correctly refused
by the test target-isolation guards. The exact loopback container
`verglos-shipping-postgres-20261010` was restarted, migrations were checked
with `pnpm db:migrate`, and the container was stopped after the run.

The payment-test variables targeted local `verglos_test`; the runtime
`DATABASE_URL` targeted a separate local database name. No Neon or Production
URL was used by the batch.

## Result

The same five integration files passed **10/10**, with **0 failures and 0
skips**:

- catalog-bound hosted order creation and payment-method projection;
- catalog-bound subscription creation and pending binding;
- atomic webhook claim, replay, in-flight, release, and conflict handling;
- captured payment, refund watermark, and exactly-once grant behavior;
- failed order/no-grant, invoice-bound failed subscription, and expiry without
  paid-time mutation; and
- renewal ordering, identity-conflict rejection, and paid-time preservation.

The supported-runtime caveat remains: the local host used Node `v26.4.0` while
the repository engine declaration is Node 22.x. This is isolated integration
evidence, not supported-runtime hosted acceptance or real provider lifecycle
evidence.

## Boundary

Only disposable local PostgreSQL state changed. No provider, payment, Neon,
Production, entitlement, account, customer, or manual-row state changed. Gate
4 and `PLAN-WEB-011/012/014/015` remain open for provider delivery/replay,
complete lifecycle reconciliation, and Production acceptance. Backlog remains
**219 checked / 61 unchecked / 280 total (78.2%)**; no checkbox changed.

