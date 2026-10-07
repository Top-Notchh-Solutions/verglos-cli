# PLAN-WEB-013 test-mode hosted method observation — 2026-10-07

## Scope

- Web implementation under qualification: PR #149, exact head `3f4a7aa`
- Razorpay credentials: repository `.env.test.local`, test-prefix keys only
- Browser instrument: approved Chrome CDP at `127.0.0.1:9222`
- Temporary origin: bounded localhost qualification page; no production page

## Observed hosted methods

The Razorpay hosted Checkout iframe rendered these selectable methods for the
test account/order:

- UPI
- Cards
- EMI
- Netbanking
- Wallets
- Pay Later
- UPI QR

The observation was redacted to method labels only. No cookies, authorization
headers, provider identifiers, payment credentials, response bodies, or
personal data were retained.

## Boundary and result

One catalog-amount test-mode order was created solely to render hosted Checkout.
The checkout was dismissed without submitting payment; the temporary server was
stopped and its tab target was restored to `about:blank`. No capture, refund,
webhook, entitlement, database, production, or deployment mutation occurred.

This is direct account-enabled method/display evidence for PLAN-WEB-013. It is
not lifecycle acceptance for PLAN-WEB-014: success/failure/capture/refund/
renewal/cancellation/replay/out-of-order/exactly-once ledger and entitlement
evidence remain open. UPI QR remains an optional observed method and is not the
default architecture.
