# QUAL-WEB-005 preview browser boundary — 2026-10-07

## Observation

Using the approved Chrome CDP session, the PR #153 Vercel Preview URL for
`/account/privacy` redirected to Vercel deployment authentication
(`vercel.com/login`) before the Web application loaded. The browser observed
the Vercel login page with no Verglos response body, no app console errors, and
no deletion, database, payment, or entitlement request.

The debug tab was returned to production `https://verglos.com/orgs` after the
read-only observation.

## Boundary

This is a preview access blocker, not authenticated application acceptance.
The hosted privacy E2E remains open until the protected preview can be entered
through an authorized, non-production session or an equivalent isolated test
deployment. No bypass, credential capture, or browser mutation was attempted.
