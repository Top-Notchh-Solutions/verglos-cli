# ACCEPT-013 correction-loop version binding — 2026-10-23

Private shipping implementation commit `068f12e6` binds the ACCEPT-013
held-out correction-loop candidate to the bounded SemVer contract. A malformed
candidate version now fails before training/holdout observations or
adjudications are evaluated.

Verification passed:

- adjacent acceptance/release contracts: **60/60**;
- the new correction-loop malformed-version regression passed;
- acceptance study protocol validation: passed;
- validator syntax and `git diff --check`: passed.

This is code-side protocol integrity evidence only. `ACCEPT-013` remains
unchecked for the actual frozen-corpus run, independent adjudication,
customer/recipient acceptance where required, provider/hosted evidence, and
final release decision. No external state changed and nothing was deleted or
overwritten. The live score remains **244 checked / 36 open / 280 total
(87.1%)**.
