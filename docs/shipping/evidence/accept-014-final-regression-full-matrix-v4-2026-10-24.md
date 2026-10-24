# ACCEPT-014 full local regression matrix · 2026-10-24

The current candidate was executed against the eight exact-commit public OSS
fixtures with all five plan simulations, five organization roles, and both
single- and multi-tenant product-contract modes. The run contains **400/400**
expected fixture × plan × role × tenant keys, with **0** missing keys and
complete digest-bound Web authorization evidence.

## Receipt

- CLI candidate: `cd9d572e28462741103cb21a2274e5892939d5d4`
- Web candidate: `cb266b83406bbfffbd5ab02189556e60973a63a6`
- Version: `2.0.0-alpha.4`
- Fixture count: **8**; architecture shapes: small, multi-user,
  multi-tenant-team, enterprise-like
- Local plan runs: **40/40** exit 0, complete coverage
- Final matrix runs: **400**
- Failed runs: **0**
- Missing scenario keys: **0**
- Matrix authorization evidence: **complete** (50/50 product-contract cells)
- Input SHA-256: `sha256:c9ab7e087ad84d0e81bbf9ca67fd25069a624a081728a7195e5f71c1a3e19ce2`
- Result SHA-256: `sha256:b6eea606bb6205934b4c3143fc4330e4d18b8ca7ba1db660a8f8c2650de4cdb3`

## Fail-closed disposition

The result is **no-go**. It records **400 finding regressions**, **110
performance regressions**, a total finding delta of **+2,800**, and five open
gates: truth registry, risk review, held-out correction, provider lifecycle,
and final release. The CLI report is plan-bound; role/tenant behavior is bound
to the digest-verified Web product-contract matrix, not claimed as hosted
browser or provider execution. No customer data, publication, payment,
deletion, AppSec/Hunt review, or GitHub Actions run was used.

The matrix gap is therefore closed as an implementation/evidence-preparation
slice, but ACCEPT-014 remains unchecked for correction, independent review,
provider lifecycle, and final release decision.

Evidence JSON:

- `accept-014-final-regression-input-2026-10-24-v4.json`
- `accept-014-final-regression-result-2026-10-24-v4.json`
