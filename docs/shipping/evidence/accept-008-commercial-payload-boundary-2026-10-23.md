# ACCEPT-008 commercial evidence payload boundary · 2026-10-23

## Implementation

Private commit `fba771c3` binds every commercial event's `evidenceDigest` to
the canonical event kind, subject digest, observation timestamp, and facts.
Changing a checkout, repeat-use, support, hosted-cost, recipient-value, or
allowance fact without regenerating the evidence digest now fails closed before
commercial aggregation.

## Verification

```text
node --test scripts/validate-commercial-acceptance.test.mjs scripts/score-comprehension-test.test.mjs scripts/build-acceptance-evidence-bundle.test.mjs scripts/freeze-release-candidate.test.mjs scripts/reconcile-release-gates.test.mjs scripts/run-final-regression.test.mjs scripts/read-bounded-json.test.mjs scripts/triage-public-oss-corpus.test.mjs scripts/validate-authorized-workflow.test.mjs
pnpm acceptance:study-protocols:check
node --check scripts/validate-commercial-acceptance.mjs
git diff --check
```

The adjacent acceptance set passed **48/48**, including commercial fact
tampering rejection. Study-protocol, syntax, and diff checks passed. No plan
agreement, checkout, billing, customer, provider, Production, publication, or
release state changed; nothing was deleted.

## Boundary

This closes the commercial-evidence payload-integrity slice for `ACCEPT-008`;
it does not close the row. Actual commercial evidence and independent/final
acceptance remain open. The live score remains **244 checked / 36 open / 280
total (87.1%)**.
