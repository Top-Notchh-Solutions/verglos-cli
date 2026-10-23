# DIST-002 release-tag manifest read binding · 2026-10-23

## Implementation

`scripts/verify-release-tag.mjs` now reads all six public package manifests
through the bounded regular-file JSON reader. The reader rejects symlinks and
binds the parsed bytes to an opened handle with `O_NOFOLLOW`, identity checks,
size bounds, and post-read rechecks.

## Verification

- Release-tag, bounded-reader, and release-artifact contracts: **8/8 passed**.
- New symlinked package-manifest regression: passed.
- `node --check scripts/verify-release-tag.mjs`: passed.
- `git diff --check`: passed.

## Boundary

This is DIST-002 acceptance-verifier implementation evidence only. No tag,
registry publication, provider, Production, customer, deployment, or release
action occurred. DIST-002 remains unchecked for trusted/protected publication,
immutable attestation, independent review, and final acceptance. Nothing was
deleted or overwritten. The live score remains **244 checked / 36 open / 280
total (87.1%)**.
