# QUAL-WEB-006 account-state browser evidence — 2026-10-18

## Scope

This is a read-only qualification of the already-open Verglos browser page at
`https://verglos.com/account`. No new Chrome window or tab was opened. The
session was authenticated, but the page displayed the free-tier empty account
state (`No license key yet`) rather than a populated customer dashboard.

This evidence qualifies only the rendered empty account state. It does not
prove paid activation, customer acceptance, dashboard workflows, alert
dispatch, large datasets, or production field performance.

## Results

Lighthouse snapshot audits reported the following for both device modes:

- Accessibility: 100
- Best Practices: 100
- SEO: 100
- Agentic Browsing: 100
- Failed audits: 0
- Passed audits: 28

## Source artifacts

- `desktop-report.json` — SHA-256
  `65371cab66f07223d74aee65f7decb4344e2e553e835e68d7b42c28953a84f19`
- `mobile-report.json` — SHA-256
  `9523aa0ae0aa5597b11d6f3ec456dba4809caee06bc6b0a9d0ab6491b8414529`

The raw reports were scanned for credential-shaped values before retention.
The only matching text was Lighthouse’s generic password-manager audit
description; no credential, cookie, token, or private-key value was retained.

## Disposition

QUAL-WEB-006 remains unchecked. The public-home and empty-account-state lab
checks are positive, but the backlog still requires the authenticated
dashboard/customer flow, human screen-reader review, large-dataset behavior,
complete-state coverage, and field evidence where applicable.

