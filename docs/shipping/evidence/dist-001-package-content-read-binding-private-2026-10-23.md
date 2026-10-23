# DIST-001 package-content read binding · 2026-10-23

## Implementation

`scripts/check-package-contents.mjs` now reads each public package manifest
and each bounded packaged file through the opened regular-file reader. The
private-key inspection therefore rejects symlinked or changed files and
decodes only bounded, valid UTF-8 bytes before applying the package-surface
rules.

## Verification

- Real package-content audit: **6 public packages passed**.
- Package-surface, publish-workflow, and bounded-reader contracts: **7/7
  passed**.
- `node --check scripts/check-package-contents.mjs`: passed.
- `git diff --check`: passed.

## Boundary

This is DIST-001 implementation evidence only. The row remains unchecked for
dependent product surfaces, final legal/release qualification, independent
review where required, and final acceptance. No npm publication, provider,
Production, customer, deployment, tag, or release-sign-off action occurred.
Nothing was deleted or overwritten. The live score remains **244 checked / 36
open / 280 total (87.1%)**.
