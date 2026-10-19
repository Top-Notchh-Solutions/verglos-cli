# ACCEPT-008 commercial evidence validator implementation — 2026-10-19

## Scope

This packet records the real validator substrate for `ACCEPT-008`. It enforces
the commercial-evidence contract without claiming that a plan agreement,
checkout, repeat use, support record, hosted cost, recipient value, or
allowance has actually occurred.

## Implementation

- Implementation commit: `64c1a477` (`feat(acceptance): add commercial evidence validator`)
- Regression commit: `f986f80c` (`test(acceptance): qualify commercial evidence boundaries`)
- Command: `acceptance:commercial:validate INPUT.json OUTPUT.json`
- Script: `scripts/validate-commercial-acceptance.mjs`

The validator requires an exact catalog version/plan/currency/price, numeric
allowances, bounded founder approval and expiry, and distinct digest-bound
records for all seven evidence kinds. It requires two distinct repeat-use
observations, checks checkout and agreement values against the catalog, checks
allowance values against the catalog, requires positive support minutes,
currency-bound hosted cost, and a digest-bound recipient outcome. Its output
contains counts, bounded numeric facts, and digests only; it preserves
`acceptanceStatus: open` and requires independent review.

## Verification

```text
node --test scripts/validate-commercial-acceptance.test.mjs scripts/score-comprehension-test.test.mjs scripts/acceptance-story-plan.test.mjs
pnpm acceptance:protocol:check
pnpm acceptance:study-protocols:check
git diff --check
```

Results:

- Acceptance, comprehension, and commercial contracts: **10/10 passed, 0 failed, 0 skipped**.
- Existing external-workflow protocol validation: passed.
- Existing comprehension/Hunt study protocol validation: passed.
- Diff check: passed.

## Acceptance boundary

No checkout, provider, customer, support, billing, Production, or AppSec
operation was performed, and no commercial result was fabricated.
`ACCEPT-008` remains unchecked pending actual evidence, founder authorization,
recipient value evidence, and the row's independent/final acceptance mapping.
Score remains **239 checked / 41 open / 280 total (85.4%)**; AppSec/Hunt
remains held.
