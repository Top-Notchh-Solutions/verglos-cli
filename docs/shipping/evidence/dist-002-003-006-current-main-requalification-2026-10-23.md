# DIST-002 / DIST-003 / DIST-006 current-main requalification · 2026-10-23

## Scope

This packet requalifies the current merged CLI source contracts for trusted
publication, release artifacts, and rollback/revocation. It does not claim an
actual npm publication, provider mutation, legal clearance, or final release
sign-off.

## Source

- Repository: `Top-Notchh-Solutions/verglos-cli`
- Exact source commit: `7d07066f967a2e7899aca6b51f04f306b7071013`
- Working tree: clean detached worktree from `origin/main`

## Commands and results

- `pnpm install --frozen-lockfile`: **passed**.
- `pnpm build`: **8/8 Turbo tasks passed**.
- `pnpm typecheck`: **14/14 tasks passed**.
- `pnpm test`: **13/13 Turbo tasks passed**.
- Focused release contract suite:

  ```text
  node --test scripts/publish-workflow-contract.test.mjs \
    scripts/publish-public-package.test.mjs \
    scripts/verify-release-tag.test.mjs \
    scripts/generate-release-checksums.test.mjs \
    scripts/generate-release-notes.test.mjs \
    scripts/generate-release-origin.test.mjs \
    scripts/verify-release-artifacts.test.mjs \
    scripts/release-rollback-evidence.test.mjs \
    scripts/check-packed-manifests.test.mjs \
    scripts/package-surface-audit.test.mjs
  ```

  Result: **45/45 passed**.
- `git diff --check`: **passed**.
- The rollback rehearsal records all five provider boundaries and preserves
  two historical records without calling npm, a registry, a signing provider,
  a Hunt feed provider, or Vercel.

## Residual gates

No tag, registry publication, provider/Production mutation, customer-data
operation, or release version was created. DIST-002, DIST-003, and DIST-006
remain unchecked for protected/trusted publication, unresolved legal/license
disposition, external attestation/release evidence, and final acceptance.
