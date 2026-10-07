# QUAL-WEB-005 privacy/deletion/retention qualification evidence · 2026-10-07

## Scope

This is a bounded code and PostgreSQL fixture qualification of the existing
privacy/deletion/retention decision and projection surfaces. It does not claim
the full QUAL-WEB-005 gate: hosted deletion-worker execution, legal/customer
held-record decisions, consent inventory, vendor deletion, backup/log
retention, and end-to-end production deletion evidence remain open.

Repository: `verglos-web` `main` at
`cbc0f5a89179995569308695419d4578c57ce716`.
No source files were changed in this qualification batch.

## Evidence run

Docker health was checked before the run. A bounded temporary
`postgres:18-alpine` container named `verglos-qual-web-005-postgres` was
started on host port 55438 with a newly created `verglos_test` database, then
stopped after the run. Image ID:
`sha256:d3e1620b530c944afa6e887d22eb899824da68e19c52024bf98f5220c88a65b2`.
No project or production data was used.

Command:

```text
TEST_DATABASE_URL=postgres://postgres@127.0.0.1:55438/verglos_test node --import tsx --test src/lib/qual/qual-web-suites.test.ts src/lib/organizations/studio-retention-export.test.ts src/lib/organizations/dashboard-record-view.test.ts src/lib/organizations/dashboard-records-repository.integration.test.ts
```

Result: 46 tests passed, 0 failed, 0 skipped.

The run covered:

- privacy deletion admits only the requested hosted kinds and preserves
  customer-held record bytes;
- legal holds block deletion and active holds govern retention;
- cross-user, non-pending, and held account-deletion requests fail closed;
- deletion requests require bounded expiry and valid reasons;
- retention ceilings, warnings, inactive targets, and contract/legal/deletion
  holds are deterministic;
- hosted record projections verify persisted content and remain tenant-scoped;
- foreign-tenant records remain excluded from the dashboard repository;
- export cursors and page sizes reject cross-tenant/scope drift and unsafe
  bounds;
- accessibility/performance qualification surfaces fail closed on absent,
  negative, or non-finite measurements.

The local run used Node `v26.4.0` while the package declares Node `22.x`.
The full Web Verify run on the adjacent PR #150 passed the hosted type/build/
schema/security workflow, but that does not convert this fixture run into
hosted deletion acceptance.

## Boundary and production state

QUAL-WEB-005 remains unchecked. No production database read/write, migration,
deletion, provider/payment operation, deployment, credential use, or customer
operation occurred. The repository worktree's pre-existing untracked
`.worktrees/` directory was preserved.
