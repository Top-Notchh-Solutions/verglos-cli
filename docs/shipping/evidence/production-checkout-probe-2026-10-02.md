# Production checkout probe — 2026-10-02

- Origin: `https://verglos.com`
- Page: `/checkout`
- Browser path: authenticated-session probe was attempted through browser tooling; no payment was confirmed
- Homepage response: HTTP 200
- Checkout UI rendered: yes
- Checkout create request: `POST /api/razorpay/create-qr`
- Observed response: HTTP 404 HTML document, not the JSON API contract
- Consequence: no order, payment, webhook, or license write was performed
- Billing acceptance status: open

This is deployment evidence, not a billing pass. The local Web checkout route exists and local Razorpay contract tests pass, but the currently aliased production deployment did not expose the route during this probe. Investigate deployment/source/route drift before any Test Mode payment is attempted against `verglos.com`.

