# ACCEPT-007 adjudication validator · 2026-10-23

## Implementation

Added `scripts/validate-hunt-adjudication.mjs` and the
`acceptance:hunt:validate` command. The validator requires a digest-bound
frozen sample manifest of at least 100 findings, reproducibility command
metadata bound to each sample, exactly two distinct reviewers per sample who
are not the implementation author, one allowed label per review, and a
post-label resolution for every disagreement. Environment failures and
out-of-scope exclusions require bounded reason digests. The emitted report
contains aggregate counts and digest-only sample metadata; it does not copy
findings, commands, source, payloads, or reviewer identity.

## Verification

- Hunt-adjudication validator contracts: **6/6 passed**.
- The adjacent acceptance contract suite passed **63/63**.
- Study-protocol validation, syntax validation, and `git diff --check`: passed.

## Boundary

This is ACCEPT-007 implementation evidence only. No 100-sample study was run,
no independent reviewer sign-off was fabricated, and no Hunt/AppSec,
provider, Production, customer/recipient, publication, or final release gate
was claimed. No backlog checkbox changed; nothing was deleted or overwritten.
The live score remains **244 checked / 36 open / 280 total (87.1%)**.
