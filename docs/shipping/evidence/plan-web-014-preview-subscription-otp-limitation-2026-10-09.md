# PLAN-WEB-014 — Preview subscription authorization limitation

Date: 2026-10-09

## Scope and boundary

This was a bounded Razorpay Test Mode qualification attempt against the
isolated Preview deployment. It was not a Production payment, database,
provider, entitlement, account, or customer-data operation. No Production
plan IDs or Test Mode credentials were added.

The current Preview target was a fresh READY Vercel Preview deployment on the
reviewed Web qualification branch. The Preview webhook was configured for the
same isolated target. The browser run used the existing authenticated Preview
fixture; no user password, session cookie, provider session token, card
credential, or webhook secret is retained here.

## What was verified

- The catalog-bound subscription-creation request reached the Preview route
  with the fixture authorization header and returned HTTP 200.
- Razorpay Checkout loaded in Test Mode and reached the subscription-card
  mandate step using the documented Test Mode subscription-card fixture. Only
  the last four card digits were observed during qualification.
- The provider presented the six-digit mandate/OTP verification step.
- The isolated database remained queryable with all 38 migrations present and
  the expected billing, license, and webhook tables available.
- A read-only aggregate reconciliation after the run found 5 active, 7
  cancelled, and 12 pending subscription rows; 4 captured subscription
  payment rows; 2 active Pro license rows; and 61 completed webhook-event
  rows. These are cumulative isolated-fixture aggregates, not evidence that
  this attempted authorization succeeded.
- Temporary Preview auth diagnostics were removed after diagnosis. Focused
  Preview-auth tests passed 4/4 and Web typecheck passed; the only output was
  the existing Node 22 engine warning from the Node 26 runner.

## Provider result

The Test Mode mandate/OTP step rejected the bounded test attempt as an
incorrect OTP. A second bounded interaction reached the provider’s bank-like
OTP screen and also did not produce a successful authorization. The attempt
therefore produced no new captured payment or entitlement claim. The earlier
isolated first-charge/invoice reconciliation remains valid and is not
overwritten by this failed retry.

This result does not prove that the subscription implementation is broken,
and it does not prove a subscription lifecycle success. It is provider
qualification evidence that the available hosted subscription authorization
fixture is not currently sufficient to complete the remaining lifecycle run.

## Gate and backlog disposition

- Gate 4 remains **open**.
- `PLAN-WEB-013` remains accepted from the earlier all-enabled-method order
  evidence.
- `PLAN-WEB-011`, `PLAN-WEB-012`, `PLAN-WEB-014`, and `PLAN-WEB-015` remain
  unchecked because renewal, provider-generated failure/expiry, subscription
  refund, replay/out-of-order delivery, timeout/retry, and complete
  provider/ledger/entitlement reconciliation are not all evidenced.
- No backlog checkbox changed. The authoritative score remains **219 checked /
  61 unchecked / 280 total (78.2%)**.

## Next action and owner

Owner: Verglos release owner with the Razorpay Test Mode account owner.

Before another hosted lifecycle attempt, obtain a provider-supported Test Mode
subscription mandate/OTP fixture or provider confirmation of the exact
subscription authorization path and its simulated renewal/failure controls.
Then rerun only the missing lifecycle cases and reconcile provider records to
the isolated ledger and entitlement projection. Until that evidence exists,
Production recurring billing and all Production payment/database writes stay
fail-closed. Do not retry the same OTP path indefinitely and do not convert
this limitation into a passed checkbox.

