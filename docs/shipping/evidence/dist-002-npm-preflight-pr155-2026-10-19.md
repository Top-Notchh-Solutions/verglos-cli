# DIST-002 npm publication preflight hardening · PR #155 · 2026-10-19

## Scope

This packet records the merged original-logic hardening for the public npm
publication workflow. It improves the release boundary but does not claim an
actual npm publication, keyless publisher approval, legal release clearance,
or final acceptance. The DIST-002 row remains unchecked.

## Source and contribution history

- Repository: `Top-Notchh-Solutions/verglos-cli`
- Pull request: https://github.com/Top-Notchh-Solutions/verglos-cli/pull/155
- Implementation: `0e05ec44`
- Regression coverage: `3abae6d8`
- Normal merge to `main`: `abf41a0068936927010dab626b21a4e3087de10f`
- The pull request used a regular merge commit. No squash, rebase,
  force-push, or artificial contribution was used.

## Original logic implemented

The release workflow now delegates each of the seven public package
publication steps to `scripts/publish-public-package.mjs`. The helper reads
and validates the archive manifest, requires the exact package name and
version expected by the release, requires the canonical npm registry, and
performs a bounded exact-version registry preflight.

- HTTP `200` means the exact version already exists and the step skips
  idempotently.
- HTTP `404` means the exact version is absent and the real `npm publish`
  command runs with `--access public --provenance --tag alpha`.
- Redirects, other HTTP statuses, malformed archives, identity mismatches,
  timeouts, and network failures fail closed before publication.

The workflow retains its release environment, OIDC `id-token: write`
permission, immutable-tag gate, license/SBOM/checksum checks, clean-consumer
qualification, and release concurrency controls. No long-lived npm token or
registry error is treated as permission to publish.

## Verification actually run

- Focused publisher/workflow/artifact/tag contracts: **11/11 passed**.
- Full relevant release contract batch: **30/30 passed**.
- Workspace build: **8/8 tasks passed**.
- `pnpm install --frozen-lockfile`: passed.
- Publish workflow YAML parse: passed.
- `git diff --check`: passed.
- Hosted platform matrix `39258180496`: Ubuntu, macOS, and Windows Node
  20/22/24 plus in-toto all passed (**12/12**).
- Standard/provenance validation `39258181018`: passed.
- Verglos self-scan `39258180412`: passed.

## Disposition

`DIST-002` remains unchecked. The implementation now fails closed on npm
registry uncertainty and preserves the real provenance publication path, but
the row still requires protected publisher approval, trusted keyless npm/OIDC
configuration, legal/release clearance, an actual immutable publication and
attestation, and final acceptance. No npm registry, signing, provider,
Production, entitlement, or customer write occurred during this increment.

Score remains **239 checked / 41 open / 280 total (85.4%)**. AppSec/Hunt
remains held separately.
