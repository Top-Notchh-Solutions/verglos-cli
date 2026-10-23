# ACCEPT-014 Web-candidate binding boundary · 2026-10-23

## Implementation

Private commit `1391acf4` closes a candidate-binding gap in
`scripts/run-final-regression.mjs`. The input already declared an exact Web
commit, but scenario runs were checked only against the CLI commit. Every run
now must carry `webCommit` equal to the candidate's exact Web commit, and the
bounded output preserves that binding. A mismatched Web commit is rejected
before matrix or delta evaluation.

## Verification

```text
node --test scripts/run-final-regression.test.mjs scripts/freeze-release-candidate.test.mjs scripts/reconcile-release-gates.test.mjs scripts/read-bounded-json.test.mjs scripts/triage-public-oss-corpus.test.mjs scripts/score-comprehension-test.test.mjs scripts/validate-commercial-acceptance.test.mjs scripts/validate-authorized-workflow.test.mjs scripts/build-acceptance-evidence-bundle.test.mjs
pnpm acceptance:study-protocols:check
node --check scripts/run-final-regression.mjs
git diff --check
```

The adjacent acceptance set passed **46/46**, including the candidate-Web
mismatch regression. Study-protocol, syntax, and diff checks passed. No
provider, Production, customer, recipient, publication, or release state
changed; nothing was deleted.

## Boundary

This closes the candidate-binding implementation slice for `ACCEPT-014`; it
does not claim that the frozen corpus has been rerun or that a final GO exists.
The actual matrix, dependent correction/provider gates, independent review,
and final decision remain open. The live score remains **244 checked / 36 open /
280 total (87.1%)**.
