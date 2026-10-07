# HUNT-009 entitlement gate — 2026-10-07

## Implementation

CLI PR #76 adds a paid-capability check before the `hunt --execute-*` path
loads or executes a report, recipe, trust store, or approval receipt. The
execution path now requires `hunt.critical` in addition to its existing
signed-recipe, approval, supported-catalog, subject/rule binding, and bounded
runtime checks.

## Verification

- Code commit: `71de29fa55524880dae51e0012591a591e64149d`.
- Branch was merged normally with current `origin/main` in `17d0813` to
  resolve stale PR lineage; pushed PR head is
  `17d0813737cda980ccb366c5adf948bda2e293a3`.
- Focused Hunt/process suite: **54/54 pass** from `packages/cli`.
- CLI package TypeScript typecheck and `git diff --check` pass.
- Process regression: a Free invocation returns one bounded
  `CAPABILITY_REQUIRED` JSON result and does not read execution inputs.

## Boundary

This is code-side security qualification only. HUNT-009 remains unchecked
pending hosted cross-platform verification, trusted/licensed recipe provenance,
bounded execution qualification, and independent review. No production,
customer, provider, or private-fixture operation occurred.
