# Razorpay Test Mode recurring-card unblock request

Date prepared: 2026-10-10
Status: prepared privately; not sent by Codex
Owner: Verglos release owner with the Razorpay Test Mode account owner
Review date: 2026-10-17

## Request

Please provide the supported Razorpay Test Mode procedure for qualifying a
card-based subscription through hosted Checkout, including:

1. the exact Test Mode subscription-card fixture that completes saved-card
   tokenization and mandate authorization;
2. the documented OTP or mock-bank interaction for that tokenization step;
3. the supported Test Mode control for producing a recurring charge/renewal
   and its corresponding failure or halted outcome; and
4. the supported Dashboard replay procedure for an unacknowledged
   Subscription/Invoice webhook event when the webhook target is protected by
   Vercel and the endpoint returns a successful acknowledgement.

Please confirm whether the Test Mode account has the required Subscriptions,
Flash Checkout, card-tokenization, and recurring-payment capabilities enabled.

## Redacted reproduction

- Product: Verglos Pro monthly subscription.
- Environment: Razorpay Test Mode only.
- Application: isolated non-production Preview deployment.
- Database: separate isolated Neon test database with the reviewed migration
  set applied; Production is not involved.
- Webhook: isolated Preview endpoint; the current signed pause, resume, and
  failure deliveries return HTTP 200 and complete in the application.
- Checkout: server-selected canonical monthly catalog amount; hosted methods
  are restricted to Cards only.
- Test card: the official Razorpay subscription-card fixture was entered with
  a future expiry and test CVV; the card reached the saved-card
  tokenization/OTP step but did not produce a terminal authorization/capture.
- Result: the provider displayed recurring-card eligibility/tokenization/OTP
  failure; no new capture or entitlement was asserted.

## Evidence available privately

- `docs/shipping/evidence/plan-web-014-preview-webhook-bypass-pause-resume-2026-10-10.md`
- `docs/shipping/evidence/plan-web-014-preview-subscription-otp-limitation-2026-10-09.md`
- `docs/shipping/RELEASE_GATES.md`

No API keys, webhook secrets, database URLs, bypass values, cookies, payment
identifiers, card numbers, phone numbers, customer records, or raw provider
payloads are included. The request must be sent through the account owner's
authenticated Razorpay support channel, not through this repository or chat.

## Release decision while unanswered

Keep Gate 4 and `PLAN-WEB-014` open. Keep Production recurring billing,
Production payment writes, and entitlement activation fail-closed. Once the
provider supplies a supported fixture/control, rerun only the missing
authorization, renewal/failure, webhook, and payment-to-ledger-to-license
reconciliation cases and attach the redacted provider response.
