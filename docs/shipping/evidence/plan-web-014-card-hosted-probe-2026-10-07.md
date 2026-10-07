# PLAN-WEB-014 hosted card probe and local method configuration — 2026-10-07

## Scope

- Web PR #149 exact head `b73fdd3beba513c0f9fc69a38c2fc69319ff9474`.
- Razorpay Test Mode credentials only; values were read from the local
  `.env.test.local` file and were not printed or retained.
- The local test environment now declares the observed hosted method set in
  the ignored `RAZORPAY_ENABLED_PAYMENT_METHODS` setting:
  `upi,card,emi,netbanking,wallet,paylater,upi_qr`.
- The existing Chrome CDP `about:blank` target was reused. No new browser tab
  was opened, and the target was restored to `about:blank` after the probe.

## Results

- The provider-hosted iframe rendered UPI, Cards, EMI, Netbanking, Wallet, Pay
  Later, and UPI QR. QR remained an optional provider method; the hosted order
  projection exposed the six implemented non-QR methods.
- A bounded Cards path reached the card form using synthetic sandbox contact
  and provider test-card data. The flow reached the provider's save-card
  choice. A later inspection script failed while collecting the final screen,
  so this is not success, capture, refund, webhook, or entitlement evidence.
- Focused Web payment/runtime contracts remained **47/47 passed**, with zero
  failures and zero skips.

## Netbanking follow-up

A second bounded Test Mode order reached the Netbanking bank-selection screen
and exposed the provider bank list. Selecting a bank did not advance to a
mock-bank success/failure control during the probe; no callback or provider
lifecycle result was observed. The existing blank CDP target was restored.

This remains method-display and navigation evidence only. It does not qualify
Netbanking success, capture, refund, webhook delivery, or entitlement.

## Boundary

No payment identifier, card/contact value, response body, cookie, credential,
capture, refund, webhook, entitlement, database, deployment, production, or
customer-state evidence was retained. The hosted method and card display
observations do not close PLAN-WEB-014 or PLAN-WEB-015. No backlog checkbox
changed.
