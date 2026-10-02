# Production checkout probe — 2026-10-02

- Origin: `https://verglos.com`
- Page: `/checkout`
- Browser path: authenticated Chrome session over the user's existing remote-debugging window; no payment was confirmed
- Homepage response: HTTP 200
- Checkout UI rendered: yes
- Checkout create request: `POST /api/razorpay/create-qr`
- Observed response: HTTP 503 JSON `{"error":"Plan unavailable","code":"PLAN_UNAVAILABLE"}`
- Consequence: no order, payment, webhook, or license write was performed
- Billing acceptance status: open; the route is present but the production catalog fails closed before order creation

This is deployment evidence, not a billing pass. The authenticated checkout UI and API route are reachable, but the production catalog currently refuses the Pro checkout because the plan is unavailable. No order, payment, webhook, entitlement, or license write occurred. Do not enable checkout or alter catalog pricing without an approved verified INR catalog row and the associated provider evidence.
