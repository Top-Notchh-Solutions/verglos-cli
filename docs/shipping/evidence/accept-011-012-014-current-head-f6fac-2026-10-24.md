# ACCEPT-011/012/014 current-head corpus and final-regression execution — 2026-10-24

## Candidate and corpus

- CLI candidate: `f6facdc5ad312325f00618e3e463dc81569c4341` (merged current
  `main` after the shipping-ledger merges).
- Web candidate: `257e1cc8e0b467d16966433033589111f62f56f0` (merged Web PR #283).
- Version contract: `2.0.0-alpha.4`; no package publication or release was
  performed.
- Eight full, non-shallow public-OSS fixture clones were scanned at their
  exact frozen commits with telemetry disabled and private local output.
- The current CLI ran 40 plan-bound scans using the explicit founder-only
  `--as-plan` simulation: 8 fixtures × Free/Pro/Team/Studio/Enterprise.

## Current execution result

- **8/8** exact-commit fixtures verified.
- **13,494** files walked.
- **351** observations across **23** rule groups.
- **0** coverage gaps; all four required architecture shapes present.
- Triage classification: **351** observations / **23** rule groups;
  adjudication remains open and no customer claim is made.
- Final regression matrix: **400/400** fixture × plan × role × tenant keys.
- **0** failed runs, **0** finding regressions, and **0** performance
  regressions.
- Missing scenario keys: **0**; authorization matrix: **50/50**, complete and
  bound to Web `257e1cc8`.
- Total finding delta: **0**; total duration delta: **+184,610 ms**. The
  validator recorded no per-scenario performance regression under its 25%
  threshold.
- Validator recommendation: **no-go**, with `truthRegistry`, `riskReview`,
  `heldOutCorrection`, `providerLifecycle`, and `finalRelease` open.

## Byte-bound artifacts

- Current corpus verification: `.local-evidence/public-oss-corpus-2026-10-24-cli-f6fac-v1/verification.json`
  — SHA-256 `576a80ef51fa9a5915b80e499b73fd0900e6b4f45f5eb77a8b700e4114c42377`.
- Current triage: `.local-evidence/public-oss-corpus-2026-10-24-cli-f6fac-v1/triage.json`
  — SHA-256 `e967dbae57f4d3ecbd0f624865b30189a963f73f5bf6af2ab73fdc6d27b4f544`.
- Current Web role/tenant matrix: `accept-014-web-role-tenant-matrix-current-2026-10-24.json`
  — SHA-256 `f83ad4c99e00cc865df070264e1292e30b8be0921482ff53bcda1be6fa6de39e`.
- Current final-regression input: `accept-014-final-regression-input-2026-10-24-f6fac-v1.json`
  — SHA-256 `32073a6be3cc72d2c1ecb8ca9a18199df15e6008c5c0782696a72ffd826c8b2f`.
- Current final-regression result: `accept-014-final-regression-result-2026-10-24-f6fac-v1.json`
  — SHA-256 `a357789be7227bf75518afcd459c7ba0d9b5201684c9a987ded612d0b04828d8`.

## Boundary and disposition

This is current local owner-authorized public-OSS analysis and synthetic
product-contract regression evidence. It is not customer consent, recipient
acceptance, upstream endorsement, provider publication, independent review,
AppSec/Hunt review, human/field-CWV evidence, or final release sign-off. No
source upload, Production database, npm registry, payment provider, tag,
release, or GitHub Actions run was used. Keep `ACCEPT-011`, `ACCEPT-012`, and
`ACCEPT-014` unchecked. Score remains **246 checked / 34 open / 280 total
(87.9%)**, split **13 AppSec-dependent / 21 non-AppSec**.
