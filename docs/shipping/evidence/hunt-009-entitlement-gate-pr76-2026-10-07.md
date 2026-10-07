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
- CLI package TypeScript typecheck, build, and `git diff --check` pass.
- Process regression: a Free invocation returns one bounded
  `CAPABILITY_REQUIRED` JSON result and does not read execution inputs.
- Hosted Platform matrix run `37612897011` passes in-toto and all nine
  Ubuntu/macOS/Windows Node 20/22/24 cells. Hosted Self-scan run
  `37612897033` also passes; all 11 hosted checks are green.

## Boundary

This is code-side security qualification only. HUNT-009 remains unchecked
pending trusted/licensed recipe provenance, bounded execution qualification,
and independent review. No production,
customer, provider, or private-fixture operation occurred.

## Provenance projection follow-up

PR #76 commit `c8a2e4b` now includes the verified feed id/origin/digest,
trust-store digest, recipe digest, redacted license id/source/text digest,
`executionAuthorized: true`, and `legalClearance: false` in the structured
execution result. License text, recipe inputs, and approval identity are not
projected.

Focused Hunt/process tests remain **54/54 pass**; CLI typecheck, build, and
`git diff --check` pass locally. The pushed PR head is
`c8a2e4b4bf337a332a003ac9296a6d3bbde15d9a`; hosted platform-matrix and
self-scan runs `37614239691`/`37614239664` are pending at capture, with in-toto
passed. HUNT-009 remains unchecked because trusted/licensed publisher roots,
bounded execution qualification, and independent review are still open.

## Pre-runtime trust preflight follow-up

PR #76 commit `67debee` verifies the trust store and exact recipe rule/subject
binding before loading the private runtime or validating the supported
catalog. Focused Hunt/process tests pass **55/55**, typecheck/build/diff check
pass, and the pushed head is
`67debee964c0c6be736d247793ec1d6faa7babb9`. Hosted checks restarted after the
push; no hosted result is claimed yet. HUNT-009 remains unchecked because
trusted/licensed publisher roots, bounded execution qualification, and
independent review remain open.
