# DIST-002 current-head npm registry observation — 2026-10-24

## Read-only provider check

The existing `scripts/verify-npm-publication.mjs` verifier was run against
version `2.0.0-alpha.4`, the current merged CLI candidate
`d3ea64df01a8c7cd2879ddf54c97276240b49536`, and all seven public packages.
The verifier exited **2** with **0/7 accepted** and **17** recorded failures.
The byte-bound JSON result is:

`dist-002-npm-alpha4-current-head-observation-2026-10-24.json`

Result digest:
`sha256:527087b521fe5aa8368b7d7aca32e1d5f74d7b565419a95be5a51764a36f48d6`.

## Observed state

- `verglos@2.0.0-alpha.4`: package and attestation HTTP 404.
- `@verglos/hunt@2.0.0-alpha.4`: package and attestation HTTP 404.
- The other five scoped packages have alpha.4 registry records, but their
  SLSA provenance is bound to older source commit
  `ed318f06b97771f45cc6970f745868fb1aa09404`, not the current candidate.
- `providerWritePerformed: false`; no npm token, tag, publish, or Actions run
  was used.

## Disposition

This is a fresh provider read-only observation, not a publication attempt. It
confirms that DIST-002/003 still require a single trusted seven-package
publication with current-candidate provenance, followed by the declared
review and release acceptance. Keep both rows unchecked. The authoritative
score remains **245 checked / 35 open / 280 total (87.5%)**, partitioned as
**13 AppSec-dependent / 22 non-AppSec**. Nothing was deleted.
The additive bundle verifies **299** files with zero mismatches, secret
scanning passed, and manifest
`sha256:d6ff82f18bdffff797acadceb313547b50588ae128b9f5d5904b084ab0dde393`:
`acceptance-evidence-bundle-2026-10-24-dist-002-npm-observation-v2.json`.
