# Current-head local release artifact candidate · 2026-10-24

## Exact execution

- CLI implementation commit: `aad2c74395a5c381c955ab9dfab7462295564840`;
  merged normally by CLI PR #241 as `8e87c81d2e6cd28dd79e05eff18ccedd3e93b8d9`.
- Candidate version: `2.0.0-alpha.4`.
- Candidate artifact root: `.local-evidence/verglos-release-candidate-2026-10-24-aad2c743/`.
- Web candidate context remains the current rechecked head
  `791500d4dbc495312287287f692a6fc39120e3a2`.

## Verification

- Fresh packaging produced **7/7** public npm archives.
- Release sidecars and origin metadata produced **8/8** required sidecars.
- Checksum, origin, archive-member notice, and strict seven-package release
  verification passed: **15 artifacts verified** with zero mismatches.
- `RELEASE_METADATA.json` binds the archive set to the exact CLI source commit;
  its SHA-256 is
  `f3ee55c0cee25bceb2e7d3ab3c7579100f2677f6c3c6f2f34edb84fc7ccac0f9`.
- `SHA256SUMS` covers all 15 files; its SHA-256 is
  `5b40743fa4db1397b6720feeee33e917846c6d3b1917ac0254eac450e28ec1ea`.
- CycloneDX metadata and SPDX namespace both bind `2.0.0-alpha.4`.
- Dependency inventory reports **250** package entries, **1** bundled
  component, and **0** unresolved review blockers.
- Clean consumer installed all seven archives, imported all libraries,
  executed Verglos `2.0.0-alpha.4`, observed no external-engine installation,
  and completed the bounded signed Hunt fixture.
- Release-sidecar and package tests passed **14/14**; the CLI build passed
  **8/8**. The local full lockfile metadata was supplied by an existing
  checkout dependency tree and the original worktree dependency directory was
  restored afterward.

## Boundary

This is fresh local release-candidate evidence. It is not npm publication,
OIDC provenance/registry attestation, a Production provider lifecycle receipt,
customer or recipient acceptance, independent review, AppSec/Hunt review, or
final release/go-no-go sign-off. No npm tag, registry publication, payment,
database, customer, Production, or GitHub Actions state was written. The
candidate remains intentionally unreleased.

`DIST-003`, `DIST-006`, and the release-contract portions of `ACCEPT-009`,
`ACCEPT-010`, and `ACCEPT-014` receive implementation evidence only; no
backlog checkbox changes. The score remains **245 checked / 35 open / 280
total (87.5%)**, partitioned as **13 AppSec-dependent / 22 non-AppSec** rows.

