# ACCEPT-009 release-gate reconciler implementation · 2026-10-23

## Implementation

The private shipping toolchain now has
`scripts/reconcile-release-gates.mjs`, exposed as
`acceptance:release:reconcile`. It accepts an explicit candidate, row-state,
evidence-digest, correction/rollback, gate-state, and decision input and emits
only bounded reconciliation facts. It refuses unsafe evidence paths, duplicate
rows, shipped rows without evidence, invalid commit/digest values, and a
recorded `go` while any row, gate, correction, or rollback item remains open.

The report distinguishes `shipped`, `partial`, and `planned` rows and keeps
the final recommendation fail-closed. A fully clear input is only reported as
`ready-for-signoff`; the tool does not create final owner sign-off, provider
action, customer acceptance, or independent review.

## Verification

```text
node --test scripts/reconcile-release-gates.test.mjs scripts/score-comprehension-test.test.mjs scripts/validate-commercial-acceptance.test.mjs
pnpm acceptance:study-protocols:check
node --check scripts/reconcile-release-gates.mjs
git diff --check
```

Results: **11/11 tests passed**, study-protocol validation passed, syntax
validation passed, and the diff check passed. The tests cover open-gate
reconciliation, partial/planned preservation, recorded-GO refusal, a fully
clear control case, unsafe evidence rejection, and the adjacent comprehension
and commercial validators.

## Boundary

This closes the private reconciler implementation gap only. It does not close
`ACCEPT-009`, because the actual acceptance rows, hosted/provider evidence,
customer/recipient evidence, independent review, and final release decision
remain open. No provider, Production, customer, or release state changed, and
nothing was deleted.
