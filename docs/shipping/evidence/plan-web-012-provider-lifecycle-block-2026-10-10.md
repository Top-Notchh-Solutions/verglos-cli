# PLAN-WEB-012 provider lifecycle acceptance boundary

Date: 2026-10-10 IST  
Status: parked unchecked; implementation qualification is complete, acceptance
is externally blocked

## Already evidenced

The Web code and isolated database harness cover captured/failed/refunded/
cancelled/expired transitions, invoice binding, replay claims, ordering,
refund watermarks, and exactly-once license behavior. A real isolated Test
Mode subscription capture and signed first-charge delivery are recorded in
`docs/shipping/evidence/plan-web-014-preview-official-subscription-card-success-2026-10-10.md`.

## Missing acceptance artifacts

The item still requires provider-generated, current, signed evidence for:

- a renewal/second-charge cycle;
- provider failure and expiry delivery;
- refund replay/order and out-of-order delivery;
- provider timeout/retry behavior; and
- full payment → ledger → license exactly-once reconciliation across those
  events.

The current Production runtime deliberately has no Test Mode plan IDs or test
payment credentials, so no Production payment write was attempted. The
isolated Preview provider fixture is the correct environment, but the current
recurring-card authorization/renewal fixture has not produced the missing
provider events. No OTP was guessed and no database row was manually edited.

## Owner and unblock

Owner: authorized Razorpay Test Mode operator/provider support.  
Artifact: a provider-supported recurring subscription fixture that can produce
the documented renewal, failure/expiry, refund, and retry/replay events at the
canonical catalog amount, followed by read-only isolated reconciliation.  
Review: reassess on provider-fixture change or by 2026-10-11 IST.  
Disposition: keep `PLAN-WEB-012` unchecked and advance only to a dependency-
ready item; do not treat code-side or synthetic tests as provider acceptance.
