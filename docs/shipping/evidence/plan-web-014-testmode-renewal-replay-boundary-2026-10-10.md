# PLAN-WEB-014 Test Mode renewal trigger and replay boundary — 2026-10-10

## Provider update attempt

The preflight in
`plan-web-014-testmode-renewal-acceleration-preflight-2026-10-10.md` selected
exactly one Razorpay Test Mode active Pro/monthly subscription with two paid
cycles and an exact active row in the isolated database. One documented
`PATCH /v1/subscriptions/:id` request was attempted with only
`start_at` and `schedule_change_at: "now"` (plus `customer_notify: false`).

Razorpay returned HTTP 400 with `BAD_REQUEST_ERROR` and the message that the
subscription cannot be updated while its cycle start is in the future. The
provider did not accept the write. No database, webhook, payment, ledger,
license, entitlement, account, customer, or Production state changed.

The post-attempt read-only inventory still showed one matched active Test Mode
subscription with `paid_count=2`, `remaining_count=10`, and a future charge
schedule. The isolated row remained active Pro/monthly at canonical amount
`280943` minor units, with zero payments and zero licenses bound to that
subscription. The provider response and identifiers are not copied here.

## Provider-supported next route

Razorpay's official webhook documentation provides a Dashboard-only replay
flow for missed or unacknowledged events. Specific-event replay accepts a
Subscription or Invoice entity ID, allows selection of the configured Test
Mode Preview URL and events, and re-sends the original signed payload without
creating a new payment or other provider record. Replay is limited to events
up to seven days old and is at-least-once, so the existing idempotency path
must be verified afterward.

The authorized operator must use:

1. Razorpay Dashboard in **Test Mode** → **Developers → Webhooks**.
2. **Replay events** → **Specific events**.
3. Select **Subscription** (or the matching paid **Invoice**) and enter the
   selected entity ID from the provider dashboard.
4. Select only the isolated Preview webhook URL and the relevant paid/charge
   event; do not select the Production URL.
5. Replay once, then reconcile the isolated database read-only.

The debugging Chrome profile is currently unauthenticated at the Razorpay
login page, so no Dashboard replay was attempted from the agent. No login
secret or OTP was requested or recorded.

## Disposition

The supported API acceleration boundary is rejected by the provider. The
official Dashboard replay is the next available provider-controlled action,
subject to an authorized logged-in Razorpay Test Mode session and the event
being unacknowledged and within the seven-day replay window. This evidence
does not close Gate 4 or `PLAN-WEB-014`.

## References

- https://razorpay.com/docs/api/payments/subscriptions/
- https://razorpay.com/docs/api/payments/subscriptions/update-subscription/
- https://razorpay.com/docs/webhooks/replay-events
