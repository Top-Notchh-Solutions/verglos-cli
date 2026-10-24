# DIST-002/003 current publish-contract regression — 2026-10-24

- **Command:**
  `node --test scripts/publish-public-package.test.mjs scripts/publish-workflow-contract.test.mjs scripts/verify-npm-publication.test.mjs scripts/license-inventory.test.mjs scripts/verify-release-artifacts.test.mjs scripts/verify-release-tag.test.mjs scripts/generate-release-notes.test.mjs scripts/generate-release-origin.test.mjs scripts/generate-release-checksums.test.mjs scripts/external-license-records.test.mjs`
- **Result:** **44/44** tests passed; failures, cancellations, skips, and todos
  were all **0**.
- **Covered boundaries:** seven-package publication identity; exact-version
  registry preflight; symlink and bounded-file rejection; explicit 404-only
  publication decision; protected `release` environment; GitHub OIDC
  provenance; no long-lived npm token; stable-tag binding; archive/sidecar
  checksums; SBOM/SPDX/license records; clean release-note/origin inputs; and
  fail-closed provenance verification.
- **Network/provider boundary:** registry/provenance behavior was mocked by
  the tests. No npm registry write, tag, GitHub release, protected approval,
  token use, or provider attestation occurred. The test message that an
  alpha version was already published is a mocked preflight fixture, not a
  new publication receipt.
- **Disposition:** This advances DIST-002/DIST-003 implementation evidence
  only. Keep both rows unchecked for protected trusted publication, external
  provider provenance/attestation, final license/release clearance, and final
  acceptance. No backlog checkbox changed.
