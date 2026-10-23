# TEAM-CLI-001 focused policy-client verification — 2026-10-08

## Tested source

- Repository: private CLI shipping worktree
- Commit: `7d060b2852551cc017bbb2b5f70bad22843e7273`
- Runtime: local Node test runner with the existing pinned workspace toolchain

## Commands and results

- `packages/shared/src/organization-policy.test.ts`: **3 passed / 0 failed**
- `packages/cli/src/organization-policy-cache.test.ts`: **2 passed / 0 failed**
- `packages/cli/src/organization-policy-fetch.test.ts`: **2 passed / 0 failed**
- `pnpm --filter verglos typecheck`: **passed**
- `pnpm --filter @verglos/shared typecheck`: **passed**

The tests cover exact organization/repository scope binding, active-signer and
digest verification, revoked/tampered rejection, bounded atomic cache writes,
symlink/tamper rejection, remote fetch, credential non-disclosure, and
verified-cache fallback when the remote is unavailable.

## Limits

This is current code and local-contract evidence only. It does not prove the
production signer/public-key pin, deployed tenant activation, or a valid
hosted organization policy fetch. Those gates remain open and no backlog
checkbox changed.
