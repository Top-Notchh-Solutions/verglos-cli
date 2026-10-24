# DIST-003 current release-artifact regression — 2026-10-24

- **Command:** Ran the dedicated release checksum, origin, SBOM, SPDX,
  third-party notice, license inventory, publish-workflow, standard-validation,
  clean-consumer, release-note, tag, and strict artifact verifier test files.
- **Result:** **43/43** tests passed; failures, cancellations, skips, and todos
  were all **0**.
- **Covered boundaries:** deterministic SHA-256 manifests; bounded regular-file
  reads and symlink rejection; unique CycloneDX/SPDX package references;
  complete license/notice records; seven-package clean-consumer requirements;
  official validator wiring; exact release origin/notes; immutable stable-tag
  binding; and strict checksum/SBOM/license artifact verification.
- **Boundary:** All provider/registry behavior was contract or fixture based.
  No npm publication, tag, GitHub release, protected approval, external
  attestation, token use, or final release sign-off occurred.
- **Disposition:** This advances DIST-003 implementation and local artifact
  integrity only. Keep DIST-003 unchecked for the trusted provider
  attestation, final license/release clearance, and final acceptance. No
  backlog checkbox changed.
