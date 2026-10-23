# ACCEPT-005 authorized workflow byte binding · 2026-10-23

## Implementation

The authorized-workflow file runner now supports an explicit evidence root and
verifies execution-report, execution-evidence, and deletion/expiry-evidence
digests against bounded regular-file bytes. CLI execution requires all three
paths; path escapes, missing required paths, symlinks, changed files, and
mismatches fail closed. The workflow still never claims customer acceptance
from owner-controlled or synthetic evidence.

## Verification

- Authorized-workflow, release, and bounded-reader focused contracts:
  **30/30 passed**.
- Real temporary-root report/evidence/deletion files matched their declared
  digests; valid-but-wrong and missing-path cases were rejected.
- Syntax validation and `git diff --check`: passed.

## Boundary

This is ACCEPT-005 implementation evidence only. No external repository was
contacted, no customer/recipient acceptance was claimed, and no provider,
Production, independent-review, AppSec/Hunt, publication, or final release
action occurred. No backlog checkbox changed; nothing was deleted or
overwritten. The live score remains **244 checked / 36 open / 280 total
(87.1%)**.
