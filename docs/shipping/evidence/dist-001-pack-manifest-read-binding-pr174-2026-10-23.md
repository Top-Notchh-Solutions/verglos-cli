# DIST-001 public-pack manifest read binding — PR #174 — 2026-10-23

## Scope

This packet records the public package packer's source-manifest boundary
hardening. Each public package `package.json` is now read through the shared
bounded regular-file helper before dependency normalization and `npm pack`,
so symlinked, oversized, or changed source manifests fail closed.

## Source and merge

- Repository: `Top-Notchh-Solutions/verglos-cli`
- Implementation commit: `516731340a9df4b39e574c1143fe9c6df8d1f6e5`
- Pull request: #174
- PR URL: https://github.com/Top-Notchh-Solutions/verglos-cli/pull/174
- Merge mode: normal merge, no squash
- Merge commit: `34d84bbe63a34ce41c3425b478eba03ef241d7c2`

## Implementation and verification

`scripts/pack-public-packages.mjs` now calls
`readBoundedRegularFile(manifestPath, MAX_RELEASE_ARTIFACT_BYTES, ...)` for
all seven public source manifests. The source regression prevents a pathname
manifest read from returning.

- Targeted source/archive boundary contracts: **14 passed**
- Full CLI Turbo test/typecheck/build graph: **23/23 tasks successful**
- `git diff --check`: passed
- Hosted Standard validation: run `39857515194` — success
- Hosted self-scan: run `39857515335` — success
- Hosted platform matrix and in-toto: run `39857515411` — success
- Platform matrix: all Ubuntu/macOS/Windows Node 20/22/24 cells passed

The direct local public-pack fixture was not claimed as green because the
worktree's dependency-license inventory lacks cross-platform optional
`@esbuild/*` package metadata; the hosted cross-platform workflow passed the
same packaging/consumer path.

## Disposition

This is merged code-side `DIST-001` progress. Keep the row open for
LOCAL/HUNT/RECORD, legal/license, trusted/protected publication, immutable
attestation, and final release acceptance. No npm publication, provider,
Production, customer, database, or release-sign-off state changed. Nothing was
deleted.

Score remains **239 checked / 41 open / 280 total (85.4%)**. The 13 AppSec-held
rows are unchanged.
