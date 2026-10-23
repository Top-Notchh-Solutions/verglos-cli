# DIST-003 release artifact read binding — PR #171 — 2026-10-23

## Implementation

CLI source commit `03a5ab69dd0bd0cda1a7197e5f9d61f6eb6ab200` hardens release-origin generation and release-artifact verification. Archive and sidecar reads now use bounded regular-file handles with identity and size rechecks before and after reading. Archive manifests and packaged notices are extracted from the validated bytes through a private temporary archive, avoiding a second path lookup after validation. Symlinked release archives are rejected before extraction.

## Verification

- Focused final release-origin/verifier contracts: **9/9 passed**.
- Full CLI monorepo `pnpm exec turbo run test typecheck build --force`: **23/23 tasks passed**, zero failures; documented environment-gated Hunt Docker tests remained explicit skips.
- Hosted self-scan run `39847979574`: passed.
- Hosted standard validation run `39847979657`: passed.
- Hosted platform matrix run `39847979758`: passed in-toto binding plus all nine Ubuntu/macOS/Windows × Node 20/22/24 cells.

## Promotion boundary

PR #171 merged normally as `72b2f8f64d34d3dec339501be2d9738d2427984a`; the source branch was preserved. No squash, rebase, force push, publication, registry/provider action, Production mutation, customer/recipient acceptance, legal/license approval, or release sign-off occurred. Nothing was deleted.

`DIST-003` remains unchecked because its remaining contract includes legal/license disposition, protected/trusted publication, immutable attestation, independent/hosted evidence where required, and final acceptance. The score remains **239 checked / 41 open / 280 total (85.4%)**.
