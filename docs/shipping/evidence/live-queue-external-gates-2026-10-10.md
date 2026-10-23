# Live queue and external-gate disposition — 2026-10-10

## Scope

This is a private control-plane synchronization record after the Production
migration/code rollout. It does not accept or close a backlog item.

## Authoritative score

The live private backlog recomputes to **223 checked / 57 unchecked / 280
total (79.6%)**. No checkbox changed in this queue review.

## Top-to-bottom queue disposition

- `HUNT-008` is parked with current evidence in
  `hunt-008-requalification-block-2026-10-10.md`. Trusted/licensed recipe
  provenance, approval wiring qualification, and an independent AppSec
  review remain absent.
- `PLAN-WEB-012` is parked with current evidence in
  `plan-web-012-local-lifecycle-pass-provider-block-2026-10-10.md`. Its local
  lifecycle substrate passes, but provider-generated renewal/failure/expiry,
  subscription refund/replay/order, timeout/retry, and complete signed
  reconciliation evidence remain absent. Owner: authorized Razorpay Test Mode
  operator/provider support. Review: 2026-10-11 IST or when the provider
  fixture changes.
- `PLAN-CLI-003` and `PRO-008` remain dependency-blocked by the open billing
  lifecycle item and are not selected early.
- `TEAM-CLI-001` is the first independent dependency-ready backend track, but
  its current hosted-activation evidence records the missing production policy
  signer/trust root, policy-row reconciliation, and authorized
  tenant/repository-bound fetch. It remains unchecked.
- `STUDIO-CLI-001`, `LIC-002`, `QUAL-CLI-006`, `QUAL-WEB-006`, and the
  acceptance/release tracks retain their already-recorded customer, legal,
  human-review, trusted-publishing, or final-corpus gates. None can be
  checked by repeating local tests or by using founder consent as a substitute
  for the required independent artifact.

## Release decision

Keep Production billing fail-closed and keep the Preview release candidate
Cards-only. Do not retry the unchanged Razorpay OTP/tokenization path, call
undocumented provider endpoints, synthesize webhooks, edit entitlement rows,
or alter the backlog score. The next queue work may implement or qualify a
dependency-ready technical slice, but a checkbox changes only after its full
acceptance artifact exists.

## External unblock summary

The payment blocker is a provider-supported recurring-card/tokenization
fixture or official delivery/renewal control, followed by signed webhook and
payment-to-ledger-to-license reconciliation. Razorpay's official saved-card
documentation identifies tokenization as an on-demand account feature:
https://razorpay.com/docs/payments/payment-methods/cards/features/saved-cards/

