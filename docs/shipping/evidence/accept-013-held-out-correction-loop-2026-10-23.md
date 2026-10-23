# ACCEPT-013 held-out correction-loop implementation · 2026-10-23

## Implementation

Private shipping commits `14d916df` and `daf6524f` add
`scripts/run-acceptance-correction-loop.mjs` and the package command
`acceptance:correction:run`.

The protocol is fail-closed and requires:

- a complete, disjoint non-empty train/holdout partition of the frozen corpus;
- exact CLI/Web candidate binding and a corpus manifest digest;
- adjudication for every high-impact finding or claim;
- training adjudications and rule/copy/evidence corrections completed no later
  than the holdout freeze;
- no correction sourced from, applied to, or tuned against a holdout
  observation; and
- a final holdout review bound to the same candidate with explicit
  `tuningAppliedAfterFreeze: false`.

The emitted result is digest-only for adjudications and corrections. It does
not copy source paths, snippets, customer data, or report content.

## Verification

- Correction-loop contract tests: **6 passed / 0 failed**.
- Adjacent corpus-triage and final-regression contract tests: **7 passed / 0
  failed**.
- Combined focused result: **13 passed / 0 failed**.
- Protocol date inputs reject non-string coercion, including `null`.
- Node syntax checks and `git diff --check`: passed.

## Disposition

This closes the missing repository-owned ACCEPT-013 protocol substrate only.
It does not claim that the preregistered held-out corpus run, independent
review, customer acceptance, or final release decision has occurred. The
ACCEPT-013 checkbox remains open, and the AppSec/Hunt-dependent qualification
set remains unchanged. No provider, customer, Production, publication, or
deployment action occurred; nothing was deleted or overwritten.
