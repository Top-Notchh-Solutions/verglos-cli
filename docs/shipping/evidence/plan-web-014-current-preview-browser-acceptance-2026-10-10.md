# PLAN-WEB-014 · current protected Preview browser revalidation

Date: 2026-10-10
Environment: current READY Vercel Preview deployment for Web `445d8ed`
Status: browser-render evidence; not complete payment acceptance

## Result

Using the existing authenticated Chrome DevTools session and the project’s
existing Vercel Protection Bypass configuration, the current READY Preview
deployment was opened directly. The browser-rendered `/checkout` page showed:

- Razorpay Test Mode notice;
- canonical Pro monthly offer;
- exactly one hosted method: **Cards**;
- no UPI/QR, Netbanking, Wallet, EMI, Pay Later, or eMandate label.

The same browser page’s server response reported HTTP 200, catalog
`2026-10-02.0`, `testMode: true`, and `subscriptionEnabled: true`.

The previously observed four-method page belonged to an older authorized
webhook target and is stale deployment state; it was not used as current
acceptance evidence.

## Code-side regression evidence

Against disposable local PostgreSQL 15 Docker state:

- payment webhook integration: **5/5 passed**;
- combined route/webhook/lifecycle suite: **33/33 passed**.

These cases cover replay/idempotency, refund monotonicity, failed-payment
no-grant behavior, invoice binding, expiry projection, lifecycle ordering,
and retry semantics.

## Boundary

This record proves current protected Preview rendering and code-side
reconciliation behavior. It does not claim a provider-generated renewal,
provider-dashboard replay/out-of-order delivery, or timeout/retry from a real
provider delivery. No synthetic provider event, manual database edit,
Production payment write, Production database write, entitlement write, or
customer-data mutation occurred.

## Disposition

The current browser-render portion is satisfied. `PLAN-WEB-014` and Gate 4
remain open because provider renewal and provider replay/out-of-order evidence
are still missing; the backlog score remains **219 checked / 61 unchecked /
280 total (78.2%)**.

Deployment bypass values, secrets, database URLs, cookies, authorization
headers, provider identifiers, personal data, and raw payloads are omitted.
