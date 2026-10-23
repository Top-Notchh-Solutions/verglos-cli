# Acceptance artifact write boundaries · 2026-10-23

## Implementation

The private acceptance writers now create result artifacts exclusively and
fail closed with `EEXIST` instead of replacing an existing report:

- `scripts/freeze-release-candidate.mjs` (`ACCEPT-010`)
- `scripts/reconcile-release-gates.mjs` (`ACCEPT-009`)
- `scripts/score-comprehension-test.mjs` (`ACCEPT-006`)
- `scripts/validate-commercial-acceptance.mjs` (`ACCEPT-008`)

Each regression confirms that a pre-existing output remains byte-for-byte
unchanged after a second write attempt.

## Verification

```text
node --test scripts/freeze-release-candidate.test.mjs scripts/reconcile-release-gates.test.mjs scripts/run-final-regression.test.mjs scripts/score-comprehension-test.test.mjs scripts/validate-commercial-acceptance.test.mjs
node --check scripts/freeze-release-candidate.mjs
node --check scripts/reconcile-release-gates.mjs
node --check scripts/score-comprehension-test.mjs
node --check scripts/validate-commercial-acceptance.mjs
pnpm acceptance:study-protocols:check
git diff --check
```

Results: **23/23 tests passed**; syntax, study-protocol, and diff checks
passed.

## Boundary

This is artifact-integrity implementation progress only. It does not create
participant, customer, commercial, provider, independent-review, or final
release evidence. ACCEPT-006/008/009/010 remain open, as do their declared
dependencies. Score remains **244 checked / 36 open / 280 total (87.1%)**.
Nothing was deleted.
