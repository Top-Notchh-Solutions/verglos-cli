# ACCEPT-006 comprehension scorer implementation — 2026-10-19

## Scope

This packet records the real private acceptance scorer implemented for
`ACCEPT-006`. It qualifies the scoring/data-handling substrate only. It does
not fabricate participant responses, close the participant gate, or replace
independent review.

## Implementation

- Implementation commit: `6430a38` (`feat(acceptance): add bounded comprehension scorer`)
- Regression commit: `423daecc` (`test(acceptance): qualify comprehension scoring boundaries`)
- Command: `acceptance:comprehension:score INPUT.json OUTPUT.json`
- Script: `scripts/score-comprehension-test.mjs`

The scorer binds a run to an exact `sha256:` artifact digest and frozen
six-question rubric. It requires all six unique answers, a consent window that
covers completion, bounded answer sizes, and digest-only participant identity.
It derives correctness from rubric terms rather than trusting a caller-supplied
boolean, detects forbidden critical claims, refuses secret-like answers, and
emits only answer digests in the result. The result always preserves
`acceptanceStatus: open` and requires independent review.

## Verification

```text
node --test scripts/score-comprehension-test.test.mjs scripts/acceptance-story-plan.test.mjs
pnpm acceptance:protocol:check
pnpm acceptance:study-protocols:check
git diff --check
```

Results:

- Acceptance-plan and scorer contracts: **7/7 passed, 0 failed, 0 skipped**.
- Existing external-workflow protocol validation: passed.
- Existing comprehension/Hunt study protocol validation: passed.
- Diff check: passed.

## Acceptance boundary

No participant identity, raw answer, customer repository, provider, billing,
Production, or AppSec state was used or changed. No participant run was
invented. `ACCEPT-006` remains unchecked pending the preregistered run with
real consenting developers/leads/recipients, redacted raw-answer handling,
aggregate results, and independent scoring review. Score remains **239
checked / 41 open / 280 total (85.4%)**; AppSec/Hunt remains held.
