# ACCEPT-014 final regression byte binding · 2026-10-23

## Implementation

The final regression file runner now supports explicit corpus and evidence
roots. When the CLI command runs, every fixture must declare a report path and
the runner verifies the report digest and every scenario-evidence digest
against bounded regular-file bytes. Path escape, missing required report paths,
symlinks, changed files, and digest mismatches fail closed. The existing exact
CLI/Web candidate binding, matrix, delta, and no-GO rules remain unchanged.

## Verification

- Final-regression, bounded-reader, freeze, and reconciliation contracts:
  **23/23 passed**.
- Regression coverage includes real corpus/evidence files under temporary roots,
  matching digest acceptance, and valid-but-wrong evidence digest rejection.
- Syntax validation and `git diff --check`: passed.

## Boundary

This is ACCEPT-014 implementation evidence only. It does not claim the actual
frozen-corpus run, held-out correction, provider action, customer acceptance,
independent review, AppSec/Hunt review, or final release decision. No backlog
checkbox changed, no external state changed, and nothing was deleted or
overwritten. The live score remains **244 checked / 36 open / 280 total
(87.1%)**.
