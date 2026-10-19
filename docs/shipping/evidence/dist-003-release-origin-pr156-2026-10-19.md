# DIST-003 release-origin manifest · PR #156 · 2026-10-19

## Scope

This packet records the merged original-logic release-origin increment for
`DIST-003`. It binds the release artifact bundle to its exact source commit,
immutable tag, package version, and artifact digests. It does not claim npm
publication, Sigstore/Fulcio/Rekor identity acceptance, legal clearance, or
final release acceptance. The DIST-003 row remains unchecked.

## Source and contribution history

- Repository: `Top-Notchh-Solutions/verglos-cli`
- Pull request: https://github.com/Top-Notchh-Solutions/verglos-cli/pull/156
- Implementation: `d8d76c36`
- Regression coverage: `02a23684`
- Normal merge to `main`: `72190acae81b454a4a88a0ea8d222c8981ac9a3f`
- The pull request used a regular merge commit. No squash, rebase,
  force-push, or artificial contribution was used.

## Original logic implemented

The real release workflow now creates `RELEASE_METADATA.json` after packing
the seven public archives and generating the release sidecars. The manifest
records the repository, exact 40-character source commit, immutable release
tag, shared package version, and SHA-256 digest plus package identity for
every npm archive and sidecar.

`verify-release-artifacts.mjs` now requires and validates that manifest,
checks that its artifact set is complete, recomputes every listed digest,
checks each archived package manifest against the recorded package/version,
and fails closed on missing, unexpected, stale, symlinked, or mismatched
release material. `SHA256SUMS` also covers the origin manifest, and the
manifest is uploaded with the release evidence before any npm publication.

## Verification actually run

- Focused origin/verifier/workflow contracts: **8/8 passed**.
- Broader release contract batch: **32/32 passed**.
- Typecheck: **14/14 tasks passed**.
- Build: **8/8 tasks passed**.
- `pnpm install --frozen-lockfile`: passed.
- `git diff --check`: passed.
- Hosted platform matrix `39260151443`: Ubuntu, macOS, and Windows Node
  20/22/24 plus in-toto all passed (**12/12**).
- Standard/provenance validation `39260151409`: passed.
- Verglos self-scan `39260151534`: passed.

## Disposition

`DIST-003` remains unchecked. The artifact bundle now carries and verifies
its real source origin, but the row still requires actual immutable
publication and attestation, release-note and license-clearance evidence,
trusted-publishing review, and final acceptance. No npm registry, signing,
provider, Production, entitlement, or customer write occurred during this
increment.

Score remains **239 checked / 41 open / 280 total (85.4%)**. AppSec/Hunt
remains held separately.
