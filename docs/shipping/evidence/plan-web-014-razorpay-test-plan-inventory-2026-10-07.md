# PLAN-WEB-014 Razorpay Test Mode plan inventory — 2026-10-07

## Scope

- Razorpay Test Mode only, using the repository test credential pair from
  `verglos-web/.env.test.local`; values were not printed or retained.
- Read-only SDK operation: `plans.all({ count: 100 })`.
- No browser, checkout, order, subscription, payment, webhook, database,
  deployment, or production operation.

## Result

The authenticated Test Mode account returned **zero subscription plans**. The
production environment variable-name inventory contains no Razorpay plan-ID
configuration; only the existing key, amount/day, QR timing, and webhook
settings are present. No provider identifiers were retained.

## Decision and limitation

Do not create provider plans as an unreviewed workaround: provider plans are
immutable provider objects and require an approved catalog amount, cadence,
currency, entitlement binding, owner, and cleanup/reconciliation decision.
The current order-based hosted Checkout remains the only qualified creation
path. Subscription renewal/cancellation/expiry qualification remains open
until an approved non-production plan mapping exists.
