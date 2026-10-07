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
- **Environment limitation:** The local license/SBOM commands fail closed
  because the macOS install does not materialize all platform-specific optional
  `@esbuild/*@0.28.1` lockfile packages. The source and lockfile were not
  changed; hosted/clean-consumer license and SBOM evidence remains required.
- **Disposition:** QUAL-CLI-006 remains open for official-validator coverage,
  cross-platform consumer evidence, trusted keyless publishing/provenance,
  legal review, and independent acceptance. No backlog checkbox changed.
