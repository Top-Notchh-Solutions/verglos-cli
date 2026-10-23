# DIST-001 package-audit read binding — PR #172 — 2026-10-23

## Scope

This packet records the implementation slice completed for `DIST-001` in the
public CLI repository. It hardens the package-contents audit against
path-based time-of-check/time-of-use changes by binding package manifests and
private-key scan inputs to bounded regular-file reads.

## Source and merge

- Repository: `Top-Notchh-Solutions/verglos-cli`
- Implementation commit: `bab641c96df3332ae8a8fee7fb885e7bb27273c4`
- Pull request: #172
- PR URL: https://github.com/Top-Notchh-Solutions/verglos-cli/pull/172
- Merge mode: normal merge, no squash
- Merge commit: `451e1dda3d21c1d87dcfb017f3e7cab8d2ffb711`

## Implementation

`scripts/check-package-contents.mjs` now uses the shared bounded regular-file
reader for package manifests and the files inspected for private-key material.
The reader rejects symlinks, rechecks file identity and size, and enforces the
existing audit size bounds before decoding content. The package-surface audit
test asserts that these source paths stay on the bounded-reader contract.

## Verification

- Package-surface focused tests: **8/8**
- Package-contents audit: **7 public packages passed**
- Release contract suite: **30/30**
- Full CLI Turbo graph: **23/23 tasks successful**
- `git diff --check`: passed
- Hosted Standard validation: run `39852985092` — success
- Hosted self-scan: run `39852984822` — success
- Hosted platform matrix and in-toto: run `39852984879` — success
- Platform matrix: all Ubuntu/macOS/Windows Node 20/22/24 cells passed

## Disposition

This is real code-side progress, merged into CLI `main`. The `DIST-001`
checkbox remains open because the row still requires its LOCAL/HUNT/RECORD,
legal/license, trusted/protected publication, immutable attestation, and final
release-acceptance evidence. No npm publication, provider, Production,
customer, database, or release-sign-off state changed. Nothing was deleted.

Score remains **239 checked / 41 open / 280 total (85.4%)**. The 13 AppSec-held
rows are unchanged.
