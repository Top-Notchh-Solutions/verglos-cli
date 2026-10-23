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
- **Hosted state:** Exact head `13d144438045da574e7cbab6a21ec73341b8f796`
  passed all nine Ubuntu/macOS/Windows × Node 20/22/24 cells, self-scan, and
  in-toto release binding in run `37625527232`. PR #79 merged as
  `7d060b2852551cc017bbb2b5f70bad22843e7273`.
- **Boundary:** No production, provider, database, deployment, credential,
  package publication, or release operation occurred. This does not close
  QUAL-CLI-006: official-validator qualification, cross-platform artifact
  review, legal/provenance approval, trusted publishing, and independent
  acceptance remain open.
