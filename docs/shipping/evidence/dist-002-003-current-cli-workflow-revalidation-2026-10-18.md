# DIST-002/003 current CLI release-workflow revalidation — 2026-10-18

## Scope

This packet records local contract and boundary verification for the trusted
publishing and release-attestation workflow on the current CLI merge. It does
not publish npm, create a release tag, access a registry, approve a protected
environment, or claim a trusted keyless attestation.

## Source

- Repository: `Top-Notchh-Solutions/verglos-cli`
- Normal merge: `9eba5102a1c0f9d7ee13b28bb2cc28bb50766eae`
- Verification worktree: disposable clean worktree for CLI PR #129
- Public source was not modified by these checks.

## Verification

Executed:

```text
node --test scripts/publish-workflow-contract.test.mjs scripts/platform-matrix-contract.test.mjs scripts/verify-release-artifacts.test.mjs scripts/package-surface-audit.test.mjs
node scripts/check-package-contents.mjs
node scripts/check-public-boundary.mjs
git diff --check
```

Results:

- Release, publishing, platform-matrix, and package-surface contract tests:
  **11/11 passed**, zero failures or skips.
- Package contents audit: **7 public packages passed**.
- Public-boundary audit: passed; no internal shipping documents or founder
  assets are tracked in the public CLI surface.
- The companion DIST-001 packet records the 7-archive clean-consumer run and
  archive SHA-256 values.

## Acceptance mapping

This revalidates the implementation-side checks for `DIST-002` and `DIST-003`.
Both rows remain unchecked for protected environment approval, trusted
keyless npm/OIDC publication identity, immutable publication/attestation,
release-note/checksum delivery, legal release clearance, and final acceptance.
No registry, tag, npm, provider, or Production state changed.

## Privacy boundary

No credentials, npm tokens, OIDC claims, private keys, registry payloads,
customer source, or deployment secrets were recorded.

