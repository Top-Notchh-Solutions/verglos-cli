# PLAN-WEB-014 Preview authentication fixture — Web PR #157

- **Public repository:** `anuragyadav-git/verglos-web`
- **Merged commit:** `51bb6fe701b65ffcb2a322e1ff5d67eeb99df3fe`
- **Pull request:** #157, “Add gated Preview payment test identity”
- **Scope:** Internal Preview qualification only.

## Implementation

The Web app now accepts an explicit fixture identity only when all of these
conditions hold:

- the runtime is non-production and `VERCEL_ENV=preview`;
- a bounded fixture user ID and email are configured;
- a 32+ byte operator secret is configured; and
- the request carries the matching private fixture header.

Production never consults this path. The comparison is constant-time, and
existing Clerk authentication and test-provider seams remain authoritative in
their normal paths.

## Verification

- Focused auth/payment tests: **27 pass, 4 environment-gated skips**.
- Hosted Web verification: typecheck, serial suite, negative-boundary,
  truth-registry, database/migration checks, build, public-boundary,
  dependency/license/security checks, and Vercel Preview all passed.
- Browser run against an isolated local PostgreSQL database rendered the Test
  Mode checkout and reached the real create-order route through the fixture.
- Razorpay Test Mode returned the app’s bounded provider-failure response;
  local counts remained zero for users, licenses, payments, subscriptions, and
  webhook events.

## Disposition

This removes the local authentication-session blocker for a later isolated
Preview run, but it is not payment lifecycle evidence. No provider order,
payment, webhook, entitlement, production database, migration, or deployment
write occurred. PLAN-WEB-014/015 remain open pending repaired Test Mode
provider credentials and the required lifecycle matrix.
