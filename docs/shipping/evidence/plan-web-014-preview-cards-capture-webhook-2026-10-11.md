# PLAN-WEB-014 Preview Cards capture and signed webhook qualification — 2026-10-11

## Scope

This private evidence records the isolated Preview Cards-only prepaid run after
the webhook target was enabled before payment. It does not authorize
Production payment, database, entitlement, or account writes.

- Environment: isolated Vercel Preview
- Provider: Razorpay Test Mode
- Billing: one-time prepaid fixed-term Pro access with manual renewal
- Hosted method: Cards only
- Webhook events configured: `payment.captured`, `payment.failed`,
  `refund.processed`

## Observed lifecycle

1. Preview created the canonical server-owned monthly order and opened hosted
   Checkout with Cards only.
2. The official Razorpay Test Mode domestic card fixture completed the card and
   documented mock OTP flow.
3. Razorpay showed the payment as Captured. The application received the
   signed webhook; the Preview webhook route returned HTTP 200.
4. The read-only order-status route returned HTTP 200 and the browser reached
   the Pro activation screen.
5. A full refund was issued from the Razorpay Test Mode dashboard. The provider
   currently reports the refund as processing; a `refund.processed` delivery
   and post-refund entitlement revocation have not yet been observed.

## Result

- **Proven:** order creation, Cards-only hosted payment, provider capture,
  signed capture webhook delivery, HTTP 200 handler response, order-status
  reconciliation, and Pro activation.
- **Not proven:** processed-refund delivery/revocation, failed payment
  recovery, expiry, second manual-renewal order, replay/out-of-order handling,
  timeout/retry, and exactly-once behavior across the complete hosted matrix.
- **Safety:** Test Mode only; no Production payment, database edit, synthetic
  provider event, guessed OTP, or manual entitlement grant.

## Disposition

Keep `PLAN-WEB-014`, `PLAN-WEB-015`, and Gate 4 open. The run supplies valid
capture/webhook evidence but not the complete payment lifecycle required by
the backlog item.
