# PLAN-WEB-014 Test Mode renewal-acceleration preflight — 2026-10-10

## Purpose

Qualify whether Razorpay's documented subscription-update operation can bring
one already-paid Test Mode recurring card subscription to its next scheduled
cycle so that the signed renewal/payment webhook and isolated reconciliation
can be observed. This is a provider-operations preflight, not payment or
entitlement acceptance.

## Supported operation

Razorpay's official Subscriptions API exposes subscription update, pause, and
resume operations, but no separate `charge now` endpoint. The documented
subscription update accepts `start_at` and `schedule_change_at: "now"`.
The bounded candidate will be updated only through that supported API shape;
no undocumented endpoint, direct invoice mutation, synthetic webhook, or
database edit is allowed.

## Scope and preflight

- [x] Active item is `PLAN-WEB-014`; no other backlog item is being advanced.
- [x] Current score is 219 checked / 61 unchecked / 280 total (78.2%).
- [x] Razorpay credentials and API account are Test Mode; the read-only
      inventory returned HTTP 200.
- [x] Exactly one active provider subscription has more than one paid cycle,
      a future charge schedule, and an exact active match in isolated
      `TEST_DATABASE_URL`.
- [x] The matched application row is Pro/monthly with canonical amount
      `280943` minor units.
- [x] The provider webhook target is an isolated Preview route protected by
      the application HMAC secret; Production is not a target.
- [x] The provider subscription's current status, paid count, remaining
      count, charge schedule, and matching application state were captured in
      process memory before the write.
- [ ] The provider accepts the documented update and emits a signed renewal
      or payment event that reaches isolated Preview.
- [ ] The application reconciles the event exactly once into payment, ledger,
      tenant-bound entitlement/license, and access state.

## Stop and recovery rules

Stop without retrying if the target is not Test Mode, the isolated match is
lost, the provider returns a non-success response, the webhook reaches
Production, the signature fails, or the provider operation changes an
unapproved field. Do not manually repair database rows or grant access.

Retain the pre-write provider state only in the authorized process/evidence
path. If the update succeeds without a valid signed event, record the exact
provider result and leave application state unchanged; any schedule recovery
must use another documented provider operation and its own preflight.

## Release decision

This operation is permitted only for isolated Razorpay Test Mode
qualification. It cannot close `PLAN-WEB-014` or Gate 4 by itself. Acceptance
requires the real signed provider event and the complete payment → ledger →
tenant-bound entitlement/license → access reconciliation, with replay and
failure behavior verified separately.

## Official reference

- https://razorpay.com/docs/api/payments/subscriptions/
- https://razorpay.com/docs/api/payments/subscriptions/update-subscription/
