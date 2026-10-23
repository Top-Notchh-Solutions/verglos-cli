# DIST-002 trusted publishing workflow hardening — 2026-10-19

## Scope

This packet records the code-side hardening merged for the trusted npm
publishing workflow. It does not publish npm, create a release tag, approve a
protected environment, exchange credentials, or claim a trusted keyless
attestation.

## Source and merge

- Repository: `Top-Notchh-Solutions/verglos-cli`
- Implementation commit: `35faf9772a9ebd5f499b4f8a3169c097e9a61a13`
- Pull request: #148
- Normal merge commit: `0823b513f2b1810ad9f6afcb8806ba46f61feedb`
- Merge method: normal merge; no squash or rebase

## Implementation

- Removed the manual `workflow_dispatch` publication path.
- Removed `promote_latest`, npm dist-tag mutation, `NPM_TOKEN`, and
  `NODE_AUTH_TOKEN` usage.
- Publication is now reachable only from an immutable `v*` tag and runs the
  release-tag/version check before any `npm publish` step.
- Preserved the protected `release` environment, least-privilege
  `id-token: write` OIDC permission, serialized publication concurrency, and
  `--provenance` on every package publication.
- Extended the existing workflow contract test to fail on manual bypass,
  long-lived npm-token, and mutable dist-tag paths.

## Verification

Local clean-worktree verification used Node `v26.4.0` and pnpm `9.15.9`:

```text
node --test scripts/publish-workflow-contract.test.mjs scripts/verify-release-tag.test.mjs scripts/verify-release-artifacts.test.mjs
pnpm typecheck
pnpm build
pnpm test
node scripts/check-public-boundary.mjs
git diff --check
```

- Release/workflow/artifact/tag checks: **8/8 passed**.
- Typecheck: **14/14** Turbo tasks passed.
- Build: **8/8** package builds passed.
- Full package test graph: **13/13** Turbo tasks passed; existing Hunt A2
  qualification skips remained explicit and were not changed.
- Public-boundary audit and diff check passed.

Hosted PR #148 checks passed:

- CLI platform matrix run `39181627011`: all Ubuntu/macOS/Windows Node 20,
  22, and 24 cells passed; in-toto release binding passed.
- Official standard/provenance validators run `39181626999`: passed.
- Verglos self-scan run `39181627001`: passed.

## Disposition and boundary

This closes the identified code-side manual-token/bypass defect and advances
DIST-002 implementation. `DIST-002` remains unchecked because protected
environment approval, trusted npm publisher enrollment, legal/release
clearance, and an actual immutable publication/attestation have not been
executed. `DIST-003` and `DIST-006` remain separately open. No npm registry,
provider, customer, Production, or AppSec-held state changed.

Score remains **235 checked / 45 open / 280 total (83.9%)**.
