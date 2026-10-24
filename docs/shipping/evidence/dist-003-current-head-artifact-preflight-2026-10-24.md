# DIST-003 current-head artifact and provenance preflight receipt

Date: 2026-10-24

## Exact source and boundary

- CLI candidate source: `bcb30a7ed645b21ec150e22929f7bd2960b5c7c3`.
- Candidate package version: `2.0.0-alpha.4`.
- Local tag input: `v2.0.0-alpha.4`; no Git tag was created or pushed.
- All artifact generation and verification were local. No npm publication,
  provider write, GitHub release, customer delivery, or Production action
  occurred.

## Artifact contract suite

The current artifact/provenance contract command passed:

```text
node --test \
  scripts/check-packed-manifests.test.mjs \
  scripts/external-license-records.test.mjs \
  scripts/generate-release-checksums.test.mjs \
  scripts/generate-release-notes.test.mjs \
  scripts/generate-release-origin.test.mjs \
  scripts/generate-sbom.test.mjs \
  scripts/license-inventory.test.mjs \
  scripts/verify-clean-consumer.test.mjs \
  scripts/verify-release-artifacts.test.mjs \
  scripts/verify-release-tag.test.mjs
```

Result: **39/39 passed**, **0** failures, skips, or cancellations.

## Local candidate artifacts

The exact local preflight generated and verified:

- **7/7** public npm archives;
- **15** release artifacts under the strict seven-package set (**7** archives,
  **8** sidecars, with notices in every archive);
- `SHA256SUMS`, CycloneDX and SPDX SBOMs, dependency-license inventory,
  external-license records, release notes, and `RELEASE_METADATA.json`;
- clean consumer installation/import of all seven archives, CLI execution at
  `2.0.0-alpha.4`, no external engine installation, and the signed
  `a1-utf8-contains` bounded fixture.

The checksum manifest digest was
`sha256:c524585a6fd3f6959fd1ad1df362e9b93df3322dfc7d76363b7e499e0a07a96f`.
The locally generated release metadata bound version `2.0.0-alpha.4`, source
commit `bcb30a7ed645b21ec150e22929f7bd2960b5c7c3`, and tag input
`v2.0.0-alpha.4` across **14** artifact entries.

## Shipping disposition

This advances the code-side `DIST-003` artifact, checksum, SBOM, release-note,
origin-binding, and clean-consumer contracts. Local origin metadata and local
checksums are not trusted external provider attestation. Keep the row
unchecked for actual immutable publication, provider/in-toto attestation,
trusted-publishing review, legal/release clearance, and final acceptance. No
files or branches were deleted.
