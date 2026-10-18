# TEAM-CLI-001 hosted CLI-auth entitlement recheck — 2026-10-18

## Scope

This was a read-only recheck of the hosted CLI device-code boundary using the
existing authenticated Verglos Chrome page 3. No new window or tab was opened;
the page was restored to `https://verglos.com/account` afterward. The device
code, verification secret material, cookies, and any credential response were
not recorded.

## Observed flow

1. The public device-flow start endpoint returned a bounded verification URL,
   short user-code, expiry, and polling interval.
2. Opening that verification URL in the existing authenticated owner session
   redirected to the hosted checkout route because the session had no active
   license. The checkout page showed the Pro purchase flow; no payment control
   was submitted.
3. No `/api/v1/cli-auth/authorize` success was produced and no license key was
   returned to the CLI. The account view remained Free with no active paid
   license and no hosted-record allowance.

## Disposition

This is direct evidence that the current owner session cannot complete the
authenticated CLI handoff without a mapped entitlement. It does not claim a
provider failure, does not authorize a purchase, and does not replace the
required signed CLI fetch/cache/offline/expiry/cross-tenant/provider matrix.
Keep `TEAM-CLI-001`, `TEAM-CLI-002`, and `TEAM-WEB-006` unchecked. This is a
non-AppSec entitlement boundary; the Hunt/AppSec hold set is unchanged.
