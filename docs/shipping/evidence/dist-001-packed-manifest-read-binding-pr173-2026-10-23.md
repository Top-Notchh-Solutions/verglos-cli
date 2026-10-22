# DIST-001 packed-manifest read binding — PR #173 — 2026-10-23

## Scope

This packet records the follow-on implementation slice for the public CLI
package boundary. The packed npm archive audit now reads each archive through
the bounded regular-file handle helper before parsing tar members, so the
bytes being audited are the bytes whose identity and size were checked.

## Source and merge

- Repository: `Top-Notchh-Solutions/verglos-cli`
- Implementation commit: `50f0e31ee73f8c1623bc63bea9528e3d0f67c0bc`
- Pull request: #173
- PR URL: https://github.com/Top-Notchh-Solutions/verglos-cli/pull/173
- Merge mode: normal merge, no squash
- Merge commit: `13c75a09e46e8882ed8c6b07b149ec76cc1909eb`

## Implementation

`scripts/check-packed-manifests.mjs` now uses
`readBoundedRegularFile(archive, MAX_RELEASE_ARTIFACT_BYTES, ...)` instead of
reading an archive by pathname after a separate `lstat`. The regression test
asserts the source remains on the bounded-reader path and rejects the old
pathname read.

## Verification

- Focused packed-manifest and package-surface tests: **12/12**
- Full CLI Turbo test/typecheck/build graph: **23/23 tasks successful**
- `git diff --check`: passed
- Hosted Standard validation: run `39855141041` — success
- Hosted self-scan: run `39855140860` — success
- Hosted platform matrix and in-toto: run `39855140881` — success
- Platform matrix: all Ubuntu/macOS/Windows Node 20/22/24 cells passed

The local direct public-pack generation was not used as a source of release
evidence because this worktree's pre-existing dependency-license inventory
environment lacks lockfile metadata for optional `@esbuild/*` packages. The
fixture-backed audit and all hosted archive/consumer checks passed.

## Disposition

This is merged code-side progress for `DIST-001`/`DIST-003`. Both rows remain
open for their declared LOCAL/HUNT/RECORD or protected/trusted publication,
legal/license, immutable attestation, provider, operational, and final
acceptance gates. No npm publication, provider, Production, customer,
database, or release-sign-off state changed. Nothing was deleted.

Score remains **239 checked / 41 open / 280 total (85.4%)**. The 13 AppSec-held
rows are unchanged.
