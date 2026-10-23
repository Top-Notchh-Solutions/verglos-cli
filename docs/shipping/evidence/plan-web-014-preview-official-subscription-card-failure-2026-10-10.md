# PLAN-WEB-014 · isolated Test Mode subscription-card failure

Date: 2026-10-10
Environment: Razorpay Test Mode with the isolated Preview database
Scope: one canonical Verglos Pro monthly subscription failure attempt
Status: partial Gate 4 evidence; not final acceptance

## Result

The official Razorpay Test Mode subscription-card failure fixture was run
against a subscription created through the isolated Preview application path.
The provider delivered a signed `payment.failed` webhook and the application
completed it. The hosted provider UI stopped at its Test Mode OTP/tokenization
boundary; no OTP was guessed or entered. No real money, Production account,
Production database, or live customer was involved.

The server-selected canonical amount was INR 280,943 minor units (₹2,809.43)
and the application catalog remained Pro/monthly. Card values, OTPs, provider
identifiers, customer data, cookies, secrets, and raw payloads are intentionally
omitted.

## Read-only reconciliation

After the attempt, the isolated database showed:

- one new `billing_subscriptions` row in `pending` state;
- one new `billing_payments` row in `failed` state;
- the failed payment had no `license_id` and no entitlement grant;
- one completed `payment.failed` webhook event;
- the recent webhook identity count was one event ID and one payload digest;
- active license count remained three.

The aggregate payment state was four captured, five failed, one partially
refunded, and three refunded payments. Subscription state was six active,
eight cancelled, and 23 pending. These are read-only aggregate checks; no
database row was edited.

## Disposition

This proves the hosted failure projection and no-grant boundary for one
canonical recurring-card attempt. It does not prove provider-generated
renewal, expiry, refund replay/order, out-of-order delivery, timeout/retry, or
the complete final hosted Preview acceptance matrix. `PLAN-WEB-014` and Gate 4
therefore remain open.

No synthetic provider event, manual entitlement grant, Production write, or
Production configuration change occurred.

## Source

- Official Razorpay Test Card Details, including Test Mode failure behavior:
  https://github.com/razorpay/markdown-docs/blob/master/payments/payments/test-card-details.md
