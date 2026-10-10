# PLAN-WEB-014 webhook-ingress preflight — 2026-10-10

## Purpose

Unblock the missing provider-signed Test Mode webhook delivery into isolated
Preview. Current read-only probes show the application middleware allows
`/api/webhooks/razorpay`, but Vercel Deployment Protection redirects the
Preview deployment before the route executes. Razorpay cannot send a browser
SSO session, so the provider-paid invoices cannot reconcile to the isolated
database.

## Bounded operation

- Generate or use one fresh Vercel Protection Bypass for Automation secret.
- Append it only as the documented `x-vercel-protection-bypass` query
  parameter on one Razorpay **Test Mode** webhook URL.
- Preserve the Razorpay HMAC webhook secret as the application-level
  authentication boundary.
- Exercise only an isolated Test Mode subscription/webhook lifecycle that is
  bound to the isolated Preview database.
- Keep the Production webhook disabled and do not place the bypass parameter
  on `https://verglos.com`.

The bypass value must never be printed, committed, placed in public evidence,
or pasted into chat. Existing exposed/transient bypass values are not reused.

## Preflight checks

- [x] Razorpay credentials are Test Mode and read-only inventory returned HTTP
      200.
- [x] The isolated Preview database and migration baseline are already
      qualified.
- [x] The webhook route verifies the Razorpay signature before application
      state changes.
- [x] The current Web branch contains the invoice-paid, subscription
      lifecycle, replay, refund, and tenant-binding guards.
- [x] Current active item is `PLAN-WEB-014`; no other backlog item is being
      advanced.
- [x] Current score is 219 checked / 61 unchecked / 280 total (78.2%).
- [x] Fresh bypass secret generated and retained only in process memory or a
      provider/Vercel secret store.
- [x] One Test Mode webhook URL updated and confirmed reachable without SSO.
- [x] Signed provider event reaches the isolated endpoint and reconciles to
      exactly one application event/payment/ledger/license projection.

## Recovery and stop conditions

Before the write, retain the selected webhook's original URL and event
configuration privately. If the update or delivery probe is unsuccessful,
restore that original URL and record the provider response. If any target is
Production, any database is not isolated, the signature does not verify, or
the provider operation would require a real-money/live-mode action, stop
immediately.

No checkbox closes from this preflight. Gate 4 and `PLAN-WEB-014` remain open
until the signed event and full reconciliation evidence exist.

## Release decision

This operation is permitted only as isolated Test Mode qualification. It does
not authorize Production payment/database/entitlement writes, direct database
edits, synthetic webhook payloads, guessed OTPs, or a claim that provider API
state alone proves payment acceptance.
