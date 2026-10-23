# Razorpay test-mode order creation — 2026-10-07

## Result

Using the repository's `.env.test.local` only, a bounded SDK call created one
Razorpay **test-mode** order for the server catalog's monthly Pro amount:

- amount: **INR 280,943 paise (₹2,809.43)**
- currency: `INR`
- provider status: `created`
- catalog cadence: monthly
- catalog plan: Pro
- qualification note: test-order-only

The command hard-failed unless both key IDs had the Razorpay test prefix. No
secret values, payment payload, or provider identifier were retained in the
private evidence. The order was not captured, paid, refunded, or attached to
an application user; no webhook, entitlement, database, browser checkout, or
production operation was performed.

This proves only that the configured test credentials can create a catalog-
amount order. It does not prove the account-enabled method list or the
success/failure/capture/refund/renewal/replay/out-of-order lifecycle required
by PLAN-WEB-014, and it does not reconcile production for PLAN-WEB-015. No
backlog checkbox is credited from this run.
