# DIST-006 current rollback/revocation rehearsal — 2026-10-24

- **Commands:**
  `node --test scripts/release-rollback-evidence.test.mjs scripts/platform-matrix-contract.test.mjs`
  and
  `node packages/cli/dist/index.js release rollback-rehearsal scripts/fixtures/release-rollback-rehearsal.json --json --quiet`.
- **Result:** **3/3** contract tests passed. The direct rehearsal returned
  `status: passed`, fixture manifest digest
  `sha256:664f70df2f2a0c063d43c767e602266b1adc1709a498dae7ef71825291b960b7`,
  **5** operations, and **2** historical records preserved.
- **Boundaries exercised:** npm-package rollback, engine-manifest rollback,
  Hunt-feed rollback, signing-identity revocation, and Web-deployment rollback.
- **Provider boundary:** This is a local decision-contract rehearsal using
  synthetic immutable identifiers. It did not call npm, a registry, signing or
  Hunt providers, Vercel, or any authenticated rollback/revocation endpoint.
- **Disposition:** Local rollback implementation evidence only. Keep DIST-006
  unchecked for real provider/Production rollback or revocation, operational
  review, and final release acceptance. No backlog checkbox changed.
