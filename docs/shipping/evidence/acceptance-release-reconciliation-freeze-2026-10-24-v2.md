# Current candidate reconciliation and freeze v2 · 2026-10-24

## Exact candidate binding

The release input builder bound the reconciliation to the current merged
candidates rather than the stale prior record:

- **CLI:** `cd9d572e28462741103cb21a2274e5892939d5d4`
- **Web:** `cb266b83406bbfffbd5ab02189556e60973a63a6`
- **Version:** `2.0.0-alpha.4`
- **Input config:** `acceptance-release-reconciliation-input-config-2026-10-24-v2.json`
- **Input builder:** `scripts/build-release-reconciliation-input.mjs`

The builder verified every configured evidence path under the private evidence
root and added its SHA-256 binding. Its focused tests passed **2/2**; the
reconciler and freeze suites passed **16/16** in the same local run.

## Reconciliation

The fail-closed reconciler processed all **22** non-AppSec rows as `partial`
and recorded a **no-go** recommendation. It did not promote any row to
`shipped`. The owner-authorized public-OSS scope remains represented by
`customerConsent: passed`; this does not claim external customer acceptance.

The six open gates are provider lifecycle, independent review,
authenticated-browser acceptance, field-CWV evidence, account-deletion
acceptance, and final release. The report retains **6** correction items and
**1** rollback item.

## Candidate freeze

The freeze contract verified **24/24** digest-bound artifacts, including all
12 required artifact kinds, with **0** missing artifacts and **0** missing
artifact kinds. The exact current candidate is still `blocked` with a recorded
`no-go` because the six gates remain open.

Artifacts and SHA-256 digests:

- `acceptance-release-reconciliation-input-2026-10-24-v2.json`:
  `d32ad2183fd668a96fceb29fa61a39fc1b8a23cf2f5d765ce44bf0ba4b06c641`
- `acceptance-release-reconciliation-2026-10-24-current-v2.json`:
  `ddf2c77895532e1dd3780d7e57c26c1d84cef49ed28a45443cca851ab1d9942d`
- `acceptance-candidate-freeze-input-2026-10-24-v2.json`:
  `0e4cbe440ebd85561f2a71370809ece374cca50dca35650a4088dd1f8cbdda8b`
- `acceptance-candidate-freeze-2026-10-24-current-v2.json`:
  `172b6a90402ae8e2252f6d2e1f52c64e116ea41932bb58427c82a19bc4f8f7f2`

No npm package was published, no tag or GitHub release was created, no
payment was made, no customer data was used, no database deletion occurred,
and no paid Actions run was started.
