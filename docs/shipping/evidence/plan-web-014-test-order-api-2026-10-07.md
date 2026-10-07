# PLAN-WEB-014 Razorpay Test Mode order API qualification — 2026-10-07

## Scope

Bounded provider-side test only. This run used the isolated Razorpay Test Mode
key pair from the ignored Web test environment and created one hosted Checkout
order through the Razorpay Orders API. Production environment files, database
credentials, production URLs, QR APIs, deployments, and application data were
not loaded or modified.

## Preflight

- Web branch: `feat/web-plan-013-hosted-checkout`
- Web head: `9fd22d8c630a05643568b7114f69902d7bc2558a`
- Razorpay key mode: sandbox/test prefix checked in memory (secret not printed)
- Docker: client/server `29.7.2`; no qualification container was started
- Operation: one `orders.create` call followed by one read-only `orders.fetch`
- Amount/currency: INR `280943` minor units, matching the current Pro monthly
  catalog amount used by the test operation

## Observed result

The provider accepted the order and returned:

- created order identifier: retained only as a private local redacted record;
- create response: `status=created`, `amount=280943`, `currency=INR`;
- fetch response: `status=created`, `amount=280943`, `currency=INR`;
- notes: the two bounded qualification keys supplied by the operation were
  returned unchanged.

Only the order-creation/fetch boundary is evidenced. No hosted Checkout
method was selected, no payment was authorized or captured, no refund or
renewal occurred, no webhook was received, and no application ledger or
entitlement row was created. The order therefore does not prove payment
success or entitlement.

## Disposition

No backlog item is accepted. `PLAN-WEB-013`, `PLAN-WEB-014`, and
`PLAN-WEB-015` remain open pending the account-enabled method matrix,
provider lifecycle/webhook evidence, exactly-once entitlement reconciliation,
and production truth/cutover preflight. This is private evidence and contains
no provider secret or full payment identifier.
