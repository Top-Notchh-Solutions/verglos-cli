# DIST-003 current-source release-artifact preflight · 2026-10-24

## Exact source

After fast-forwarding the shipping worktree to `origin/main`, exact source was
`6a2f03ec76855d7ecea089e6dc312d3d9ed9391e`. All seven public package
manifests reported version `2.0.0-alpha.4`.

## Verification

- `pnpm build`: **8/8** workspace builds passed.
- Release/artifact contract suite: **57/57** passed with zero failures,
  skips, cancellations, or todos.
- CycloneDX metadata version: `2.0.0-alpha.4`.
- SPDX namespace: `https://verglos.com/spdx/verglos-monorepo-2.0.0-alpha.4`.
- Real packer output: **7/7** public npm archives.
- Packed-manifest audit: passed for all seven archives.
- Real clean-consumer run: installed all seven archives, imported all public
  libraries, executed Verglos `2.0.0-alpha.4`, confirmed no external engine
  installation, and executed the bounded signed A1 fixture with an isolated
  Pro capability fixture.
- Release candidate sidecars: **8/8** generated.
- Strict checksum/origin/archive-notice verifier: **15/15** artifacts passed;
  all archives contained the matching third-party notices.

The disposable output was generated under
`/tmp/verglos-dist003-CL8Z7R/release`; no tracked release artifact was created
or overwritten.

## Shipping boundary

This is exact-source implementation and local artifact-integrity evidence.
DIST-003 remains unchecked for trusted provider publication, immutable external
attestation, final license/release clearance, independent review, and final
acceptance. No npm publication, release tag, GitHub release, provider action,
customer action, paid Actions run, or deletion occurred. Score remains
**246 checked / 34 open / 280 total (87.9%)**, split **13 AppSec-dependent /
21 non-AppSec**.
