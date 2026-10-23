# ACCEPT-006 comprehension rubric digest boundary · 2026-10-23

## Implementation

Private commit `fca46980` binds the comprehension artifact digest to the
canonical subject, decision, rubric, and forbidden-term payload. The scorer
now rejects a rubric changed without a corresponding artifact digest change,
so a caller cannot silently tune the rubric to participant answers while
reporting the old artifact identity.

## Verification

```text
node --test scripts/score-comprehension-test.test.mjs scripts/build-acceptance-evidence-bundle.test.mjs scripts/freeze-release-candidate.test.mjs scripts/reconcile-release-gates.test.mjs scripts/run-final-regression.test.mjs scripts/read-bounded-json.test.mjs scripts/triage-public-oss-corpus.test.mjs scripts/validate-commercial-acceptance.test.mjs scripts/validate-authorized-workflow.test.mjs
pnpm acceptance:study-protocols:check
node --check scripts/score-comprehension-test.mjs
git diff --check
```

The adjacent acceptance set passed **48/48**, including rubric-tampering
rejection. Study-protocol, syntax, and diff checks passed. No participant,
customer, provider, Production, publication, or release state changed; nothing
was deleted.

## Boundary

This closes the rubric-integrity implementation slice for `ACCEPT-006`; it does
not close the row. The preregistered consenting participant run, aggregate
evidence, independent scoring review, and final acceptance remain open. The
live score remains **244 checked / 36 open / 280 total (87.1%)**.
