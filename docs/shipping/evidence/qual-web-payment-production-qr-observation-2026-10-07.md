# Production payment-surface observation · 2026-10-07

- **Surface:** Read-only Chrome DevTools observation of
  `https://verglos.com/checkout`.
- **Rendered state:** HTTP 200, clean console, Pro monthly catalog displayed as
  INR `2,809.43` per month, explanatory copy says payment is via UPI, and the
  only payment action is `Show UPI QR code`. No cards, netbanking, wallets, or
  hosted order-method selector appeared in the rendered surface.
- **Network boundary:** The page loaded its document and static resources only;
  no create-order, create-QR, order-status, payment, webhook, or entitlement
  mutation request was made. No cookies, headers, response bodies, payment
  identifiers, or identity data were retained.
- **Decision:** This reconfirms that production still exposes the legacy QR
  path and that Web PR #149 has not been deployed there. Do not click, scan,
  pay, or treat this surface as test-mode qualification. PLAN-WEB-011/012/013/
  014/015 remain open; no production operation occurred.
