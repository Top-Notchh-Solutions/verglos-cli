# CLI full qualification and Production smoke recheck

## CLI qualification

- Source: local CLI `main` at `d0a3b217`.
- `CI=1 pnpm test`: Turbo completed successfully; package test output was
  **103 pass / 0 fail** (scanner 58, entitlement 8, CLI 37). Turbo reported
  all eight test/build tasks successful; cached logs were replayed for tasks
  already keyed to this exact source state.
- `CI=1 pnpm typecheck`: **11/11** Turbo tasks successful.
- `CI=1 pnpm build`: **6/6** Turbo tasks successful.
- The non-cached focused current-head qualification separately passed **17/17**
  for API-origin, monitor, and standards-validation behavior.

## Production read-only smoke

Against the public `https://verglos.com` alias:

- `/`, `/checkout`, and `/docs`: HTTP **200**.
- HSTS: present on all three responses.
- Checkout response: no Test Mode label, Razorpay test-key marker, Test Mode
  plan marker, Preview isolation marker, or test-database marker.
- `/checkout` shows the canonical monthly amount and the four configured
  hosted methods (`Cards`, `Netbanking`, `Wallets`, `EMI`).
- Unauthenticated `GET /api/razorpay/create-subscription`: HTTP **405**.

No response body, cookie, authorization header, payment identifier, database
URL, or secret was retained. This was HTTP/read-only verification only.

## Acceptance boundary and score

The CLI result strengthens code-side evidence for the API-origin,
validation/importer, distribution, and qualification surfaces. It does not
close trusted publishing, independent AppSec, legal, customer, provider
lifecycle, Production billing/database, or final POC gates. Production smoke
does not prove payment or entitlement reconciliation. No checkbox changed.

No Production, provider, database, migration, payment, entitlement, account,
customer, or manual-row write occurred. Score remains **219 checked / 61
unchecked / 280 total (78.2%)**.

