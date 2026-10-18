# TEAM-CLI-001 organization-owner policy authorization fix — 2026-10-18

## Scope

This packet records a public Web implementation slice for the next
non-AppSec backlog row. The repository-policy endpoint previously authorized
license bearers only through the legacy user-to-primary-tenant migration
mapping. That made a valid owner of a newly created organization unable to
fetch its explicitly organization- and repository-bound policy.

The fix adds `isActiveOrganizationOwner`, which queries the exact requested
organization and requires the license user to be its active owner. A missing
owner match returns the existing bounded `404 policy unavailable` response;
database failures remain `503 policy unavailable`. The legacy migration
resolver remains unchanged for the v2 entitlement path.

## Exact implementation

- Repository: `https://github.com/anuragyadav-git/verglos-web`
- Pull request: `https://github.com/anuragyadav-git/verglos-web/pull/192`
- Assignee: `anuragyadav-git`
- Branch: `codex/fix-scm-mixed-scope-20261018`
- Implementation commit: `4579c27`
- Regression-test commit: `f8b420e`
- Branch head: `f8b420e012b69c9d8b6052c9da16c1633582b4c7`
- Merge policy: regular reviewable history; no squash, rebase, force-push,
  empty, duplicate, or artificial commit

## Verification

- Focused SCM and tenant-scope contract tests: **22 passed, 0 failed,
  0 skipped**.
- `pnpm typecheck`: passed.
- `git diff --check`: passed.
- READY Preview deployment: `dpl_7DhQxht5dgG655VBqU1a1NnzZj21`.
- Preview URL:
  `https://verglos-ew4flng1y-anuragyadav20062002s-projects.vercel.app`.
- Hosted build generated **47/47** pages and included the policy route.
- GitGuardian and Vercel Preview Comments: passed at packet time.
- Hosted `typecheck-and-schema`: still running at packet time; no green result
  is claimed until GitHub reports it.

## Boundary and disposition

This is code and hosted-build evidence only. No Production, customer,
provider installation, billing, npm registry, database migration, or AppSec
state was changed. No credentials, private keys, license bearers, raw
provider payloads, or customer source are recorded.

`TEAM-CLI-001` remains unchecked. The row still requires the authorized SCM
provider installation, server-held provider credentials, a published signed
organization policy, authenticated live CLI fetch/cache/offline/cross-tenant
observations, and reconciliation evidence. `TEAM-CLI-002` and `TEAM-WEB-006`
remain dependent. Score remains **232 checked / 48 open / 280 total (82.9%)**.
