# QUAL-CLI-006 standards validation corpus — 2026-10-07

- **Repository:** `verglos-cli`, PR #79
- **Commit:** `13d144438045da574e7cbab6a21ec73341b8f796`
- **Implementation:** Adds a shared-package validation corpus covering the
  required top-level fields of SARIF 2.1.0, CycloneDX 1.6, SPDX 2.3,
  in-toto Statement v1, and detect-secrets baseline inputs. It also exercises
  the existing Sigstore compatibility and cross-platform install/upgrade/
  rollback test pointers.
- **Verification:** Shared importer/security tests pass **29/29**; the full
  configured CLI test graph passes **12/12** tasks with zero failures; CLI
  typecheck passes across 10 packages; build passes across 8 packages; and
  `git diff --check` passes against current `origin/main`.
- **Hosted state:** Exact head is pushed; the nine OS/Node matrix cells,
  self-scan, and in-toto binding were queued at capture. No hosted success is
  claimed yet.
- **Boundary:** No production, provider, database, deployment, credential,
  package publication, or release operation occurred. This does not close
  QUAL-CLI-006: official-validator qualification, cross-platform artifact
  review, legal/provenance approval, trusted publishing, and independent
  acceptance remain open.
