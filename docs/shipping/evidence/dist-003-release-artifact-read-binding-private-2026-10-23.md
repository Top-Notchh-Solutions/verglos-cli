# DIST-003 release-artifact read binding · 2026-10-23

## Implementation

`scripts/verify-release-artifacts.mjs` now reads `SHA256SUMS`, every archive,
and every required release sidecar through the bounded regular-file reader.
The verifier hashes and validates the exact bytes obtained from the opened
handles, rejecting symlinked or changed files before checksum, SBOM, license,
or clean-consumer decisions. UTF-8 text is decoded with fatal validation.

## Verification

- Release-artifact, bounded-reader, and release-tag contracts: **9/9 passed**.
- Symlink regressions cover an archive, the checksum manifest, and a release
  sidecar.
- `node --check scripts/verify-release-artifacts.mjs`: passed.
- `git diff --check`: passed.

## Boundary

This is DIST-003 verifier implementation evidence only. No npm publication,
provider, Production, customer, deployment, tag, immutable attestation, or
release-sign-off action occurred. DIST-003 remains unchecked for those
external/release gates and final acceptance. Nothing was deleted or
overwritten. The live score remains **244 checked / 36 open / 280 total
(87.1%)**.
