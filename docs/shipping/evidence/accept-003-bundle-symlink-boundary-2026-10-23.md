# ACCEPT-003 bundle symlink boundary · 2026-10-23

## Implementation

Private commit `73756396` hardens
`scripts/build-acceptance-evidence-bundle.mjs` so evidence content is read
through an opened regular-file handle with `O_NOFOLLOW` where supported,
opened-handle identity checks, and size/identity rechecks after reading. A
symlinked evidence path is rejected instead of being followed and hashed as
trusted evidence.

## Verification

```text
node --test scripts/build-acceptance-evidence-bundle.test.mjs scripts/freeze-release-candidate.test.mjs scripts/reconcile-release-gates.test.mjs scripts/run-final-regression.test.mjs scripts/read-bounded-json.test.mjs scripts/triage-public-oss-corpus.test.mjs scripts/score-comprehension-test.test.mjs scripts/validate-commercial-acceptance.test.mjs scripts/validate-authorized-workflow.test.mjs
pnpm acceptance:study-protocols:check
node --check scripts/build-acceptance-evidence-bundle.mjs
git diff --check
```

The adjacent acceptance set passed **47/47**, including the symlink rejection
regression. Study-protocol, syntax, and diff checks passed. No provider,
Production, customer, recipient, publication, or release state changed; nothing
was deleted.

## Boundary

This closes the evidence-reader implementation slice for `ACCEPT-003`; it does
not close the row. Reproducible reviewer sign-off and required external/hosted
acceptance evidence remain open. The live score remains **244 checked / 36
open / 280 total (87.1%)**.
