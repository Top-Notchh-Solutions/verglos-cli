# Policy digest canonical-alignment evidence · 2026-10-06

## Scope

Web PR #146, branch `feat/policy-digest-canonical-alignment`, commit
`5763632`, merged to Web `main` as `88a7791`. This batch addresses the code-side
R-042 interoperability mismatch between Web's legacy shallow-key digest and the
CLI's recursive canonical JSON digest.

- Adds explicit `legacy-top-level-v1` and `canonical-json-v1` algorithms.
- Preserves legacy verification and existing stored-row behavior.
- Defaults newly written policy rows to `canonical-json-v1` and persists the
  selected algorithm in additive migration `0027_policy_digest_algorithm.sql`.
- Returns the algorithm with policy reads and verifies the declared algorithm on
  policy writes.
- Does not rewrite existing rows or activate the hosted policy endpoint.

## Verification

- Focused policy lifecycle tests: 13 passed, 0 failed.
- Full Web suite: 864 total, 842 passed, 22 explicit environment-gated skips,
  0 failed.
- `pnpm typecheck`, `pnpm build`, Drizzle check, and ordered migration check
  passed; the hosted check verified 28 ordered PostgreSQL migrations.
- Public-boundary, negative-boundary, truth-registry, dependency audit,
  CycloneDX SBOM, license inventory, tracked-secret, and diff checks passed.
- Hosted Verify run `37488304350` passed all checks; Vercel, Preview Comments,
  and GitGuardian passed.

## Boundary

No production migration, policy-row rewrite, hosted policy API activation,
provider/customer operation, or release acceptance occurred. Existing rows remain
legacy unless explicitly migrated under a reviewed rollout; TEAM-CLI-001,
PLAN-CLI-001, and R-042's production activation/reconciliation gates remain
open.
