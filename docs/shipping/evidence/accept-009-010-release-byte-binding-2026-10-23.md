# ACCEPT-009/010 release byte binding · 2026-10-23

## Implementation

The bounded file reader now exposes digest-preserving reads. The
`acceptance:release:reconcile` file runner can verify every declared evidence
digest against the actual regular-file bytes under an explicit evidence root.
The `acceptance:release:freeze` file runner can likewise verify every present
artifact digest under an explicit artifact root and rejects artifacts marked
absent when they exist. Both commands retain bounded size, no-follow, opened
handle identity, and exclusive output-write protections.

## Verification

- Freeze, reconciliation, bounded-reader, and final-regression focused
  contracts: **22/22 passed**.
- Full adjacent acceptance contract set covering bundle, freeze, reconciliation,
  regression, triage, comprehension, commercial, workflow, and bounded reads:
  **54/54 passed**.
- Acceptance study-protocol validation, syntax validation, and
  `git diff --check`: passed.
- Regression coverage includes a real artifact/evidence file under a temporary
  root, matching digest acceptance, and valid-but-wrong digest rejection.

## Boundary

This is ACCEPT-009/010 implementation evidence only. It does not claim the
actual release reconciliation, candidate freeze, provider publication,
customer acceptance, independent review, AppSec/Hunt review, or final release
sign-off. No backlog checkbox changed, no external state changed, and nothing
was deleted or overwritten. The live score remains **244 checked / 36 open /
280 total (87.1%)**.
