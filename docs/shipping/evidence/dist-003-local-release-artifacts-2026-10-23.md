# Local current-candidate release artifacts · 2026-10-23

The exact CLI head `3d4bca1f3d306a2d69798d0af58f1361cec69620` (`2.0.0-alpha.4`)
was built locally without publishing or tagging. The repository release
pipeline produced the raw artifact directory:

```text
/Users/anuragyadav/Developer/TopNotchh-Workspace/.local-evidence/verglos-release-candidate-2026-10-23.oV7Lyd
```

The pipeline generated seven npm archives plus `SHA256SUMS`, third-party
notices, CycloneDX and SPDX SBOMs, dependency-license inventory,
external-license records, clean-consumer verification, release notes, and
release metadata. The clean-consumer contract tests passed **2/2** and the
strict release verifier passed **15 artifacts** with the exact seven-package
set and matching notices in every archive. Build passed **8/8** and typecheck
passed **14/14**.

The additive freeze report
`acceptance-candidate-freeze-2026-10-23-artifacts.json` records 16 present
artifact entries, zero missing artifacts, seven still-open gates, and blocked
`no-go` state. Its SHA-256 is
`sha256:5f89f57d3ca6a5f07fdee8cedd14fce1b1f83cc010aec42668d88ea80c88a028`.

This is local release-artifact preparation for `DIST-002`/`DIST-003`; it does
not publish, attest, deploy, create a tag, or close those rows. Provider
trusted-publisher setup, immutable publication/provenance, independent review,
and final release acceptance remain open. No backlog checkbox changed; the
score remains **244 checked / 36 open / 280 total (87.1%)**. Nothing was
deleted or overwritten.
