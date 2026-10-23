# CLI release-contract qualification — 2026-10-06

Exact source: `955412516b96cc09393e78c43bf7d02b9abd05d9`.

Ran:

```text
node --test scripts/license-inventory.test.mjs scripts/generate-sbom.test.mjs \
  scripts/verify-release-artifacts.test.mjs scripts/package-surface-audit.test.mjs \
  scripts/publish-workflow-contract.test.mjs
```

Result: **15 passed, 0 failed, exit 0**.

The tests verify deterministic license/SBOM generation, package entrypoints and
public package identity, absence of install hooks/implicit Trivy dependencies,
checksum and symlink refusal, release sidecar shape, and fail-closed refusal
of unresolved license blockers. These are release-contract tests, not legal
approval or publication evidence; LIC-002/003 and DIST-002/003/006 remain
open.
