# PLAN-WEB-014 — Preview official recurring-card fixture boundary — 2026-10-10

Date: 2026-10-10 IST  
Status: provider-boundary evidence; no acceptance claim

## Scope and isolation

This was a bounded Razorpay Test Mode run against the isolated Preview
deployment. The Preview database and provider account were used only for this
fixture. No Production payment, Production database, entitlement, account,
organization, or customer-data write occurred.

- Web head: `e310c57`.
- Preview runtime: Test Mode, isolated database, Cards-only application
  catalog, and the protected Preview fixture-auth seam.
- The authenticated organization read returned HTTP 200 with one isolated test
  organization, confirming that the deployed Preview auth/database path was
  reachable.

## Subscription-create and hosted-provider result

1. The authenticated Preview route created one canonical Pro monthly Test Mode
   subscription. The response was HTTP 200 with `testMode: true`, catalog
   version `2026-10-02.0`, cadence `monthly`, and the provider subscription
   identifier. The corresponding operation was isolated to Preview.
2. The official Razorpay domestic Visa Test Mode fixture
   (`4100 2800 0000 1007`) was entered with a future expiry and random CVV, as
   documented by Razorpay. The recurring checkout reached the provider's
   card-saving/mandate step.
3. Razorpay exposed its supported `Skip OTP` control. Using that control did
   not authorize the mandate. The hosted checkout returned the terminal
   provider message: **“This card is not eligible for recurring payments.”**
4. A read-only provider subscription query returned `status=created`,
   `paid_count=0`, and the configured total count. A read-only payment
   inventory contained no payment linked to this subscription.
5. The exact isolated Test Mode subscription was cancelled through the
   provider's documented cancellation endpoint. Razorpay returned HTTP 200
   with `status=cancelled` and `paid_count=0`.

Provider references:

- [Razorpay Test Mode cards and simulated payment flow](https://razorpay.com/docs/payments/server-integration/python/integration-steps)
- [Razorpay saved-card/tokenization feature boundary](https://razorpay.com/docs/payments/payment-methods/cards/features/saved-cards/)

## Acceptance impact

This confirms the current Preview route, canonical price binding, provider
subscription creation, hosted recurring-card boundary, no-payment outcome,
and cleanup path. It does **not** close `PLAN-WEB-014` or Gate 4. The missing
artifact remains a provider-supported recurring-card/tokenization fixture or
renewal/delivery control, followed by signed payment-to-ledger-to-license
reconciliation and the remaining renewal, failure/expiry, refund replay/order,
out-of-order, timeout/retry, and exactly-once cases.

No OTP was guessed, no undocumented endpoint was called, no synthetic webhook
was posted, and no application row was edited manually. Score remains
**223 checked / 57 unchecked / 280 total (79.6%)**.
