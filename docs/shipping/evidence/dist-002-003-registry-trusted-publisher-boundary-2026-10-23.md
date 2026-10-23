# DIST-002/DIST-003 registry and trusted-publisher boundary · 2026-10-23

- **Read-only observation:** `npm view @verglos/hunt version --json` returned
  registry `E404 Not Found`; `npm view @verglos/cli version --json` returned
  the same result. No package was written, and no tag, workflow dispatch,
  deployment, or release was performed.
- **Local source state:** CLI `origin/main` is
  `6ad18792ae94a1ac3e610554246e2fefc2cc26d1`; the repository contains the
  seven release package sources, including `packages/hunt` at
  `@verglos/hunt@2.0.0-alpha.4`.
- **Credential state:** The owner confirmed the GitHub Actions secret name
  `NPM_TOKEN` exists. Its value is not stored here. The protected publication
  workflow is OIDC-based (`id-token: write`) and intentionally does not read
  `NPM_TOKEN`; wiring it into publication would violate the no-long-lived-token
  DIST-002 contract.
- **Boundary:** The missing registry package/trusted-publisher configuration
  is an observed provider-state requirement for the eventual complete
  publication. `DIST-002`/`DIST-003` remain open, and
  `VERGLOS_FINAL_RELEASE_READY` remains unset until the complete shipping goal
  and final release decision are satisfied. Score remains **244 checked / 36
  open / 280 total (87.1%)**. Nothing was deleted.
- **Required provider configuration:** For each public package, npm's GitHub
  trusted publisher must point to organization `Top-Notchh-Solutions`,
  repository `verglos-cli`, workflow filename `publish.yml`, and environment
  `release`, with direct `npm publish` and `npm dist-tag` permissions enabled.
  The package must exist before its trusted-publisher relationship can be
  managed. This configuration is external npm state; it was not fabricated or
  changed by this session.
