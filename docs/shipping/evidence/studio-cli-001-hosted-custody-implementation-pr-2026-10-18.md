# STUDIO-CLI-001 hosted custody implementation evidence — 2026-10-18

## Scope

This packet records the current public implementation and qualification of the
hosted client-projection custody path. It is code-side evidence for
`STUDIO-CLI-001`; it does not close the backlog row because the required
independent hosted-recipient redaction observation and authorized Studio
recipient/customer acceptance are still absent.

## Public source and history

- Repository: `https://github.com/anuragyadav-git/verglos-web`
- Pull request: #188, `feat(studio): add hosted client projection custody`
- PR assignee: `anuragyadav-git`
- Base before change: `832b357f5fa8809c5876ed00f0d1b2abb8f5c453`
- Implementation commit: `112d7a954261b37d8122d53f20c9dbb04bc28a5b`
- Access-audit regression commit: `877665e6877747d362ca3d14e962c8f1b46f7d39`
- Normal merge commit: `a94ff8e352f29f75860340fab69fb472af25924f`
- Merge date: 2026-10-18 UTC

The PR was merged with a regular merge commit. The two substantive commits
remain separate; no squash, rebase, force-push, empty, duplicate, artificial,
or documentation-only contribution was used.

## Implemented surface

- `src/lib/organizations/client-projection.ts` defines the bounded redacted
  projection contract, safe-field allowlist, private-field refusal, exact
  tenant/workspace/record/approval binding, digest binding, expiry, and size
  limit.
- `src/app/api/v1/organizations/[organizationId]/projects/[projectId]/client-projections/route.ts`
  provides tenant/project-scoped GET and approval-bound POST custody. Responses
  are private/no-store; POST replay is idempotent for the exact identity scope
  and conflicts on a different scope.
- `drizzle/0039_client_projection_custody.sql` persists the bounded custody
  record with organization/project foreign keys, digest and expiry checks, and
  tenant/project indexes.
- `src/lib/db/schema.ts` and `scripts/migration-audit.ts` include the new
  persistence surface.
- `src/lib/organizations/client-projection.test.ts`, the route integration
  test, and tenant/migration audit regression coverage exercise the contract.

## Verification

All checks below were run in the disposable Web worktree before the public PR
was merged:

- Full Web test: **902 tests, 878 passed, 24 explicit skips, 0 failed**.
- `pnpm build`: passed.
- `pnpm typecheck`: passed.
- `pnpm db:check`: passed.
- `pnpm db:migrations:check`: passed; **40 ordered migrations** verified.
- `node --import tsx --test scripts/migration-audit.test.ts`: **6/6 passed**.
- `node --import tsx --test src/lib/organizations/client-projection.test.ts`:
  **2/2 passed**.
- Route integration against an ephemeral PostgreSQL 15 Alpine container pinned
  to `sha256:2bf082886c059b4cf5af3f9e8d3a8916c35699062899061c13bc32d5921c631a`:
  **1/1 passed**.
- `node scripts/check-public-boundary.mjs`: passed.
- `git diff --cached --check`: passed.
- Hosted PR checks: Vercel Preview Comments, Vercel deployment,
  GitGuardian Security Checks, and `typecheck-and-schema`: passed.

## Remaining acceptance boundary

This implementation does not prove what an independently authorized external
recipient receives from a deployed hosted environment. It also does not
provide a real Studio recipient/customer acceptance run. `STUDIO-CLI-001`
therefore remains unchecked. The independent AppSec gate and all unrelated
provider, customer, publication, and final-release gates remain separate.

No production, customer, provider, registry, account, database, or deployment
state was changed by this qualification. The PostgreSQL container was
ephemeral and removed after the route test.
