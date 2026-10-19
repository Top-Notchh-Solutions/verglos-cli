# QUAL-CLI-006 rollback matrix evidence — 2026-10-19

## Scope

This packet records the public implementation and cross-platform qualification
advance for `QUAL-CLI-006`. It strengthens the release matrix so each supported
Ubuntu, macOS, and Windows Node 20/22/24 cell runs and uploads the bounded
rollback/revocation rehearsal evidence. It does not enroll a trusted publisher,
publish an npm package, rotate a signing key, or perform a provider/customer
rollback.

## Public source and merge

- Repository: `Top-Notchh-Solutions/verglos-cli`
- Pull request: [#151](https://github.com/Top-Notchh-Solutions/verglos-cli/pull/151)
- Implementation commit: `562ea84e ci(release): qualify rollback evidence across platforms`
- Normal merge commit: `07cb117e3796b693c71c3f937d5935e0e2abb694`
- Merge method: normal merge; no squash, rebase, or force-push

The public platform workflow now runs
`scripts/release-rollback-evidence.mjs` for every matrix cell and uploads the
bounded `report.json` and `run.log` with fail-closed artifact presence. The
workflow contract test requires both the execution and upload steps.

## Verification

- Local platform workflow contract and rollback-evidence generator tests:
  **2 pass, 0 fail**.
- Local `git diff --check`: passed.
- Hosted platform matrix run `39184280350`, rerun attempt 2: all nine
  Ubuntu/macOS/Windows Node 20/22/24 cells passed, including the new rollback
  and revocation evidence steps and the full test suite.
- The first matrix attempt had one non-diagnostic Windows Node 24 aggregate-test
  failure after all visible test files reported zero failures. The failed cell
  was rerun without source changes and passed; the initial infrastructure/test
  event is retained as a limitation, not hidden.
- Hosted self-scan run `39184280327`: passed.
- Official standard/provenance validators run `39184280479`: passed.
- In-toto release binding job `117846346587`: passed.

## Boundary and disposition

This qualifies repository-owned cross-platform execution and evidence upload
only. The rehearsal uses synthetic immutable references and does not call npm,
a registry, a signing provider, a Hunt-feed provider, or Vercel. No provider,
customer, Production, payment, or AppSec/Hunt state changed.

`QUAL-CLI-006` remains unchecked pending trusted keyless identity and protected
publication evidence, legal/license clearance, independent review where
required, and final acceptance. `DIST-006` also remains unchecked pending
authenticated rollback/revocation acceptance across the applicable provider
boundaries and final release mapping.

## Backlog state

`TEAM-CLI-001` is verified checked before this work. The authoritative backlog
remains **235 checked / 45 open / 280 total (83.9%)**. The QUAL-CLI-006 and
DIST-006 checkboxes are intentionally unchanged; AppSec/Hunt-held rows were not
touched.
