# CLI API-origin hardening and Test Mode renewal boundary — 2026-10-09

## Scope

This batch covered the next dependency-ready backend hardening item while
continuing the Gate 4 and Production read-only tracks. It did not activate
Production billing, change a database, create a provider object, or change an
entitlement.

## CLI implementation

CLI commit `439b782d` adds `getTrustedApiOrigin` and routes every CLI request
that can use the configured API base through it:

- license validation and status;
- unlock-token refresh;
- entitlement capability fetch;
- monitor registration/status/unregister/test-alert;
- device-code login; and
- anonymous scan telemetry.

The resolver accepts a bare HTTPS origin and canonicalizes a trailing slash.
It rejects HTTP, paths, query strings, fragments, userinfo, empty values,
malformed values, and non-string values. Invalid saved configuration fails
closed before a request is created, so a stored license bearer is not sent to
an unsafe destination. Custom/self-hosted HTTPS origins remain supported when
they satisfy the origin contract.

## Verification

- Focused CLI security/entitlement/monitor tests: **17/17 passed**.
- CLI typecheck: passed.
- CLI package build: passed.
- `git diff --check`: passed.
- The new regression confirms an unsafe saved HTTP base causes **zero fetch
  calls** from the authorized monitor path.
- The complete CLI test command reached **27 passed / 1 failed**. The one
  failure is the pre-existing `src/fix.test.ts` startup import failure because
  the unrelated, pre-existing untracked
  `packages/shared/src/spec-validation-corpus.test.ts` imports five absent
  importer modules. The shared build/typecheck shows the same unrelated
  missing-module errors. No user untracked file was changed.

## Test Mode provider observation

The redacted read-only Razorpay Test Mode inventory returned HTTP 200 with 21
subscriptions: 5 active, 7 cancelled, and 9 created. No active or pending
subscription had `charge_at` due at observation time; the active records were
monthly with a future next billing date. No provider write was attempted.

The official Test Mode material documents mock payment success/failure and
plan-period creation, including weekly plans and a seven-day minimum for daily
plans, but does not document an immediate renewal/expiry trigger. Therefore
the missing provider-generated renewal/expiry evidence remains an external
Razorpay qualification limitation, not an application-path failure and not
something to fabricate with synthetic webhook events.

Provider references: [Create a Plan](https://razorpay.com/docs/api/payments/subscriptions/create-plan/?preferred-country=IN)
and [Test App / Test Mode integration](https://razorpay.com/docs/server-integration/python/test-app/).

## Production read-only pass

Against `https://verglos.com`, the bounded public smoke returned:

- `/`: HTTP 200;
- `/checkout`: HTTP 200;
- `GET /api/heartbeat`: HTTP 405;
- `GET /api/razorpay/create-subscription`: HTTP 405; and
- no `Test Mode`, `RAZORPAY TEST MODE`, or `rzp_test_` marker in the returned
  public responses.

No Production plan IDs, provider/payment calls, database or migration writes,
entitlement changes, account changes, or customer-data mutations occurred.

## Disposition

Gate 4 and `PLAN-WEB-011`, `PLAN-WEB-012`, `PLAN-WEB-014`, and `PLAN-WEB-015`
remain open for provider-generated renewal, expiry, failure/halted behavior,
subscription refunds, external replay/out-of-order delivery, timeout/retry,
exactly-once reconciliation, and complete enabled-method evidence. The CLI
security hardening is progress toward the backend/security surface but does
not close a checkbox. Current score remains **219 checked / 61 unchecked / 280
total (78.2%)**.
