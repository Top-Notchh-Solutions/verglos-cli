# QUAL-CLI-006 current-head standards qualification run · 2026-10-07

- **Source:** CLI worktree `feat/cli-qual-006-importer-corpus`, exact head
  `13d144438045da574e7cbab6a21ec73341b8f796`; the worktree remained clean.
- **Environment:** macOS host with Docker Server `29.7.2`; dependencies were
  rehydrated from the frozen lockfile. No public package was published and no
  production or provider operation occurred.
- **Verification:** `pnpm --filter @verglos/shared test` passed **448/448**
  tests across 113 package test files; shared typecheck and build passed.
  Coverage includes the standards validation corpus for SARIF 2.1.0,
  CycloneDX 1.6, SPDX 2.3, in-toto Statement v1, and detect-secrets.
- **Standards qualification:** Following the repository's documented CI
  setup, a temporary `pnpm.supportedArchitectures` matrix was used only to
  rehydrate all platform-optional lockfile packages. License inventory,
  CycloneDX SBOM, and SPDX SBOM generation then passed for the 254-package
  lockfile. The temporary manifest change and generated artifacts were
  reverted; the source, lockfile, and worktree are clean.
- **Disposition:** QUAL-CLI-006 remains open for official-validator coverage,
  cross-platform consumer evidence, trusted keyless publishing/provenance,
  legal review, and independent acceptance. No backlog checkbox changed.
