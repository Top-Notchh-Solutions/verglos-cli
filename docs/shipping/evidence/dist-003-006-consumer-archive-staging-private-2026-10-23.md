# DIST-003/006 consumer archive staging · 2026-10-23

## Implementation

`stage-bounded-archives.mjs` snapshots release archives through bounded
regular-file handles into a private temporary directory before any npm
consumer install or rollback transition receives a pathname. The clean
consumer verifier and upgrade/rollback verifier now use those snapshots.
`check-packed-manifests.mjs` also reads the repository license and every
archive through the same opened-handle boundary before parsing tar entries.

## Verification

- Combined release, bounded-reader, staging, clean-consumer, workflow, and
  bundle contracts: **17/17 passed**.
- The six-archive packed-manifest audit passed against `.artifacts/public-packages`.
- The real clean-consumer run installed six local archives, imported all
  libraries, executed Verglos `2.0.0-alpha.1`, and confirmed no external-engine
  cache was created.
- The real local upgrade/rollback rehearsal passed
  `1.8.3 -> 2.0.0-alpha.1 -> 1.8.3`.
- Symlinked source archives are rejected before staging.
- Syntax checks and `git diff --check`: passed.

## Boundary

This is local implementation and rehearsal evidence for DIST-003 and
DIST-006 only. Authenticated provider/registry rollback, deployment
revocation, independent review, and final release decision were not performed
by this change. No npm publication, provider, Production, customer,
deployment, tag, or release-sign-off action occurred. Both rows remain
unchecked; nothing was deleted or overwritten. The live score remains **244
checked / 36 open / 280 total (87.1%)**.
