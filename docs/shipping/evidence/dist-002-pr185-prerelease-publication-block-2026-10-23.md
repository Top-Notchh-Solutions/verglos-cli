# DIST-002 prerelease-publication block · 2026-10-23

## Implementation

- Repository: `verglos-cli`
- Pull request: [#185](https://github.com/Top-Notchh-Solutions/verglos-cli/pull/185)
- Branch: `codex/dist003-release-alpha3-20261023`
- Commit: `4890a1c7` (`fix(release): block prerelease publication`)
- Changed files: `.github/workflows/publish.yml` and
  `scripts/publish-workflow-contract.test.mjs`

The protected publish job now runs only when the ref is a stable
`refs/tags/vX.Y.Z` tag. Tags containing a prerelease suffix such as `-alpha`,
`-beta`, or `-rc` are skipped before the protected release job can publish.
The `release` environment, OIDC `id-token: write`, immutable tag binding, and
no-long-lived-token contract remain unchanged.

## Verification and boundary

- `node --test scripts/publish-workflow-contract.test.mjs`: **2/2 passed**
- `git diff --check`: passed
- PR hosted checks: queued at observation; no hosted pass is claimed.
- No tag, workflow dispatch, registry write, deployment, or package version was
  created by this change. Nothing was deleted.

This protects the owner's policy that public release waits for whole-goal
completion. `DIST-002`/`DIST-003` remain open for complete final publication,
provenance, and acceptance evidence.

