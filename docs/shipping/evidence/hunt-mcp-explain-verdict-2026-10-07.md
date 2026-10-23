# HUNT MCP verdict explanation · 2026-10-07

- **Source:** CLI PR #76, commit `7022408`.
- **Implementation:** `verglos_hunt_explain_verdict` now returns a bounded
  interpretation for `true`, `false`, and `not_attemptable` without rerunning
  Hunt, loading a runtime, authorizing execution, or making network calls.
- **Safety:** Finding identifiers are bounded and control-character rejected;
  the shared Pro entitlement remains enforced. The response explicitly states
  that a verdict is not production exploitability or security certification.
- **Verification:** MCP package tests pass **38/38** across all shards;
  typecheck, build, and `git diff --check` pass.
- **Regression:** Root `pnpm test` completes with **12/12 Turbo tasks
  successful** and 0 failed tasks.
- **Limitation:** HUNT-009 remains open, and HUNT-010 remains open because
  finding/report/before-write execution tools are still alpha stubs and the
  dependent Hunt qualification gates are unmet. No backlog checkbox changed.
- **Boundary:** No browser, provider, payment, production, database,
  deployment, credential, or external-recipe operation occurred.
