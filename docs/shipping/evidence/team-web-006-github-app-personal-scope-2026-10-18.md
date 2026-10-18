# TEAM-WEB-006 personal GitHub App scope — 2026-10-18

## Scope

This packet records the existing personal-account installation that owns the
working `verglos-web` repository. It complements the organization-installation
scope packet and is provider configuration evidence only; it is not proof of
webhook delivery, check publication, reconciliation, entitlement, or
independent AppSec review.

## Observed installation

- Account: `anuragyadav-git`
- Installation: `Verglos Preview SCM Checks`
- Installation: `172664847`
- Settings page: `https://github.com/settings/installations/172664847`
- Permissions: read metadata; read/write checks.
- Repository access: only `anuragyadav-git/verglos-web`.
- The page showed the Save control disabled, confirming no pending scope
  change was required for the existing selection.

## Boundary

The organization installation `172686102` covers only
`Top-Notchh-Solutions/verglos-cli`; this personal installation covers only
`anuragyadav-git/verglos-web`. The two working repositories therefore have
separate least-privilege App installations matching their actual GitHub
owners. The obsolete organization `verglos-archive` scope was removed in the
companion recheck.

## Disposition

This advances the provider-scope portion of `TEAM-WEB-006` and
`GITHUB-WEB-001`. The rows remain unchecked pending an authorized live
delivery/check-publication observation, retry/reconciliation evidence, and
complete acceptance. No AppSec state changed. The private backlog score
remains **232 checked / 48 open / 280 total (82.9%)**.

