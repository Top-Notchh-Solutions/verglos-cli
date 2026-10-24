# ACCEPT-014 clean-corpus full regression matrix · 2026-10-24

## Corrected execution boundary

The prior v4 receipt used matrix report directories that contained generated
fixture files. The exact-commit public-OSS control reports were already clean
and matched the recorded baseline. This v5 rerun copied only those verified
report bytes into a new private matrix evidence root; the earlier v4 packet is
retained unchanged.

- CLI candidate: `cd9d572e28462741103cb21a2274e5892939d5d4`
- Web candidate: `cb266b83406bbfffbd5ab02189556e60973a63a6`
- Version: `2.0.0-alpha.4`
- Corpus: 8 exact-commit fixtures, all four architecture shapes
- Matrix: 8 fixtures × 5 plans × 5 roles × 2 tenant modes = **400/400**
- Authorization receipt: 50/50 Web product-contract cells, complete and
  bound to Web commit `cb266b83406bbfffbd5ab02189556e60973a63a6`
- Candidate report files: **40/40** present and digest-verified

## Result

The local final-regression validator recorded:

- **400/400** scenario keys present
- **0** failed runs
- **0** finding regressions
- **0** performance regressions
- total finding delta: **0**
- total duration delta: **0 ms**
- authorization evidence: complete
- recommendation: **no-go**

The no-go is still correct because `truthRegistry`, `riskReview`,
`heldOutCorrection`, `providerLifecycle`, and `finalRelease` remain open. This
receipt does not create independent review, provider/Production publication,
customer acceptance, human/field evidence, AppSec/Hunt evidence, or final
release sign-off.

Artifacts:

- `accept-014-final-regression-input-2026-10-24-v5.json` SHA-256
  `c30ade594df319d2708da92fea27c3584d92811af948ca118e6befcab528d504`
- `accept-014-final-regression-result-2026-10-24-v5.json` SHA-256
  `851585c2e443f18bd607d7c901f8d56cce1faf3c078ac771e7292bb804e5d587`
- Clean private matrix root:
  `.local-evidence/final-regression-2026-10-24-cli-cd9d572e-clean-v1`

No source repository, customer data, Production database, npm registry, tag,
release, payment, or GitHub Actions run was changed by this rerun.
