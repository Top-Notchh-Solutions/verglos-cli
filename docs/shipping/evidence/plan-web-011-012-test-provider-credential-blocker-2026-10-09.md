# Test Mode provider credential blocker · 2026-10-09

## Verification

- A read-only Razorpay Test Mode `plans.all` request was attempted using the
  local Web `.env.test.local` credential pair. Razorpay returned HTTP **401**
  (`BAD_REQUEST_ERROR`); no plan, subscription, payment, webhook, or other
  provider write occurred.
- The local Test Mode key ID is configured and has the `rzp_test_` prefix, but
  its identifier does not match the current Test Mode key shown in the
  authenticated Razorpay dashboard. The dashboard shows the existing key as
  generated recently and its secret is masked.
- No recurring plan-ID variables are configured in the local test, gates, or
  production environment files. The code therefore correctly keeps recurring
  checkout disabled until both canonical Test Mode plan IDs and a valid count
  are configured.

## Disposition

This is an external credential-rotation blocker for real isolated Razorpay
Test Mode subscription qualification, not a Web code failure. The dashboard's
regeneration flow requires an explicit old-key expiry choice. The key must be
rotated by the authorized account operator and then placed only in the
isolated Test/Preview configuration; no secret belongs in chat, source, or the
private evidence record.

No Production database, payment, provider, environment, account, customer, or
deployment state changed. Backlog score remains **219 checked / 61 unchecked /
280 total (78.2%)**; no checkbox changed.
