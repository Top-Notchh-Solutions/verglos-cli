# PLAN-WEB-012 — Final V1 prepaid card-order qualification

Date: 2026-10-11

## Contract applied

The current Final V1 contract is one-time **card** payment for a fixed term
with customer-initiated manual renewal. Automatic recurring billing is not a
customer promise. Existing subscription tables, status reads, and webhook
parsers remain compatibility-only; the subscription-creation route now fails
closed with `410 SUBSCRIPTION_BILLING_DISABLED`.

## Code result

Web commit `887249d`:

- accepts only the exact `RAZORPAY_ENABLED_PAYMENT_METHODS=card` production
  configuration;
- renders only the card method in the hosted checkout;
- removes the recurring checkout button and routes all new checkout attempts
  through the signed one-time order path;
- keeps the order amount, currency, catalog, user, term, and method binding;
- makes a direct recurring-subscription creation request fail closed; and
- documents manual renewal in the checkout UI.

## Verification

- Web serial suite: **880 passed, 0 failed, 24 environment-gated skips**.
- Focused checkout/runtime/order/subscription suite: **55 passed, 0 failed,
  3 skips**.
- Route/webhook suite: **27 passed, 0 failed, 1 skip**.
- TypeScript typecheck: passed.
- Production build: compiled successfully and emitted the full route manifest.
- Disposable Docker PostgreSQL 15, reviewed migrations, and write-capable
  webhook integration: **6 passed, 0 failed, 0 skips**. This covered captured
  card payment, duplicate replay, partial/full refund watermarking, failed
  payment with later capture recovery, and a second one-time card order
  extending the same entitlement as manual renewal. The container was removed
  after the run.

No Neon, Production database, Production entitlement, customer record, or
real-money payment was written by this qualification.

## Hosted boundary

The exact commit could not yet be deployed for current-head Preview
qualification because the local Vercel CLI returned `Not authorized`. The
previous hosted provider evidence is retained as historical evidence and is
not silently relabeled as exact-head evidence. No checkbox is credited from
this code-side and isolated-DB run alone.

## Disposition

`PLAN-WEB-012` remains unchecked pending deployment of `887249d` to isolated
Preview and a current-head provider-originated card capture/failure/refund
reconciliation. The old recurring-card simulator requirement is retired by
the Final V1 contract; a recurring fixture is not required for manual renewal.

Score remains **223 checked / 57 unchecked / 280 total (79.6%)**.
