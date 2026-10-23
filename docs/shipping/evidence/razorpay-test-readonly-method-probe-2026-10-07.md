# Razorpay Test Mode read-only method probe — 2026-10-07

- **Credential boundary:** A local Test Mode key was selected only after a
  `rzp_test_` prefix check. Secret values are not recorded. No production key
  or production endpoint operation was used.
- **Request:** Read-only `GET /v1/payments?count=100` against the Razorpay API.
- **Redacted result:** one payment was returned; the observed method was
  `netbanking`, its status was `captured`, and no failed payment appeared in
  the returned page.
- **Interpretation:** This is historical observed-method evidence, not a
  complete account-enabled capability list and not a lifecycle matrix. It does
  not qualify cards, UPI intent, wallets, refunds, renewals, replay, or event
  ordering. PLAN-WEB-014/015 remain open.
- **Credential hygiene:** The local env file contains shell-unsafe syntax on a
  secret line; no file was changed. Because a shell parser warning exposed
  secret material in local command output, the Test Mode credential must be
  rotated/repaired before any further provider calls.
- **Safety:** This probe performed no order, payment, refund, subscription,
  webhook, database, deployment, migration, or production operation.

## Read-only inventory follow-up — 2026-10-07

Before freezing further use of the flagged Test Mode credential, a redacted
read-only inventory queried orders, payments, subscriptions, plans, and
webhooks. The API returned 10 orders (all `created`), 4 payments (3 `created`,
1 `captured`), 0 subscriptions, 0 plans, and 1 webhook configuration. The
webhook response did not expose an event list through this endpoint. No IDs,
amounts, headers, response bodies, or personal data were recorded.

This is an account-history snapshot, not proof that the seven application
methods are enabled, and not success/failure/capture/refund/renewal/replay/
out-of-order/entitlement acceptance. The earlier credential-hygiene finding
still governs: rotate/repair this Test Mode credential before any further
provider request. No provider write or production operation occurred.
