# STUDIO-CLI-001 production entitlement observation — 2026-10-19

## Capture

- Surface: `https://verglos.com/orgs/top-notchh-solutions/billing`
- Session: authenticated `Top Notchh Solutions` organization owner session
- Capture method: existing authenticated Chrome debugging page; no new browser
  window or tab was opened.
- Scope: read-only observation of the production billing/entitlement surface.

## Observed production state

The page reports:

- Effective plan: `free`.
- License state: `no active paid license`.
- Entitlement expiry: `No recorded expiry`.
- New purchase state: `not purchasable`.
- Hosted records: `Allowance is not configured; this is not unlimited.`
- Subscription state: `No provider subscription ledger row is stored.`
- Payments/invoices: `No provider payment rows are stored.`

The page also states that no checkout is offered because the catalog price is
not approved for purchase and that the dashboard will not imply a reconciled
live gateway amount.

## Disposition

This is original production-state evidence, not a placeholder and not a
qualification pass. It confirms why the numeric paid/non-production hosted
record allowance and authorized Studio recipient/customer acceptance required
by `STUDIO-CLI-001` cannot be marked complete from the current owner session.
The shipped upload authorization implementation remains valid and unchanged.

Score remains **239 checked / 41 open / 280 total (85.4%)**. No AppSec/Hunt
state changed.
