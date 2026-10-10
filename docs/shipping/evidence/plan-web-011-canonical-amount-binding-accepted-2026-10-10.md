# PLAN-WEB-011 canonical amount/catalog binding acceptance

Date: 2026-10-10 IST  
Environment: isolated Vercel Preview + Razorpay Test Mode + isolated Preview
PostgreSQL  
Scope: catalog/amount/currency binding only; not Production billing activation

## Acceptance trace

The isolated Preview checkout created a canonical Pro monthly subscription from
the server-owned catalog. The provider-hosted Test Mode card fixture completed
authorization using the documented sandbox OTP path. Read-only reconciliation
then matched the same commercial binding across provider and application state:

- catalog: Pro/monthly, version `2026-10-02.0`;
- currency: INR;
- amount: ₹2,809.43 (`280943` minor units);
- subscription: provider `active` and application `active`;
- payment: provider `subscription` source, `captured`, same amount/currency;
- license: active Pro license linked to the captured payment; and
- signed events: distinct completed `payment.authorized`,
  `payment.captured`, `subscription.authenticated`,
  `subscription.activated`, and `subscription.charged` events.

The route and checkout-note contract validate plan, cadence, catalog version,
currency, amount, entitlement duration, user/checkout identity, and the HMAC
signature before recording the payment. The captured provider value matched the
server-selected canonical offer; no manual database edit or entitlement grant
was used.

## Evidence and boundary

Primary hosted evidence:
`docs/shipping/evidence/plan-web-014-preview-official-subscription-card-success-2026-10-10.md`.
Supporting invoice-binding evidence:
`docs/shipping/evidence/plan-web-014-subscription-invoice-reconciliation-and-production-rollout-2026-10-09.md`.

This accepts `PLAN-WEB-011`’s catalog/amount-binding requirement. It does not
claim Production billing activation, Production database writes, renewal,
failure/expiry, refund, replay/out-of-order, timeout/retry, or the complete
payment lifecycle. Those remain mapped to `PLAN-WEB-012`, `PLAN-WEB-014`, and
`PLAN-WEB-015`/Gate 4. Production remains fail-closed because no live plan IDs
or Test Mode payment credentials were placed in the Production runtime.
