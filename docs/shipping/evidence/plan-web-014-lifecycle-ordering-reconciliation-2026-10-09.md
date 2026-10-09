# PLAN-WEB-014 lifecycle ordering and isolated reconciliation · 2026-10-09

## Implementation

Web commit `6f932d4` adds a lifecycle transition guard so a later
`subscription.authenticated` observation cannot regress an already advanced
subscription projection. Valid `authenticated → active` and `active → pending`
transitions remain accepted; older and same-time regressive observations remain
ignored. Focused checkout/origin/route/webhook/lifecycle tests passed **38/38**,
typecheck passed, and the 47-page production build passed.

## Fresh hosted Test Mode lifecycle

Using the isolated Preview/Test Mode setup and canonical monthly Pro catalog
(`2026-10-02.0`, INR, 30 days, minor amount `280943`), a fresh hosted card
authorization completed through Razorpay's Test Mode mock-bank success path.
The provider returned `active`; the exact isolated row was bound to the same
provider identity and reported `active`; the commercial binding matched; a
period end was present; one captured subscription payment existed; and the Pro
license was active with an expiry. No identifier, card data, or customer PII is
stored in this record.

The same isolated provider subscription was cancelled through Razorpay Test
Mode. The provider cancellation returned HTTP 200, the isolated ledger row
became `cancelled`, the captured payment remained present, and already-paid
license time remained active. No direct database edit was used.

## Reconciliation replay

The current provider inventory was reconciled against the isolated ledger by
posting state-bound, HMAC-signed lifecycle observations through the local
webhook route. This repaired five older provider-`active` rows that had been
projected as `authenticated` and one provider-`cancelled` row projected as
`pending`. The resulting redacted aggregate binding was:

- provider `active` → isolated `active`: **5**;
- provider `cancelled` → isolated `cancelled`: **7**;
- provider `created` → isolated `pending`: **9**.

This replay proves the application reconciliation path and the ordering guard;
it is not claimed as provider-generated renewal, expiry, or external webhook
delivery evidence. The fresh hosted success and provider cancellation above
are real Test Mode provider operations.

## Production boundary

The corrected Web source is deployed as Vercel Production deployment
`dpl_CvNvt9YEQLMhnEB8htL7eiCocbmG`, READY and aliased to `https://verglos.com`.
Remote runtime-config/build validation and read-only smoke passed. Production
checkout contains no Test Mode marker. No Production plan IDs, Test Mode
values, provider/payment calls, database writes, migrations, entitlement
changes, account changes, or customer-data mutations occurred.

## Disposition

This advances `PLAN-WEB-011`, `PLAN-WEB-012`, `PLAN-WEB-014`, `PLAN-WEB-015`,
and Gate 4, but does not close them. Provider-generated renewal/charge,
expiry, subscription failure, subscription refund, duplicate/replay and
out-of-order provider delivery, timeout/retry, exactly-once full matrix, and
complete enabled-method evidence remain required. The live score remains
**219 checked / 61 unchecked / 280 total (78.2%)**.
