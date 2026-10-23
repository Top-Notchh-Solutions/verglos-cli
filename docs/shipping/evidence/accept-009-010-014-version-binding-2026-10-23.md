# ACCEPT-009 / ACCEPT-010 / ACCEPT-014 candidate-version binding — 2026-10-23

Private shipping implementation commit `049eee35` binds candidate versions in
release reconciliation, candidate freeze, and final regression validation to
the bounded SemVer shape used by the release contract. Empty, malformed, and
overlong-but-otherwise-arbitrary version strings can no longer be accepted as
candidate identity.

The implementation is covered by one regression test in each contract suite:

- `scripts/reconcile-release-gates.test.mjs`
- `scripts/freeze-release-candidate.test.mjs`
- `scripts/run-final-regression.test.mjs`

Verification passed:

- adjacent acceptance/release contracts: **58/58**;
- acceptance study protocol validation: passed;
- syntax checks for all three validators: passed;
- `git diff --check`: passed.

This is code-side integrity evidence only. `ACCEPT-009`, `ACCEPT-010`, and
`ACCEPT-014` remain unchecked for their actual acceptance evidence, hosted or
provider execution where required, independent review, customer/recipient
acceptance where required, and final release decision. No provider, registry,
Production, customer, deployment, publication, or release-sign-off state
changed. Nothing was deleted or overwritten. The live score remains
**244 checked / 36 open / 280 total (87.1%)**.
