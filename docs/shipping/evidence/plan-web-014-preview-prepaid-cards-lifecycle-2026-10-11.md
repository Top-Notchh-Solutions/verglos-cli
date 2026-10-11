# PLAN-WEB-014 · Preview prepaid Cards-only lifecycle qualification · 2026-10-11

## Scope and safety

- Final V1 contract: one-time prepaid fixed-term Pro access, Cards-only, with
  customer-initiated manual renewal.
- Environment: isolated Vercel Preview and isolated Neon Test database.
- Provider: Razorpay Test Mode only.
- No Production payment, database write, migration, entitlement mutation,
  account write, or customer-data operation was used.
- No fake provider event, guessed OTP, or direct database row edit was used.

## Hosted/provider evidence

1. The server-owned canonical Pro monthly order returned HTTP 200 with the
   canonical INR amount, 30-day term, Test Mode, and only `card` / `Cards`.
2. Two one-time hosted card orders completed as provider `captured` payments.
   The current Preview received signed provider delivery and returned HTTP 200;
   each corresponding isolated `billing_payments` row has a linked license.
3. The first captured order was fully refunded in Test Mode. Razorpay reported
   the refund `processed`; Preview accepted the signed `refund.processed`
   event with HTTP 200; the database projected `refunded` with the full refund
   watermark.
4. The second captured order was the customer-initiated manual-renewal order.
   Its 30-day term starts at the prior paid term boundary, proving contiguous
   renewal without recurring billing. A real Test Mode partial refund then
   processed; Preview accepted the signed event with HTTP 200 and the database
   projected `partially_refunded` with the cumulative watermark.
5. The isolated provider/application inventory contains failed one-time order
   rows with no linked license or entitlement grant. Existing signed failure
   evidence and the current provider webhook logs are retained with this
   record.

## Local integration and contract evidence

On a fresh disposable Docker PostgreSQL database, the reviewed migration set
was applied and `pnpm test:payment-webhook-integration` passed **6/6**, with
zero failures and zero skips. The tests cover capture grant-once and refund
monotonicity/replay, second-order manual renewal, failed-order no-grant,
invoice-bound failure, paid-invoice exactly-once, and expiry projection.

The focused non-database payment suite passed **29/29**, with one explicit
environment-gated webhook-claim skip and zero failures. It covers the
Cards-only catalog, signed order binding, failure/no-grant behavior, processed
refund watermarking, event identity conflict, in-flight duplicate, and retry
semantics. Existing Docker evidence additionally covers the complete payment
webhook integration matrix and migration-backed expiry/reconciliation.

## Acceptance decision

The Final V1 prepaid Cards-only lifecycle acceptance condition for
`PLAN-WEB-014` is satisfied: provider-backed success/capture, failure/no-grant,
partial/full refund, manual renewal, and isolated ledger/license reconciliation
are now combined with the replay, ordering, retry, expiry, and exactly-once
integration proof. The automatic recurring-card requirement is not part of the
Final V1 contract.

`PLAN-WEB-015` remains open for the separate Production contract/reconciliation
checkpoint. This record does not claim Production billing activation.

No secret, database URL, card data, OTP, raw provider payload, payment
identifier, or customer identity is retained here.
