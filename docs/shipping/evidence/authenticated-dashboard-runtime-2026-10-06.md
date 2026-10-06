# Authenticated dashboard runtime boundary — 2026-10-06

## Method

Attached to the founder's existing Chrome session through the already-running
Chrome DevTools endpoint on `127.0.0.1:9222`. No new browser, credentials,
cookies, or session values were created or recorded.

## Observed deployed behavior

- `https://verglos.com/account/dashboard` redirected to `https://verglos.com/account`.
- The authenticated page rendered the legacy account navigation: Overview,
  Monitoring, Alerts, Score history, Activations, and Docs.
- The session displayed the authorized email only in the browser; it is not
  copied into this artifact.
- The account was shown as Free with no license key and no organization slug.
- No `/orgs/[organizationSlug]/*` navigation was exposed from this account.

## Qualification boundary

This confirms an authenticated runtime is available, but it does **not** prove
the PRO organization dashboard, organization membership, authenticated dashboard
accessibility, screen-reader behavior, large-dataset behavior, or field CWV.
QUAL-WEB-006 remains open. No production write, checkout, entitlement change,
or database operation occurred.
