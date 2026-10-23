# HUNT PR #76 hosted matrix · 2026-10-07

- **Source:** CLI PR #76, commit `7022408`.
- **Hosted result:** Ubuntu/macOS/Windows × Node 20/22/24 all pass; the
  Verglos self-scan passes; the in-toto release binding passes.
- **Local result:** Root `pnpm test` completed with 12/12 Turbo tasks
  successful; MCP package tests, typecheck, build, and diff checks pass.
- **Limitation:** This qualifies the current code and public CI matrix only.
  HUNT-009 remains unchecked pending trusted/licensed publisher roots,
  bounded execution qualification, and independent review; HUNT-010 remains
  partial because the finding/report/before-write MCP execution tools are
  still alpha stubs.
- **Boundary:** No browser, provider, payment, production, database,
  deployment, credential, or external-recipe operation occurred.
