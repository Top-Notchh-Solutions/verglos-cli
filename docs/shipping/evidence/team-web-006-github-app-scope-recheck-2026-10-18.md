# TEAM-WEB-006 GitHub App scope recheck — 2026-10-18

## Scope

This packet records the live organization-installation scope correction for
the Verglos Organization SCM Checks GitHub App. It is provider-scope evidence
only; it is not proof of check delivery, entitlement, reconciliation, or
independent AppSec review.

## Observed installation

- Organization: `Top-Notchh-Solutions`
- Installation: `Verglos Organization SCM Checks`
- Installation settings page: `https://github.com/organizations/Top-Notchh-Solutions/settings/installations/172686102`
- Authenticated owner session: `@anuragyadav-git`
- Permissions retained: read metadata; read/write checks.
- Repository access after the saved update: only
  `Top-Notchh-Solutions/verglos-cli`.
- `Top-Notchh-Solutions/verglos-archive` was removed because it is not a
  working repository.
- Searching the organization installation for `verglos-web` returned
  `No repositories found`; GitHub did not offer that repository under this
  organization for selection.

## Verification

The GitHub sudo confirmation completed successfully. The page displayed the
success alert: “Verglos Organization SCM Checks was updated for the
@Top-Notchh-Solutions account.” A final page snapshot showed one selected
repository (`verglos-cli`), unchanged least-privilege permissions, and the
archive absent.

## Disposition

This corrects the organization installation's stale archive scope. It does
not close `TEAM-WEB-006`: live check delivery, the working `verglos-web`
repository's owning-account installation/scope, operational cutover,
reconciliation, and complete acceptance remain open. No AppSec state changed.
The private backlog score remains **232 checked / 48 open / 280 total
(82.9%)**.

