# ACCEPT-006 participant-provenance boundary · 2026-10-24

## Implementation

Private commit `85e0b211d7c8002d0ae2d6a67b8aadb1d55a261f` makes participant
provenance explicit in the comprehension scorer. Every participant must now
declare either `consenting-participant` or `owner-controlled-synthetic`.
Synthetic contract fixtures are classified in the result and can never be
silently represented as participant acceptance. The scorer keeps
`acceptanceStatus: open`, requires the same six-question rubric and consent
window checks, and emits only participant/answer digests.

## Verification

- `scripts/score-comprehension-test.test.mjs`: **11/11** passed;
- synthetic runs report `evidenceClass: owner-controlled-synthetic` while
  acceptance remains open;
- missing and unknown participant provenance is rejected;
- adjacent acceptance contract suite: **51/51** passed;
- study-protocol, syntax, and `git diff --check`: passed.

This is implementation and provenance-boundary evidence only. No participant
identity, answer, customer/recipient acceptance, independent review, provider
or Production result, or final release decision was fabricated.

