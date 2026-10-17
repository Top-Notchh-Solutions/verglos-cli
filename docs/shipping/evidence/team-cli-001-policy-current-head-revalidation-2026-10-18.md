# TEAM-CLI-001 current-head policy revalidation — 2026-10-18

## Scope

This packet revalidates the already-implemented organization-policy client on
the exact public CLI head. It is code and local-contract evidence only; it is
not production signer activation, live hosted fetch evidence, GitHub App
installation evidence, or SCM provider evidence.

## Source and environment

- Repository: `https://github.com/Top-Notchh-Solutions/verglos-cli`
- Exact commit: `fa77496b43d040fe8be977315078502e9e85b947`
- Checkout: clean disposable worktree from `origin/main`
- Platform: Darwin 25.5.0 arm64
- Node: `v26.4.0`
- pnpm: `9.15.9`
- Public/private boundary: no files were changed or pushed

## Commands and results

After `pnpm install --frozen-lockfile`, the successful verification sequence
was:

```text
pnpm build
pnpm --filter verglos typecheck
pnpm --filter verglos exec node --import tsx --test --test-concurrency=1 \
  src/organization-policy-cache.test.ts \
  src/organization-policy-fetch.test.ts \
  ../shared/src/organization-policy.test.ts
git diff --check
```

- Workspace build: **8/8 packages successful**.
- CLI typecheck: passed.
- Focused policy tests: **10 passed / 0 failed / 0 skipped**.
- Diff check: passed.
- Worktree: clean.

The tests cover exact organization/repository scope, active signer and policy
digest binding, revoked/tampered envelopes, bounded remote resolution,
verified offline-cache fallback, atomic cache writes, symlink/tamper refusal,
credential-safe fetch, timeout/unavailable-remote fallback, and external
endpoint rejection before credentials are attached.

## Remaining row contract

TEAM-CLI-001 remains unchecked. The missing acceptance artifacts are:

1. activate the production/Preview signer and trust root with the approved
   policy row;
2. run the authenticated hosted policy fetch/cache/offline/cross-tenant
   qualification against that activation; and
3. record the authorized SCM/provider installation and live provider evidence.

Owner authority routes these actions but does not create the provider event or
hosted observation. TEAM-CLI-002 and TEAM-WEB-006 remain dependency-blocked
until the policy/provider contract is live. This row is not AppSec-held.
