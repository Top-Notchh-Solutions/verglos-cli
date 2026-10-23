# DIST-002 registry response boundary · 2026-10-23

## Implementation

The public CLI release preflight now bounds the npm registry metadata response
before parsing it. `validatePublishedMetadata` enforces a 1 MiB UTF-8 byte
limit, uses a streaming reader with fatal UTF-8 decoding when a response body
is available, bounds fallback `.text()` responses by encoded byte length, and
cancels the reader on failure. Oversized and invalid response bytes fail
closed before package identity or version validation can proceed.

- **Repository:** `Top-Notchh-Solutions/verglos-cli`
- **Branch:** `codex/dist002-registry-response-boundary-20261023`
- **Commit:** `dedcc90d` (`fix(release): bound npm preflight metadata reads`)
- **Pull request:** #193
  (`https://github.com/Top-Notchh-Solutions/verglos-cli/pull/193`)
- **Changed files:** `scripts/publish-public-package.mjs` and
  `scripts/publish-public-package.test.mjs`

## Verification

- `pnpm build` passed with 8 successful tasks.
- `pnpm typecheck` passed with 14 successful tasks.
- The complete release-contract test set passed **60/60**. It covers the
  publication preflight, workflow contract, release tag/artifact checks,
  clean-consumer verification, release sidecars, license/SBOM inventory,
  package surface, packed manifests, artifact files, and rollback evidence.
- `git diff --check` passed.
- The regression test rejects a registry metadata response larger than the
  1 MiB bound.

## Boundary and disposition

PR #193 is open and its hosted checks were queued at evidence capture; no
merge is claimed. No npm package was published, no tag or release was
created, and no workflow dispatch or provider write was performed. The
owner-confirmed `NPM_TOKEN` repository secret is not consumed by this
OIDC-protected publication path.

This is implementation evidence only. DIST-002 remains open for the required
provider/trusted-publisher lifecycle, completed publication/provenance, and
final acceptance. The shipping score remains **244 checked / 36 open / 280
total (87.1%)**. Nothing was deleted or overwritten.
