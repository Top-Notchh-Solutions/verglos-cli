# ACCEPT-010 freeze artifact-kind boundary · 2026-10-23

## Implementation

Private commit `199e6095` hardens `scripts/freeze-release-candidate.mjs` so a
candidate cannot become `ready-for-signoff` from an arbitrary or incomplete
artifact list. A required, present artifact is now required in each canonical
freeze category:

`version`, `schema`, `migration`, `manifest`, `plan-catalog`, `compatibility`,
`docs`, `runbook`, `notice`, `sbom`, `provenance`, and `rollback`.

The report lists missing categories separately from required artifact paths.
The GO decision remains fail-closed when either list or any critical gate is
open. The test control case now supplies all twelve categories; a regression
proves that a present manifest alone cannot produce a ready freeze.

## Verification

```text
node --test scripts/freeze-release-candidate.test.mjs scripts/reconcile-release-gates.test.mjs scripts/run-final-regression.test.mjs scripts/read-bounded-json.test.mjs scripts/triage-public-oss-corpus.test.mjs scripts/score-comprehension-test.test.mjs scripts/validate-commercial-acceptance.test.mjs scripts/validate-authorized-workflow.test.mjs scripts/build-acceptance-evidence-bundle.test.mjs
pnpm acceptance:study-protocols:check
node --check scripts/freeze-release-candidate.mjs
git diff --check
```

The adjacent acceptance set passed **46/46**, including the incomplete-kind
regression. Study-protocol, syntax, and diff checks passed. No provider,
Production, customer, recipient, publication, or release state changed; nothing
was deleted.

## Boundary

This closes the artifact-inventory implementation slice for `ACCEPT-010`; it
does not close the row. The actual candidate freeze still requires its exact
artifact evidence, dependent acceptance/provider/independent-review gates, and
final sign-off. The live score remains **244 checked / 36 open / 280 total
(87.1%)**.
