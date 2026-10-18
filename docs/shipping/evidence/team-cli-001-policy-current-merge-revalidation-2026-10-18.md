# TEAM-CLI-001 current merged-head policy revalidation — 2026-10-18

## Scope

This packet updates the code-side evidence to the current public CLI merge.
It does not claim provider activation, a live SCM App installation, a hosted
policy row, or an authenticated hosted observation. `TEAM-CLI-001` remains
open for those external artifacts.

Repository: `Top-Notchh-Solutions/verglos-cli`

Exact implementation commit: `8da4617d34196be2c9fcd86c166259ef82984f28`

Exact normal merge: `50bcab42eadfa8796d86d1f7a8aaee3010c65647`

The merge is regular and preserves the substantive contribution history. No
squash, rebase, force-push, empty, duplicate, artificial, or documentation-only
contribution was used.

## Environment and commands

The commands ran in the disposable detached worktree already used for the
current merged-head package qualification. No public source file was changed.

```text
pnpm build
pnpm --filter verglos typecheck
pnpm --filter verglos exec node --import tsx --test --test-concurrency=1 \
  src/organization-policy-cache.test.ts \
  src/organization-policy-fetch.test.ts \
  ../shared/src/organization-policy.test.ts
git diff --check
```

Results:

- workspace build: **8/8 packages successful**;
- CLI typecheck: **passed**;
- focused organization-policy tests: **10 passed / 0 failed / 0 skipped**;
- diff check: **passed**;
- verified `HEAD`: `50bcab42eadfa8796d86d1f7a8aaee3010c65647`.

The tests cover exact organization/repository scope, active-signer and
policy-digest binding, revoked/tampered envelopes, bounded remote resolution,
verified offline-cache fallback, atomic cache writes, symlink/tamper refusal,
credential-safe fetch, timeout/unavailable-remote fallback, and external
endpoint rejection before credentials are attached.

## Acceptance boundary

This revalidates the implemented policy client only. The row still requires:

1. an authorized least-privilege SCM App installation and repository binding;
2. corresponding server-held signer/provider credentials and webhook handling;
3. a published canonical policy row; and
4. authenticated hosted signed-fetch, cache, offline, and cross-tenant
   qualification against the live binding.

The existing provider audit found only Vercel and Neon organization
installations, with no dedicated Verglos SCM App or Preview GitHub App
credential surface. Owner authority routes the next action but does not create
that provider event. `TEAM-CLI-001` remains unchecked; `TEAM-CLI-002` and
`TEAM-WEB-006` remain dependency-blocked. Score remains **232 checked / 48
open / 280 total (82.9%)**.

No provider, Vercel, database, registry, customer, deployment, or Production
state changed.
