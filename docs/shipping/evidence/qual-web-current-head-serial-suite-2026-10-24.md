# Web current-head serial suite · 2026-10-24

## Controlled execution

- Web implementation source: `58fe7e3cc557adb9fafc4bc766fa6afe743fa3a2`;
  the same implementation is present on merged Web `origin/main`
  `d8f415b486b57ab6fa3885d734a4904e11ac435a`.
- Runtime: Node `v26.4.0` and pnpm `10.34.5`. The package declares Node 22.x;
  pnpm reported that engine warning, but the suite completed successfully.
- Command: `pnpm test:serial` from the clean Web worktree. No GitHub Actions,
  provider credential, Production database, customer data, or external write
  was used.

## Result

The configured serial pretest/test suite completed in **10.574 seconds**:

- **928** total tests
- **904** passed
- **24** designed database-dependent skips
- **0** failures
- **0** cancellations
- **0** todos

The serial runner executed the repository's deterministic pretest and test
commands with one worker, preserving the intended isolation for disposable
PostgreSQL fixtures. The skipped cases require an explicitly supplied isolated
test database and were not silently counted as passes.

## Shipping disposition

This refreshes current-head Web regression evidence. It does not substitute
for the skipped database-backed run, authenticated Production/customer
evidence, human/field review, independent review, AppSec/Hunt review, or final
release approval. No checkbox changed. The authoritative tracker remains
**245 checked / 35 open / 280 total (87.5%)**, partitioned as **13
AppSec-dependent / 22 non-AppSec**. Nothing was deleted.
