# DIST-003 current-head checksum generation — 2026-10-22

## Implementation

CLI commit `5072204f` adds `scripts/generate-release-checksums.mjs` and
replaces the inline `sha256sum` publish-workflow command with the tested
repository script. The script enumerates the release directory in sorted
order, excludes only its own `SHA256SUMS` output, hashes regular files, and
fails closed on an empty directory or symlink artifact.

## Verification

The focused release contract run passed **11/11** with zero failures or skips:

- checksum generation: deterministic ordering, repeatability, empty-directory
  refusal, and symlink refusal;
- publish workflow contract;
- release-origin generation;
- release artifact verification, including duplicate checksums, sidecar
  completeness, SBOM shape, external-license records, and strict seven-package
  set handling.

`git diff --check` passed. No registry, publication, provider, Production,
customer, legal, or AppSec state changed. This closes the checksum-generation
implementation slice; the broader release acceptance contract remains tracked
by `DIST-003`.
