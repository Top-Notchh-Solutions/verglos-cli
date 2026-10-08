# PLAN-WEB-014 — isolated Test Mode subscription cancellation

Date: 2026-10-09  
Private scope: Razorpay Test Mode, isolated Preview database, and Preview
webhook only

## Operation

- Read-only Test Mode inventory returned HTTP 200 with 9 subscriptions: 5
  `active` and 4 `created`.
- The newest active Test Mode subscription was selected without recording its
  provider identifier in this evidence.
- Razorpay Test Mode cancellation was requested with
  `cancel_at_cycle_end=false`.
- Provider response returned HTTP 200 and status `cancelled`.

## Reconciliation

After webhook processing, the isolated Preview database reported subscription
rows in these states: 4 `authenticated`, 1 `cancelled`, and 4 `pending`.
The cancelled subscription had one captured subscription payment and one linked
license; the license remained active for the already-paid period. This matches
the ledger contract: cancellation prevents future subscription charges but
does not revoke time already purchased.

No row was inserted, updated, or deleted manually. The provider cancellation
was the only state-changing operation in this batch, and it was Test Mode
only. No Production plan, payment, provider, database, migration,
entitlement, account, or customer-data state changed.

## Acceptance disposition

This adds real isolated provider cancellation and provider-to-ledger/license
reconciliation evidence. It does not close the full Gate 4 matrix: renewal,
subscription failure/halt, expiry/completion, refund paths, replay and
out-of-order provider delivery, and complete provider/ledger/entitlement
reconciliation remain open.

Score remains **219 checked / 61 unchecked / 280 total (78.2%)**; no checkbox
changed.
