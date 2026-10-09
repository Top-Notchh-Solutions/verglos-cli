# PLAN-WEB-014 provider renewal reconciliation gap — 2026-10-10

## Read-only observation

The Razorpay Test Mode subscription inventory contained one active monthly Pro
subscription, redacted here as `sub_Tl…sTpP`, with the canonical amount
280,943 paise, `paid_count=2`, `remaining_count=9`, and a future `charge_at`.
The provider invoice inventory showed two paid invoices for that subscription.

The isolated Preview database was queried without mutation. It contains one
matching `billing_subscriptions` row in `active` state with plan `pro`, cadence
`monthly`, and amount `280943`, but it has:

- zero matching `billing_payments` rows;
- zero matching `licenses` rows;
- no corresponding `subscription.charged` event in the isolated webhook
  event aggregate.

The isolated event aggregate contains completed subscription events for other
fixtures, including `subscription.activated`, `subscription.authenticated`,
`subscription.cancelled`, and `subscription.charged`; this does not prove the
missing subscription's delivery.

## Disposition

This is a concrete provider-to-application delivery/reconciliation gap. The
provider's two paid invoices are not accepted as application renewal or
entitlement evidence because the signed webhook delivery and corresponding
ledger/license projection are missing. No manual database edit, entitlement
grant, provider mutation, payment operation, or Production operation was
performed.

Missing artifact: a provider delivery record or provider-supported replay of
the exact signed `subscription.charged`/invoice payment event to the isolated
Preview webhook, followed by read-only reconciliation of the payment ledger,
subscription period, and license state. Owner: Web/provider operations.

Gate 4 and `PLAN-WEB-011`, `PLAN-WEB-012`, `PLAN-WEB-014`, and `PLAN-WEB-015`
remain open. Score remains **219 checked / 61 unchecked / 280 total (78.2%)**.
