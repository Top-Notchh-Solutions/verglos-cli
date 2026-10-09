# Gate 4 isolated Test Mode subscription cancellation — 2026-10-09

## Scope and isolation

This is a bounded non-Production qualification of the Web subscription
creation/status and cancellation path. The local Web process used
`TEST_DATABASE_URL` as `DATABASE_URL`, `VERCEL_ENV=preview`, an explicit
isolated-database marker, four configured hosted methods
(`card,netbanking,wallet,emi`), Razorpay Test Mode credentials, and a synthetic
local Preview fixture identity. No Production environment, database, plan,
payment, entitlement, account, or customer data was used.

The deployed Preview request could not be used because Vercel Authentication
returned HTTP 401 before the application route and did not allow the Preview
fixture header to reach the function. No protection bypass was attempted.

## Provider preflight

The redacted read-only Razorpay Test Mode inventory recheck returned:

- plans endpoint: HTTP **200**, **2** items;
- subscriptions endpoint: HTTP **200**, **9** items.

The earlier HTTP 401 credential blocker is therefore superseded for this
isolated credential set. Values and provider identifiers are intentionally not
stored in this evidence.

## Qualification result

For controlled isolated fixtures:

- the server-catalog-bound subscription route returned HTTP **200** with
  `testMode=true`, monthly cadence, and the canonical catalog version;
- the owner-bound status route returned HTTP **202** with `processing` and a
  pending subscription before payment;
- Razorpay Test Mode cancellation returned HTTP **200** and the provider
  subscription state became `cancelled`;
- a signed `subscription.cancelled` event reconciled through the local
  isolated webhook handler with HTTP **200**;
- replaying the same event returned HTTP **200** with duplicate detection;
- a later-delivered event with an older provider timestamp could not resurrect
  the cancelled subscription; the final owner-bound status projection remained
  `subscriptionStatus=cancelled` and HTTP **202** processing because no paid
  charge existed.

## Boundary and remaining Gate 4 work

This advances the real provider subscription creation/cancellation slice and
local signed-webhook ordering evidence. It does not close Gate 4: provider
authorization/capture, renewal/charge, provider-generated failure/expiry,
refund, hosted Preview delivery, and complete provider/ledger/entitlement
reconciliation are still open. The local signed webhook was an isolated
handler delivery, not proof that Razorpay reached the protected deployed
Preview endpoint.

No backlog checkbox changed. The score remains **219 checked / 61 unchecked /
280 total (78.2%)**.

