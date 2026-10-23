# ACCEPT-008 commercial evidence provenance boundary · 2026-10-24

## Implementation

Private commit `0533b21106bf3081d5bca6fc60efc238fd902114` requires every
commercial event to declare one of the bounded provenance classes:

- `owner-controlled-synthetic` for validator/integration fixtures;
- `observed-commercial-evidence` for an authorized redacted Test-Mode or
  other permitted commercial observation;
- `consenting-recipient` for evidence supplied by a named consenting tester or
  recipient.

The class is included in the event's digest-bound payload. A class change
without a new digest fails closed. Reports expose the class (or
`mixed-commercial-sources`) and keep `acceptanceStatus: open` for every class;
synthetic fixtures therefore cannot be presented as commercial acceptance.

## Verification

```text
node --test scripts/validate-commercial-acceptance.test.mjs
node --test scripts/validate-commercial-acceptance.test.mjs scripts/score-comprehension-test.test.mjs scripts/build-acceptance-evidence-bundle.test.mjs scripts/freeze-release-candidate.test.mjs scripts/reconcile-release-gates.test.mjs scripts/run-final-regression.test.mjs scripts/read-bounded-json.test.mjs scripts/triage-public-oss-corpus.test.mjs scripts/validate-authorized-workflow.test.mjs
pnpm acceptance:study-protocols:check
node --check scripts/validate-commercial-acceptance.mjs
git diff --check
```

The focused commercial suite passed **9/9** and the adjacent acceptance
contracts passed **63/63**. Protocol, syntax, and diff checks passed.

## Boundary

This is provenance and validator implementation evidence only. It does not
fabricate a plan agreement, checkout, billing/provider receipt, support record,
recipient response, independent review, or final release decision. ACCEPT-008
remains open for actual commercial evidence and independent/final acceptance.
The score remains **244 checked / 36 open / 280 total (87.1%)**. Nothing was
deleted or overwritten.
