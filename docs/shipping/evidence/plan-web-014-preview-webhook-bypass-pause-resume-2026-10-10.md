# PLAN-WEB-014 · Preview webhook bypass and Test Mode pause/resume qualification

Date: 2026-10-10

## Scope

- Active item: `PLAN-WEB-014`.
- Environment: Razorpay Test Mode and isolated Preview only.
- Production was not selected, edited, or used for billing qualification.

## Boundary repair

- The selected Preview webhook had provider request logs returning HTTP 401.
- A fresh Vercel automation bypass was generated in process memory and applied
  only to that Test Mode Preview webhook URL. The bypass value is omitted.
- A read-only `GET` to the resulting Preview webhook endpoint returned HTTP
  405 with no redirect, proving the request reached the application route
  rather than being stopped by Vercel Deployment Protection.
- The Production webhook and Production protection configuration were not
  changed.

## Provider-controlled lifecycle run

- Read-only matching selected exactly one active Razorpay Test Mode Pro/monthly
  subscription with two paid cycles and exactly one matching active isolated
  `billing_subscriptions` row at the canonical amount.
- Razorpay's documented `pause_at: "now"` operation returned HTTP 200 and the
  provider reached `paused`.
- Razorpay's documented `resume_at: "now"` operation returned HTTP 200 and the
  provider returned to `active`.
- The isolated Preview received one `subscription.paused` event and one
  `subscription.resumed` event. Both rows were `completed` in
  `razorpay_webhook_events`; no duplicate event claim was observed.
- The application subscription returned to `active` with one row. No direct
  database edit or synthetic webhook was used.

## Card boundary result

- One bounded card-submit attempt was made in the existing Test Mode hosted
  frame. The initial general test card was rejected by the provider as not
  eligible for recurring payments.
- The official Razorpay subscription Test Mode fixture was then entered once.
  The provider still did not produce a terminal authorization/capture; it
  remained in the card-tokenization/OTP flow and exposed no successful result.
- No OTP was guessed or entered. No new captured payment, entitlement, or
  license was asserted from this attempt.
- A provider `payment.failed` event reached isolated Preview and completed. The
  isolated payment aggregate moved only from `failed: 3` to `failed: 4`; the
  captured, partially-refunded, refunded, and active-license aggregates did
  not increase.
- The authenticated Test Mode Subscriptions dashboard was inspected for the
  matched two-paid-cycle subscription. Its detail page showed the expected
  active state and payment history but exposed no provider `charge now`
  control. No additional provider action was taken through an undocumented
  endpoint.
- Razorpay's published Test Card guide documents a random four-to-ten-digit
  OTP for the later sample-payment page, but does not publish a tokenization-
  eligibility OTP for the saved-card step. The current recurring checkout
  stopped at that earlier provider-controlled step, so the documented sample
  payment OTP rule cannot be used to claim recurring authorization here.

## Read-only reconciliation after the run

- `billing_payments`: `captured: 3`, `failed: 4`, `partially_refunded: 1`,
  `refunded: 3`.
- `licenses`: `active: 2`.
- `razorpay_webhook_events`: `completed: 75`.
- The selected isolated subscription remained `active` after the reversible
  pause/resume pair.
- No Production payment, subscription, database, migration, entitlement,
  account, or customer-data write occurred.

## Disposition

This qualifies the repaired signed webhook ingress and provider-controlled
pause/resume lifecycle path. It does not close `PLAN-WEB-014` or Gate 4:
the canonical recurring-card authorization/capture and the resulting exactly
one payment/ledger/license reconciliation remain missing. The current blocker
is the provider's Test Mode recurring-card fixture/OTP boundary, not an
unverified application webhook route.

Backlog remains **219 checked / 61 unchecked / 280 total (78.2%)**; no checkbox
changed.

Provider references:

- https://razorpay.com/docs/api/payments/subscriptions/pause-subscription/
- https://razorpay.com/docs/api/payments/subscriptions/resume-subscription/
- https://razorpay.com/docs/webhooks/replay-events
- https://github.com/razorpay/markdown-docs/blob/master/payments/payments/test-card-details.md

Secrets, bypass values, database URLs, cookies, authorization headers, raw
provider payloads, full provider identifiers, phone numbers, card values, and
OTP values are omitted.

## Continuation requalification · 2026-10-10

- Fresh Vercel configuration inspection showed the deployed Production
  checkout exposes `card` only with subscription creation disabled, while the
  isolated Preview checkout exposes `card` only with Test Mode and the
  subscription route enabled. No environment values were revealed.
- The authenticated Razorpay Test Mode webhook detail showed HTTP 200 for the
  completed `payment.failed`, `subscription.paused`, and
  `subscription.resumed` deliveries. Older HTTP 401 rows are historical
  protection failures. The Dashboard exposed no replay or charge-now control
  for the selected target; no undocumented endpoint was used.
- Read-only provider inventory returned HTTP 200 with five active
  subscriptions; one has two paid cycles and four have one. The isolated
  database currently reports `active: 5`, `cancelled: 8`, `pending: 23`,
  payment aggregates `captured: 3`, `failed: 4`, `partially_refunded: 1`,
  `refunded: 3`, two active licenses, and 75 completed webhook events.
- The additional pending rows are failed/unfinished Test Mode attempts and do
  not establish authorization, capture, entitlement, or renewal evidence.

The external blocker is now precise: the account is authenticated and the
isolated route is reachable, but Razorpay has not exposed a supported
recurring-card tokenization/authorization fixture or an official replay/
charge control that can produce the missing provider-backed capture. Owner:
Verglos release owner with the Razorpay Test Mode account owner. Review by
2026-10-17. Safe next action: obtain provider confirmation or a supported
Test Mode recurring-card fixture/control, then run only the missing
authorization and reconciliation cases. Gate 4 and `PLAN-WEB-014` remain
open; no checkbox changed.
