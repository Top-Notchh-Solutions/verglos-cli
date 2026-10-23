# Razorpay sandbox read-only connectivity — 2026-10-06

Using the locally configured Razorpay Test Mode credentials (values are not
recorded), an authenticated read-only request to
`GET https://api.razorpay.com/v1/payments?count=1` returned HTTP 200 with the
normal `count`, `entity`, and `items` response shape. This verifies credential
format, network reachability, and provider authentication only.

The QR listing probe was not used as evidence: Razorpay returned HTTP 404 for
that endpoint. No order, QR, payment, webhook, entitlement, database write, or
production operation was created by this check. PLAN-WEB-011/012 therefore
remain open pending the full catalog-bound checkout and lifecycle evidence.
