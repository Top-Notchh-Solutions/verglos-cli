# HUNT-010 MCP runtime bridge · 2026-10-07

- **Source:** CLI PR #76 commit `b72982a`.
- **Implementation:** Public `@verglos/mcp` now accepts an optional host-provided
  `VerglosMcpHuntExecutor`; the public package never imports the private Hunt
  runtime. Finding/report calls require a complete signed recipe, trust-store,
  rule, subject, and observation binding, and the approval receipt must cover
  the report, recipe, and trust-store files. The CLI injects the private
  runtime bridge through `runHuntRecipe`, preserving existing trust, catalog,
  entitlement, approval, redaction, and structured-result gates.
- **Safety:** Missing runtime or binding returns explicit `not_attemptable`
  without starting a process. `verglos_hunt_before_write` runs only the bounded
  fast-path preflight and explicitly refuses arbitrary recipe synthesis.
- **Verification:** Shared build, MCP build/typecheck, MCP **29/29** tests,
  CLI typecheck, CLI public-boundary audit, and the existing HUNT-009 execution
  tests pass. The full CLI package regression emitted no failures.
- **Hosted:** Platform matrix `37617790266` and self-scan `37617790257` are
  queued on the exact head at capture; no hosted result is claimed yet.
- **Limitation:** HUNT-009 and HUNT-010 remain unchecked pending trusted and
  licensed publisher roots, bounded hosted execution qualification, and
  independent review. No production, provider, payment, database, deployment,
  or external-recipe operation occurred.
