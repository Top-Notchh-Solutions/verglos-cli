# PLAN-WEB-014 Test Mode hosted-method display probe · 2026-10-07

- **Scope:** Bounded provider-only Razorpay Test Mode probe using the isolated
  test credential pair. This was not the authenticated Verglos order route and
  must not be treated as app payment or entitlement evidence.
- **Guard:** The configured key passed the Test Mode prefix guard. One Test
  Mode order was created with the canonical Pro monthly amount in INR and was
  observed in the provider's `created` state. No identifier, receipt, secret,
  cookie, session URL, or request body is retained here.
- **Rendered methods:** Hosted Checkout exposed UPI, Cards, EMI, Netbanking,
  Wallet, Pay Later, and the optional UPI QR surface. This confirms rendered
  method presentation for this isolated provider session only; it does not
  prove account approval or method availability in production.
- **Attempted flow:** UPI reached its QR/contact surface, but synthetic contact
  input was rejected. The probe did not reach a provider success/failure
  control. No capture, refund, callback, webhook, entitlement, or Verglos
  ledger result was observed.
- **Browser boundary:** The existing `about:blank` CDP target was reused; no
  new page was intentionally opened. Provider iframes were removed by
  navigating that same target back to `about:blank`. No production page,
  database, deployment, or live-payment operation was used.
- **Disposition:** PLAN-WEB-014/015 remain open for authenticated app-route
  evidence, all required provider lifecycle outcomes, signed webhook and
  ledger reconciliation, entitlement exactly-once behavior, and approved
  non-production runtime/production preflight. No backlog checkbox changed.
