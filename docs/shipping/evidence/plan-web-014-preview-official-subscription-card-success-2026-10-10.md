# PLAN-WEB-014 · isolated Test Mode subscription-card success

Date: 2026-10-10
Environment: Razorpay Test Mode with the isolated Preview database
Scope: one canonical Verglos Pro monthly subscription attempt
Status: partial Gate 4 evidence; not final acceptance

## Result

The official Razorpay subscription-card fixture completed the provider-hosted
Test Mode authorization flow for a subscription created through the isolated
Preview application path. The provider mock payment page displayed a
successful capture after the documented random four-digit payment OTP. No real
money, Production account, Production database, or live customer was
involved.

The server-selected canonical amount was INR 280,943 minor units (₹2,809.43)
and the application catalog remained Pro/monthly. The card number, OTP,
provider identifiers, customer data, cookies, secrets, and raw payloads are
intentionally omitted.

## Read-only reconciliation

The isolated database changed from the preceding recorded aggregate by exactly
one captured subscription payment, one active subscription, one active Pro
license, and five completed webhook events. The new row binding was verified
with redacted hashes:

- subscription status `active`, plan `pro`, cadence `monthly`, currency `INR`;
- captured payment source `subscription`, same canonical amount and currency;
- payment `license_id` matched the active license bound to the subscription;
- subscription, payment, and license rows shared the same redacted tenant/user
  binding;
- completed event types were `payment.authorized`, `payment.captured`,
  `subscription.authenticated`, `subscription.activated`, and
  `subscription.charged`;
- the five recent event IDs and five payload digests were all distinct.

The resulting aggregate was four captured, four failed, one partially refunded,
and three refunded payments; six active, eight cancelled, and 22 pending
subscriptions; three active licenses; and 80 completed webhook events.

## Boundary and remaining work

This proves one provider authorization/capture and the corresponding signed
webhook-to-payment-to-license path in isolated Test Mode. It does not prove a
provider-generated renewal cycle, failure/expiry, refund replay/order,
out-of-order delivery, timeout/retry, or the complete final customer-facing
Preview acceptance matrix. `PLAN-WEB-014` and Gate 4 therefore remain open.

No direct database edit, synthetic provider event, manual entitlement grant,
Production write, or Production configuration change occurred.

## Sources

- Official Razorpay Test Card Details, including the subscription fixture and
  Test Mode mock-bank behavior: https://github.com/razorpay/markdown-docs/blob/master/payments/payments/test-card-details.md
- Private execution ledger and backlog contain the surrounding lifecycle and
  release decision.
