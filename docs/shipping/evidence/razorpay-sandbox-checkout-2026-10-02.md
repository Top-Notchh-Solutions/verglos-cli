# Razorpay sandbox checkout evidence — 2026-10-02

- Environment: Razorpay Test Mode; local variables loaded from `verglos-web/.env.test.local`; no values recorded.
- Conversion used: existing configured monthly anchor `$29 → ₹2,809.43` (`280943` paise). Annual mathematical conversion from `$290` at the same fixed anchor is `₹28,094.30` (`2809430` paise), but it was not enabled in the production catalog.
- Provider order: `order_TixO0lU5jqQIui`.
- Provider payment: `pay_TixQnWornJ3Yl1`; status `captured`; amount `280943` paise; currency `INR`; method `netbanking`.
- Browser path: existing Chrome remote-debugging window, Razorpay Test Mode hosted checkout, mock bank `Success` action. The provider displayed `PAYMENT SUCCESSFUL`.
- QR probe: a Test Mode QR was created and then closed (`qr_TixNXfGSuVHKWy`). Razorpay Test Mode's mock success flow is exposed through Standard Checkout/mock bank, not a real UPI QR scan; this QR was not left active.
- Webhook binding harness: a signed `qr_code.credited` payload using the captured sandbox payment, the INR amount, 30-day snapshot, and a valid test signing secret was passed to `handleRazorpayWebhook`. First delivery returned 200 and invoked exactly one credit; replay returned 200 with `duplicate: true`; `credits=1`, `completed=1`, `released=0`.
- Existing focused suite: 15 pass, 2 environment-gated PostgreSQL skips, 0 failures. It covers failed payment, refund identity, replay/conflict, malformed signature/payload, and lifecycle ordering contracts.

## Boundary

This proves the Razorpay Test Mode provider checkout and the signed/idempotent webhook decision path. It does **not** prove a hosted production entitlement grant: the production catalog remains deliberately unverified/closed and the sandbox order was intentionally created outside the production user/database route. No production payment, entitlement, license, database write, migration, or live billing enablement occurred.
