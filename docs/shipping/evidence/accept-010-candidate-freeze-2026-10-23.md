# ACCEPT-010 candidate-freeze contract implementation · 2026-10-23

## Implementation

The private shipping toolchain now has
`scripts/freeze-release-candidate.mjs`, exposed as
`acceptance:release:freeze`. It binds an exact CLI commit, Web commit, version,
and digest-only artifact manifest. Every critical gate is explicit, required
but absent artifacts are listed, and a recorded `go` is rejected while any
artifact or gate remains open.

The output distinguishes `blocked` from `ready-for-signoff`. A ready manifest
does not itself perform publication, deployment, provider action, customer
acceptance, independent review, or final owner sign-off.

## Verification

```text
node --test scripts/freeze-release-candidate.test.mjs scripts/reconcile-release-gates.test.mjs scripts/score-comprehension-test.test.mjs scripts/validate-commercial-acceptance.test.mjs
pnpm acceptance:study-protocols:check
node --check scripts/freeze-release-candidate.mjs
git diff --check
```

Results: **15/15 tests passed**, study-protocol validation passed, syntax
validation passed, and the diff check passed. Coverage includes blocked
candidate reporting, missing-artifact accounting, recorded-GO refusal, a
fully clear control case, unsafe path/digest rejection, and the adjacent
release/acceptance contracts.

## Boundary

This closes the candidate-freeze implementation gap only. It does not close
`ACCEPT-010`, because the actual critical acceptance evidence, trusted
publication/provenance, independent review, and final release decision remain
open. No provider, Production, customer, or release state changed, and
nothing was deleted.
