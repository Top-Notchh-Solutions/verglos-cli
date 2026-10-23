# HUNT-008 contract recheck — 2026-10-11

## Current code-side result

The exact CLI shipping worktree commit `2b05390f99811fb70f4dcdc1fca0b9662ed79f2c`
was rechecked with:

```text
pnpm --filter @verglos/hunt test
```

The Hunt package build completed. The executable package tests passed; the
Docker integration cases were explicitly skipped because the required pinned
image/Linux namespace fixture was not present. The run confirms the current
code-side contracts:

- signed feed and trusted-root verification;
- embedded license-text digest verification;
- exact recipe/rule/subject binding;
- approval receipt validation and execution authorization;
- fixed supported A1 catalog with positive, negative, timeout, and
  adapter-failure fixtures;
- bounded restricted-process execution and cleanup;
- fail-closed malformed, drifted, untrusted, and unsupported inputs.

The current CLI execution projection explicitly reports that signed license
evidence is not the same as legal clearance. No customer repository, provider,
Production, database, entitlement, or secret state was accessed or changed.

## Disposition

Keep `HUNT-008` unchecked and parked. The remaining acceptance conditions are
not code-only work:

1. an authorized publisher root and immutable recipe provenance/license record;
2. an authorized company/legal disposition for the exact recipe content; and
3. an independent AppSec review tied to the exact CLI commit and Linux/Docker
   adversarial results.

The existing functional trust/approval wiring is not treated as a substitute
for those approvals. This is a dependency transition, not a score increase.
After this record, the next queue assessment is the first dependency-ready
unchecked Web billing row, `PLAN-WEB-012`.
