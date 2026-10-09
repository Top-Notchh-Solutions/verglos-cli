# PLAN-WEB-014 — failed subscription invoice binding qualification

Date: 2026-10-09

## Scope

Web commit `da45a97` hardens the isolated subscription failure path when a
Razorpay `payment.failed` event carries an invoice but omits
`subscription_id`. This is code and isolated-database qualification only; it
does not claim a live provider lifecycle or Production billing acceptance.

## Implementation

- Resolve an invoice-only failed payment to its provider subscription.
- Validate the invoice amount and currency, and validate the order binding
  when the provider supplies an order ID.
- Bind the subscription notes to the signed server checkout snapshot.
- Record the subscription as `pending` and the payment as `failed` without
  granting or extending a license.
- Preserve the existing direct subscription-identity and hosted-order paths.

## Verification

- Focused webhook-handler suite: **14/14 pass**.
- Fresh isolated PostgreSQL webhook-handler integration: **4/4 pass**,
  including the invoice-only failed subscription case and the existing
  expiry/replay/refund cases.
- Full Web serial suite: **892 total / 869 pass / 23 explicit skips / 0 fail**.
- Typecheck, production build (45 pages), database schema check, ordered
  migration check (38 migrations), and diff check passed.
- Preview deployment `dpl_HbYCQG4hnDH6Jew48YcNUuRkVVaA` reached READY. Its
  build reported safe or payment-disabled Preview configuration. Protected
  read-only smoke returned 200 for `/`, `/checkout`, and `/docs`; the
  subscription-creation GET boundary returned 405.

## Provider and Production boundary

Read-only Razorpay Test Mode requests using the local gate-testing file
returned HTTP 401 for both plan inventory and subscription inventory. No
provider write was attempted after that result. Real provider renewal,
failure, expiry, refund, replay, and reconciliation evidence therefore remain
open pending the authorized operator's corrected isolated Test Mode
credential configuration.

Production remains the previously qualified fail-closed code rollout from
`a95deef` / `dpl_72ptf8YQyLxxXvJHVQDg2vUfh3CN`. This batch was not promoted
to Production and performed no Production plan, payment/provider, database or
migration, entitlement, account, or customer-data write.

## Disposition

This strengthens `PLAN-WEB-011`, `PLAN-WEB-012`, `PLAN-WEB-014`, and
`PLAN-WEB-015` but closes no checkbox. Score remains **219 checked / 61
unchecked / 280 total (78.2%)**.
