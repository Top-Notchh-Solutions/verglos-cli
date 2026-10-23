# PLAN-WEB-014 local Preview attempt — authentication gate

- **Source:** Web merged main after PR #156 (`f75609f14a8c6b385663b768226cf2c0586c0812`)
- **Surface:** disposable local Preview-like server at `localhost:3007`
- **Database:** dedicated local Docker PostgreSQL container on port `55432`
- **Provider:** Razorpay Test Mode configuration from the local test environment

## Observed

- `/checkout` returned HTTP 200.
- The UI displayed the Test Mode notice and the configured hosted methods:
  UPI, Cards, Netbanking, Wallets, EMI, and Pay Later.
- A request from `127.0.0.1` was rejected by the intended same-origin guard;
  navigating through `localhost` reached the route correctly.
- The correctly-originated order attempt returned `401 Unauthorized` because
  this local server had no Clerk test session.
- No Razorpay order, payment, webhook, entitlement, or user row was created.
- The local database was migrated through the reviewed empty-database bootstrap
  path and the local server/container were stopped after the attempt.

## Disposition

This validates the local rendering/configuration path only. It is not payment
lifecycle evidence and does not close PLAN-WEB-014 or PLAN-WEB-015. A valid
isolated Clerk test session (or an authorized test account configured for the
isolated environment) is required before repeating the authenticated flow.
