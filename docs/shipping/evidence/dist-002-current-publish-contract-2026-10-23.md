# DIST-002 current publication-contract qualification — 2026-10-23

## Exact source and provider boundary

- **CLI source:** `3d4bca1f3d306a2d69798d0af58f1361cec69620`.
- **Workflow:** `.github/workflows/publish.yml`.
- **Registry/provider action:** none. No tag was created or dispatched and no
  package was published in this qualification.

## Verification

The current-head contract suite passed **17/17** with zero failures:

- `publish-workflow-contract.test.mjs`
- `publish-public-package.test.mjs`
- `verify-release-artifacts.test.mjs`
- `verify-release-tag.test.mjs`
- `platform-matrix-contract.test.mjs`

The workflow contract is bound to stable-only immutable tags, exact tag/commit
verification, the protected `release` environment, serialized publication,
GitHub OIDC provenance, seven exact public packages, release artifact upload
before publication, and `VERGLOS_FINAL_RELEASE_READY=true`. It explicitly
rejects `NPM_TOKEN`, `NODE_AUTH_TOKEN`, manual dispatch, and mutable prerelease
promotion. The repository secret `NPM_TOKEN` exists, but wiring it into this
workflow would violate the no-long-lived-token contract and was not done.

## Disposition

This is code-side `DIST-002` evidence only. Protected environment approval,
final readiness, legal/release acceptance, and one complete immutable stable
publication with provenance remain outstanding. No provider, registry, tag,
Production, or release action occurred; nothing was deleted or overwritten.
