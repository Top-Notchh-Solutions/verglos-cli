# TEAM-CLI-001 organization policy dashboard digest slice — 2026-10-18

## Scope and privacy boundary

This packet records the public Web implementation that exposes the exact
organization policy digest needed by the Team policy-fetch contract. It is
implementation and Preview qualification evidence only. It does not claim a
paid entitlement, a provider delivery, a customer acceptance, or a completed
CLI fetch/cache/offline/cross-tenant run. No secret value, license bearer,
private key, browser cookie, customer source, or private database value is
recorded here.

## Public source and contribution history

- Repository: `anuragyadav-git/verglos-web`.
- PR: [#193](https://github.com/anuragyadav-git/verglos-web/pull/193), assigned
  to `anuragyadav-git` and merged normally.
- Implementation commit: `9c34a5f44881fc3ef9a80ab77b180ef7de158405`.
- Regression-test commit: `9513caa8ae963f275396d13941d294df03cee525`.
- Normal merge commit: `104d236f328170165f1f43867a0556994504000e`.
- No squash, rebase, force-push, empty, duplicate, or artificial commit was
  used.

The organization Policy App Router page now resolves the authenticated
organization through `requireDashboardOrganization`, reads policies with the
existing tenant predicate, joins project metadata only for the same
organization, and renders bounded identity fields: policy ID, version, status,
digest, digest algorithm, effective time, project binding, and repository.
The policy document itself is not rendered.

## Verification

The clean disposable worktree
`/tmp/verglos-web-hosted-qualification-20261018` recorded:

- `git diff --check` — exit 0.
- `node --import tsx --test src/lib/organizations/policy-lifecycle.test.ts` —
  **16 passed / 0 failed / 0 skipped**.
- `pnpm typecheck` — exit 0. The local runtime emitted only the repository
  engine warning because it used Node `v26.4.0`/pnpm `10.34.5` while the
  repository requests Node `22.x`.
- `pnpm build` — exit 0; Next.js generated **47/47** pages.
- Hosted Actions run `39128023770`, job `117677152225` — `typecheck-and-schema`
  passed.
- Hosted GitGuardian and Vercel Preview Comments checks — passed.

## Preview deployment

- Vercel deployment: `dpl_8xTcsqGpsJd81CSgoJepWng6TP7G`.
- Target/status: Preview / Ready.
- URL: `https://verglos-kyocl1q7s-anuragyadav20062002s-projects.vercel.app`.
- Alias: `https://verglos-web-git-codex-orga-863f18-anuragyadav20062002s-projects.vercel.app`.
- Vercel inspection reported a 2m01s build and the deployed App Router output.
- No production deployment, provider write, payment, entitlement, or browser
  state change occurred in this slice.

## Acceptance mapping and remaining boundary

This advances the `TEAM-CLI-001` requirement for a visible policy digest and
tenant-scoped organization policy identity. The row remains unchecked. The
remaining row-specific artifacts are:

1. a valid paid/non-production entitlement mapped to the exact organization
   owner and bound repository;
2. authenticated CLI signed-envelope fetch against that live binding;
3. visible digest equality, atomic cache, offline-TTL, expiry, and
   cross-tenant denial observations; and
4. provider delivery/reconciliation evidence for the bound SCM integration.

`TEAM-CLI-002` and `TEAM-WEB-006` remain dependency-blocked. HUNT-008 through
HUNT-011 and `QUAL-CLI-004` remain in the independent AppSec hold set. This
slice does not alter any checkbox or AppSec status.

## Score and artifact status

The live private backlog remains **232 checked / 48 open / 280 total
(82.9%)**. This packet is private shipping evidence and must not be copied to
the public repository.
