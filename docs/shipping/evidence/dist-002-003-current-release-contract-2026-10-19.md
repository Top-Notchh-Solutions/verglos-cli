# DIST-002/003 current release-contract qualification — 2026-10-19

## Scope

This packet records a real current-head release-contract run for trusted npm
publishing and release artifacts. It verifies the workflow's OIDC/provenance,
protected-environment, immutable-tag, serialized-publication, no-long-lived-
token, seven-package, and pre-publish clean-consumer contracts. It also
attempted the complete local release sidecar/checksum verification. No npm
publication, registry mutation, tag, provider operation, or Production change
was performed.

## Source and runtime

- Repository: `Top-Notchh-Solutions/verglos-cli`
- Exact source: `origin/main` at `0823b513f2b1810ad9f6afcb8806ba46f61feedb`
- Worktree: disposable `/private/tmp/verglos-cli-studio-upload-20261019`
- Release output: disposable `/private/tmp/verglos-release-contract-20261019`
- Host: Darwin 25.5.0 arm64
- Node: `v26.4.0`
- pnpm: `9.15.9`

## Commands and results

```text
node --test scripts/publish-workflow-contract.test.mjs \
  scripts/verify-release-artifacts.test.mjs scripts/verify-release-tag.test.mjs
node scripts/license-inventory.mjs --require-clear
node scripts/pack-public-packages.mjs <release-output>
node scripts/generate-third-party-notices.mjs
node scripts/generate-sbom.mjs
node scripts/generate-spdx.mjs
node scripts/validate-external-license-records.mjs
node scripts/verify-clean-consumer.mjs <release-output>
sha256 checksums
node scripts/verify-release-artifacts.mjs <release-output> --require-seven
```

The workflow/negative release-verifier contract suite passed **8/8**, zero
failures/skips. It covers the seven public packages, pre-publish clean
consumer ordering, required sidecars, checksums, immutable tags, OIDC
`id-token: write`, protected `release` environment, serialized publication,
`--provenance`, and refusal of workflow/manual or long-lived-token bypasses.

The release-preparation commands generated seven archives and six sidecars
plus `SHA256SUMS` (14 files total), and external-license records validated.
The final strict verifier failed closed because the generated dependency
license inventory contains seven unresolved review blockers:

```text
benchmark@1.0.0 via fast-uri@3.1.7 — nested-license-conflicts-with-container
glob@13.0.6 — license-review-required
lru-cache@11.5.2 — license-review-required
minimatch@10.2.6 — license-review-required
minipass@7.1.3 — license-review-required
minipass-flush@1.0.7 — license-review-required
path-scurry@2.0.2 — license-review-required
```

The strict verifier therefore returned exit 1 with
`dependency-license-inventory.json contains unresolved redistribution
blockers`. The release output is not a releasable artifact set and was not
published.

Private hashes:

```text
contract log: 462ed852aea1642d0658207972dbb57be3f3e5289a25a121fbd3381084e70e93
verifier log: b6a32b5c0464bab0250823f060dd74e896630d6533b1450e9e81f545ea3f7e0d
license inventory: 20d65cf32f25122edb5c96b017bffec4d7851d0ce494221c55a2e7004667ae44
```

## Acceptance boundary

This qualifies the code-side publication/release contracts and records a real
legal/release blocker. `DIST-002` and `DIST-003` remain unchecked pending the
protected trusted-publisher approval, legal/license review decisions, and a
strict release artifact set with zero unresolved inventory blockers. No npm,
provider, customer, Production, payment, or AppSec state changed.

The authoritative backlog remains **235 checked / 45 open / 280 total
(83.9%)**. `TEAM-CLI-001` is checked.
