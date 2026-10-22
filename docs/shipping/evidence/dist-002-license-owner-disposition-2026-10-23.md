# DIST-002/DIST-003 exact license disposition and release artifacts — 2026-10-23

## Source and decision

- CLI source commit: `2db1139337d60543fd59ec0b7e3130983d40e0a3`
- Pushed branch: `codex/cli-process-entry-2026-10-11`
- Lockfile SHA-256: `549740faff4c1adc7983d1267030a0fa82d7b86ce790916d9e49c3f87507b9f4`
- Exact owner decision: `top-notchh-company-disposition-2026-10-23`
- Decision record: `docs/shipping/legal/transitive-license-owner-disposition-2026-10-23.md`

The release inventory now clears only the six exact BlueOak package tuples and
the exact nested `benchmark@1.0.0|fast-uri@3.1.7` tuple recorded by that
decision. It does not add a general BlueOak allowlist or hide the nested
component. Any version, license, source, parent, or notice mismatch remains a
blocker.

## Local verification

The following commands were run from the exact source commit:

```text
node --test scripts/license-inventory.test.mjs scripts/generate-third-party-notices.test.mjs scripts/verify-release-artifacts.test.mjs scripts/publish-workflow-contract.test.mjs scripts/verify-release-tag.test.mjs
node scripts/license-inventory.mjs --require-clear
node scripts/pack-public-packages.mjs /tmp/verglos-release-artifacts.LBmvaH
node scripts/verify-clean-consumer.mjs /tmp/verglos-release-artifacts.LBmvaH
node scripts/verify-release-artifacts.mjs /tmp/verglos-release-artifacts.LBmvaH --require-seven
node scripts/verify-upgrade-rollback.mjs /tmp/verglos-release-artifacts.LBmvaH
```

Results:

- Focused release/license tests: **17/17 passed**; `git diff --check` passed.
- Inventory: **254** lockfile package IDs, **250** package entries, one nested
  component, and **zero** unresolved review blockers.
- Release verifier: **12 artifacts** verified — seven npm archives, five
  sidecars, and identical notices inside every archive.
- Clean consumer: seven archives installed, all libraries imported, CLI
  executed as `2.0.0-alpha.1`, and no external engine was implicitly
  installed.
- Upgrade/rollback: `1.8.3 -> 2.0.0-alpha.1 -> 1.8.3` passed.

## Artifact checksums

The reproducible local output directory was
`/tmp/verglos-release-artifacts.LBmvaH`; `SHA256SUMS` was verified by the
release verifier. The generated package artifacts are not treated as a
publication or customer acceptance event.

```text
c082b9afdd08812366238d68ace0923199857e9ecc7b6b59a576a0f7e5e76cc2  verglos-2.0.0-alpha.1.tgz
fba10f1b21acb089df8b39a71ace9c9299b0015cc20bd35a1cbb74173ededb56  verglos-entitlement-2.0.0-alpha.1.tgz
89e08c807d6e26f02479b6281ee9ebfd6879c8923080baa853de819a99a0a933  verglos-hunt-2.0.0-alpha.1.tgz
0dc26bda0393122afd7ef01535cc15d3c64ae636e0843c25b826ad4a79ad799f  verglos-mcp-2.0.0-alpha.1.tgz
b7607d78510ba29380fb7e32a542c4da3096131ea995ef4c524cce7c9f2068db  verglos-reporter-2.0.0-alpha.1.tgz
87dd07f8e841af742616c7e103d3c5e1b1d4de46082faa9e1d59cdeb1d7d7779  verglos-scanner-2.0.0-alpha.1.tgz
8cfd52a93ec221f377cd5bb86bb55a10725e896c16d5d093de477b0a616f1e6b  verglos-shared-2.0.0-alpha.1.tgz
6ebcd2ed4834fd72e5197e0e9b2212054f6cce519af4079c0fe95e2e1c17105f  THIRD_PARTY_NOTICES
602623e823682e644a208602264ec4730bf9dee8a6f6e6a6f247825bda17061f  SBOM.cdx.json
a9116a29c1099b71230c5722699cb5ba5257e2d1e1e1db8c646df9c792eb138b  SBOM.spdx.json
0dad476f2388ea7ab9ba57f212b29d0adafb16ed84e86baf826ce274f9aae037  dependency-license-inventory.json
68bcf68cd9539a45acae26d877def27afb99385c532869e7c38fcb48518ecd6f  clean-consumer-verification.txt
```

## Boundary

This closes the code-side license-inventory blocker for the current package
boundary and provides reproducible local release evidence. `DIST-002`,
`DIST-003`, `DIST-006`, and `QUAL-CLI-006` remain unchecked for their separate
trusted/protected publication, immutable attestation/provider, operational or
independent review, and final acceptance contracts. No npm/registry/provider/
Production/customer operation or final release sign-off occurred. Nothing was
deleted.

