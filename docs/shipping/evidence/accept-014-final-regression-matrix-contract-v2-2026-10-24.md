# ACCEPT-014 final-regression matrix contract v2 · 2026-10-24

## Contract correction

The private shipping validator now requires every fixture × plan × role ×
tenant-mode key, not merely one observed value for each dimension. For the
current eight-fixture corpus that is **400 expected scenario keys**. It also
requires a digest-bound Web product-contract receipt with all 50 plan/role/
tenant cells and the candidate Web commit.

The validator remains fail-closed: missing scenario keys, failed runs,
regressions, or open gates keep the recommendation `no-go`.

## Current execution

The v3 input is bound to CLI `aad2c74395a5c381c955ab9dfab7462295564840`, Web
`cb266b83406bbfffbd5ab02189556e60973a63a6`, and version `2.0.0-alpha.4`.
The rerun verified the authorization receipt and produced:

- 12 executed CLI scenario runs;
- 400 expected full-matrix keys;
- 388 missing scenario keys;
- 0 failed runs, 0 finding regressions, and 0 performance regressions;
- all five release gates still open, therefore `no-go`.

The missing keys are real coverage gaps, not relabeled owner-only output.
Evidence:

- `accept-014-final-regression-input-2026-10-24-v3.json`;
- `accept-014-final-regression-result-2026-10-24-v3.json`;
- `accept-014-web-role-tenant-matrix-pr282-2026-10-24.json`.

No provider transaction, customer data, database mutation, deletion, npm
publication, tag, release, or GitHub Actions run was used.
