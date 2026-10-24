# ACCEPT-014 Web role/tenant matrix implementation · 2026-10-24

## Implementation

Web PR [#282](https://github.com/anuragyadav-git/verglos-web/pull/282) merged
normally as `cb266b83406bbfffbd5ab02189556e60973a63a6`. It adds the reusable
product-contract matrix builder at
`src/lib/organizations/role-tenant-matrix.ts` and a bounded emitter at
`scripts/emit-role-tenant-matrix.ts`.

The emitter executes the existing centralized authorization and capability
functions for every required combination:

- 5 plans: free, pro, team, studio, enterprise;
- 5 organization roles: owner, admin, approver, member, viewer;
- 2 declared tenant modes: single and multi;
- 50 unique cells, with every declared capability admitted only for its plan.

The receipt is digest-bound to the merged Web commit:
`accept-014-web-role-tenant-matrix-pr282-2026-10-24.json`, SHA-256
`sha256:27f43b5d8e5a251dcba79181453eb4a7c627026584276f1b60fe84424409fc1e`.

## Verification

```text
node --import tsx --test \
  src/lib/organizations/role-tenant-matrix.test.ts \
  src/lib/organizations/access.test.ts \
  src/lib/organizations/rbac-matrix.test.ts \
  src/lib/organizations/tenant-data.test.ts \
  src/lib/organizations/tenant-scope.test.ts
```

Result: **31/31 passed**, 0 failed, 0 skipped. `pnpm typecheck` also passed.

This is product-contract implementation evidence. The tenant mode dimension
does not claim a hosted database write, provider lifecycle, customer result,
independent review, AppSec/Hunt review, or final release sign-off.
