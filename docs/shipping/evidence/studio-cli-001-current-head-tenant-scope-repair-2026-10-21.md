# STUDIO-CLI-001 current-head tenant-scope repair · 2026-10-21

## Scope

This packet records the code-side repair and clean-source qualification for
`STUDIO-CLI-001`. It does not close the row. The remaining row contract still
requires an approved numeric paid/non-production hosted allowance and an
authorized independent Studio recipient/customer acknowledgement with hosted
and audit evidence.

## Exact implementation

- **Repository:** `verglos-web`
- **Source commit:** `cb2302179533a7bc73eccbcb17b0c350685cc5cc`
- **Implementation worktree:**
  `/Users/anuragyadav/Developer/TopNotchh-Workspace/verglos-web/.worktrees/studio-entitlement-recipient-20261019`
- **Detached qualification worktree:**
  `/private/tmp/verglos-web-studio-current-20261021.0S42Xd`
- **Commit:** `fix(web): bind Studio allowance to authorized capability plan`

The exact current source initially exposed a real defect: the Studio client
workspace tenant route imported raw `getDb()` and performed a separate
commercial-plan lookup. The current full Web suite caught this as a tenant
boundary contract failure (`892 pass / 1 fail / 24 skipped`). The route now
carries the authorized commercial plan through the centralized capability
guard, fails closed with `503` if an authorization seam cannot provide that
plan, and retains all tenant-scoped reads, writes, transaction, audit, and
same-origin checks. The route no longer imports or constructs an unscoped DB.

The authorization context carries the plan as typed result data; the default
authorization path still performs the authorized commercial lookup internally.
The contract test now asserts the plan-bound allowance path and rejects a raw
database import. This avoids passing the scoped tenant facade into the
commercial root lookup, whose root tables are not tenant-owned.

## Qualification

All commands ran against the committed source or its fresh detached worktree:

- Focused Studio/auth/tenant suite: **41/41 passed**, 0 failed, 0 skipped.
- `pnpm test`: **893/893 passed**, 0 failed, **24 explicit skips** in the main
  suite; the pretest suite also completed with 0 failures (**56 passed / 6
  skipped**).
- `pnpm typecheck`: exit **0**.
- `pnpm build`: exit **0**; Next.js compiled and generated **49/49** pages.
- `pnpm db:check`: exit **0**, `Everything's fine`.
- `pnpm db:migrations:check`: exit **0**, **43** ordered PostgreSQL
  migrations verified.
- `git diff --check`: exit **0**; the detached qualification worktree was
  clean.

The host emitted the repository's existing Node engine warning (`Node
v26.4.0`, package contract `22.x`); it did not affect any command result.

## Disposition and boundary

This is substantive implementation and local current-source qualification.
`STUDIO-CLI-001` remains unchecked because no approved numeric paid/non-
production hosted allowance or authorized recipient/customer acceptance was
created by this work. The fix was not deployed: the earlier Preview fixture
deploy remains tied to its recorded historical commits, and no Production,
Preview, provider, payment, database, customer, legal, registry, or AppSec
state changed. No credentials or customer data were used.

The next actionable external artifact is the approved hosted Studio allowance
plus authorized recipient/customer acknowledgement and corresponding hosted
audit record. AppSec/Hunt remains held at `HUNT-008` through `HUNT-011`,
`QUAL-CLI-004`, and dependent rows.

**Live score:** `239 checked / 41 open / 280 total (85.4%)`.
