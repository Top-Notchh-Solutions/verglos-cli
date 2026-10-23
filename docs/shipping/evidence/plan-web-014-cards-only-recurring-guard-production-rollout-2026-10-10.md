# PLAN-WEB-014 Cards-only recurring guard and Production rollout

Date: 2026-10-10
Web commit: `9a3c32a`
Production deployment: `dpl_12hRaACdnE4SvGmFHZFXpcUCTsC2`

## Implementation

- The recurring subscription route now fails closed unless the server-owned
  payment-method catalog contains `card`.
- The subscription checkout display filters the order method catalog to Cards,
  so a broader order catalog cannot expose unsupported recurring methods.
- A cardless recurring configuration returns HTTP 503 with
  `CARD_METHOD_REQUIRED` before provider work.

## Verification

- Checkout display unit tests: **4/4 passed**.
- Subscription route integration tests: **2/2 passed** against disposable
  PostgreSQL 15, with distinct configured and payment-test database URLs.
- Typecheck: passed.
- Local production build: passed; 47 pages generated.
- Vercel Production build: passed; deployment reached `READY`.
- Read-only Vercel checks for `/` and `/checkout`: HTTP 200.

## Boundary

The local `.env.gates.testing` file was used only as local Test Mode context;
its values were not passed to the Production deployment and no environment
variable was changed. No checkout was submitted and no provider, payment,
webhook, database, migration, entitlement, license, account, or customer-data
write occurred.

This is implementation and deployment evidence for the Cards-only boundary.
It does not close `PLAN-WEB-014` or Gate 4: provider-generated recurring
renewal, failure/expiry, refund/replay/order, out-of-order delivery,
timeout/retry, exactly-once reconciliation, and complete tenant-bound
payment-to-ledger-to-license evidence remain open.

Disposition: keep the checkbox open and continue with the strict backlog queue.
Score remains **223 checked / 57 unchecked / 280 total (79.6%)**.
