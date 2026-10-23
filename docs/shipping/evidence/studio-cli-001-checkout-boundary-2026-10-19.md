# STUDIO-CLI-001 checkout and allowance boundary — 2026-10-19

## Scope

This packet records a read-only observation in the existing authenticated
Verglos Chrome session while checking whether the current owner-controlled
organization has a supported paid/non-production allowance for the Studio
hosted custody qualification. No payment control was submitted, no checkout
session was created, and no billing, license, database, provider, or
Production state changed.

## Observations

- Organization billing page: `https://verglos.com/orgs/top-notchh-solutions/billing`.
- The authenticated organization displayed effective plan `free`, no active
  paid license, and no configured hosted-record allowance.
- Checkout page: `https://verglos.com/checkout`.
- The checkout displayed only `Pro`, monthly price `₹2,809.43`, and `Cards` as
  the available hosted method. It did not display a Studio offer, a Studio
  numeric allowance, or a Test Mode control.
- The `Continue to secure payment` control was not activated.

## Acceptance mapping

This is stronger entitlement-boundary evidence, not a Studio acceptance pass.
The supported paid/non-production hosted-record allowance and an actual
authorized Studio recipient acceptance observation remain absent. The hosted
custody route must continue to fail closed with
`allowance_not_configured`; activating the inactive Studio catalog or treating
the Pro checkout display as a Studio entitlement would be false evidence.

## Privacy and limitations

Only bounded page labels, URLs, and displayed plan/method data are retained.
No cookies, payment details, credentials, raw provider payloads, customer
source, or account identifiers were copied. This packet does not prove a
successful payment, entitlement issuance, Studio provisioning, or recipient
comprehension.
