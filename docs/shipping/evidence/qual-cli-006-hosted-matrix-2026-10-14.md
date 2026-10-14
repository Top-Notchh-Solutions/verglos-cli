# QUAL-CLI-006 hosted platform-matrix evidence — 2026-10-14

## Result

The public CLI workflow `Platform matrix` completed successfully for exact
merge commit `ba6c75b4e1d11b59f1e6e7bf13edc3c4be02b13a`.

- Run: [GitHub Actions run 38550747564](https://github.com/Top-Notchh-Solutions/verglos-cli/actions/runs/38550747564)
- Event: `workflow_dispatch` on `main`
- Created: `2026-10-14T10:36:25Z`
- Completed: `2026-10-14T10:46:04Z`
- Overall result: `success`
- Workflow: `.github/workflows/platform-matrix.yml`

## Hosted jobs

All nine platform/runtime combinations passed:

| Platform | Node 20 | Node 22 | Node 24 |
| --- | --- | --- | --- |
| Ubuntu | pass | pass | pass |
| macOS | pass | pass | pass |
| Windows | pass | pass | pass |

The separate Ubuntu Node 24 in-toto release-binding job also passed. The run
published 28 non-expired artifacts: three evidence artifacts for each of the
nine matrix jobs plus the in-toto release-binding artifact. The artifacts are
retained by GitHub Actions under the run; no secret values are included here.

## Scope and disposition

The hosted run verifies build, Hunt fixture verdicts, clean public-package
consumption, upgrade/rollback, typecheck, and tests across the supported
hosted matrix at this exact public commit. It is technical qualification
evidence only.

`QUAL-CLI-006` remains unchecked because its complete acceptance criteria also
require trusted keyless Sigstore/Fulcio/Rekor identity, protected publication,
legal/redistribution clearance, independent AppSec review, and final release
acceptance. No npm publication, tag, deployment, provider, database,
entitlement, customer, or release-approval state changed.

