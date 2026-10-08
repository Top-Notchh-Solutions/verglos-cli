# PLAN-WEB-014 current Web main local qualification · 2026-10-08

## Scope

The exact current Web `origin/main` was `cedf199855a5c4734122ae4849253156328cff1b`
(PR #168 merge). This batch exercised only disposable local PostgreSQL and
synthetic Razorpay provider dependencies. No previously inspected Razorpay
credential was reused; the private tracker continues to treat those values as
compromised pending rotation.

## Verification

- Disposable PostgreSQL 15 database `verglos_test` was bootstrapped only with
  the reviewed local empty-database confirmation and migrated through all **38**
  ordered migrations.
- Payment/ledger/webhook focused run: **31/31 passed**, including hosted method
  binding, catalog/amount binding, capture, failure, refunds, cumulative refund
  watermarks, replay/conflict/in-flight claims, failed-to-captured recovery,
  and exactly-once entitlement behavior.
- Fresh disposable PostgreSQL 15 serial run with payment-specific integration
  variables unset: **885/887 passed, 2 explicit skips, 0 failures**.
- `pnpm typecheck`: pass.
- `pnpm db:check`: pass.
- `pnpm db:migrations:check`: **38 ordered migrations verified**.
- `pnpm build`: pass; **45** routes generated.
- Local built runtime public route sweep: `/`, `/checkout`, `/docs`,
  `/docs/2.0.0`, `/detectors`, `/verify`, `/llms.txt`, and `/sitemap.xml`
  each returned HTTP 200. An unauthenticated local order request was rejected
  before provider work.

An initial serial attempt against the already-migrated payment database showed
eight fixture-setup collisions (`relation already exists`). That run was not
counted as product failure; the configured suite was rerun against a separate
fresh database, where the result above was obtained.

## Disposition

This is code-side and isolated-runtime qualification only. It does not prove
Razorpay account-enabled method truth, provider-hosted success/capture/refund/
renewal/cancellation delivery, webhook delivery, production reconciliation,
or credential rotation. `PLAN-WEB-013`, `PLAN-WEB-014`, and `PLAN-WEB-015`
remain open. No production, provider, payment, deployment, migration outside
the disposable local databases, entitlement, or customer write occurred.

No backlog checkbox changed. The authoritative score remains **218 checked /
62 unchecked / 280 total (77.9%)**.
