# DIST-002/003 license inventory and notices read binding · 2026-10-23

## Implementation

The dependency license inventory now reads workspace manifests, virtual-store
manifests, nested bundled manifests, and the pnpm lockfile through bounded
regular-file handles. License and NOTICE text collection uses the same
opened-file boundary with its existing 512 KiB limit. Third-party notice
generation uses bounded reads for nested package manifests before projecting
the generated notice text.

## Verification

- Full supported-architecture inventory: **254 lockfile package versions,
  250 package entries, 1 bundled component**.
- Explicit license review blockers: **7**, preserved in the output and not
  treated as cleared.
- Deterministic third-party notice generation passed.
- License inventory, notices, package-license, bounded-reader, and bundle
  contracts: **15/15 passed**.
- Inventory SHA-256: `20d65cf32f25122edb5c96b017bffec4d7851d0ce494221c55a2e7004667ae44`.
- Notices SHA-256: `f2b37e1d74dc6d7927c357daf1705a1a8ae0cd0dc3837e072710d123914b6e51`.
- Syntax and `git diff --check`: passed.

## Boundary

This is DIST-002/003 license-evidence implementation only. The seven explicit
review blockers remain open; no legal opinion, npm publication, provider,
Production, customer, deployment, tag, immutable attestation, independent
review, or release-sign-off action occurred. Nothing was deleted or
overwritten. The live score remains **244 checked / 36 open / 280 total
(87.1%)**.
