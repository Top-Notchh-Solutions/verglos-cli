# ACCEPT-014 final regression contract · 2026-10-23

## Implementation

The private shipping toolchain now exposes
`acceptance:release:regress` through
`scripts/run-final-regression.mjs`. The contract accepts a digest-bound frozen
corpus manifest and candidate CLI/Web commits, then validates and compares
bounded baseline/candidate measurements for plan, user-role, and tenant-mode
scenarios.

The runner requires coverage for all canonical product plans (`free`, `pro`,
`team`, `studio`, `enterprise`), all organization roles (`owner`, `admin`,
`approver`, `member`, `viewer`), both single- and multi-tenant modes, and every
fixture in the frozen corpus. Each scenario is bound to the candidate CLI
commit and must carry safe relative evidence paths with SHA-256 digests only.

It reports finding, file-count, and duration deltas. It recommends `no-go`
when any scenario fails, coverage is incomplete, a performance threshold is
exceeded, findings increase, or a required truth/risk/correction/provider/
release gate is open. A requested `go` is rejected in those states. The output
contains bounded metadata and does not copy source, snippets, credentials,
customer data, or raw reports.

## Verification

- `scripts/run-final-regression.test.mjs`: **4/4** passed;
- syntax validation: passed; and
- `git diff --check`: passed.

This is the executable implementation boundary for `ACCEPT-014`; it does not
claim that the final corpus has been rerun, that held-out correction is
complete, or that a final release/go-no-go sign-off exists. The row remains
open for its actual frozen-corpus scenario evidence, dependent correction and
provider gates, and final decision. Nothing was deleted.
