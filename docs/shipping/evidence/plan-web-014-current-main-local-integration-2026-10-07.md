# PLAN-WEB-014 current-main local payment integration — 2026-10-07

## Scope

- Web exact merged main: `14988371cdae94d66d068b49d07cc31f0b26c5ea`
- Isolated worktree: `qual/web-plan-014-current-main`
- Disposable local PostgreSQL 15 container on loopback only
- Synthetic signed Razorpay webhook fixtures; no provider credential or API call

## Results

- Local empty-database bootstrap plus all **37** ordered migrations: pass.
- Payment-method catalog, checkout-binding, webhook-handler, replay, failure,
  refund-watermark, subscription-lifecycle, and PostgreSQL event-claim tests:
  **22 passed / 0 failed / 0 skipped**.
- Typecheck: pass.
- Drizzle schema check: pass.
- Preview-mode production build: pass; **43 pages** generated.
- The run used local Node `26.4.0` and emitted the repository's Node `22.x`
  engine warning; this is not supported-runtime release acceptance.

## Boundary

This strengthens current-main implementation and isolated integration evidence,
not provider payment acceptance. No Razorpay order, payment, capture, refund,
renewal, cancellation, hosted browser payment, webhook delivery, production
configuration, production database, or deployment write occurred. The
account-enabled method set and real test-mode lifecycle matrix remain open for
`PLAN-WEB-014`, and production reconciliation remains open for
`PLAN-WEB-015`. No backlog checkbox changed.
