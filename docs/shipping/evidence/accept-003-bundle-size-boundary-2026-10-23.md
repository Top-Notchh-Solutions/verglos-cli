# ACCEPT-003 evidence-bundle size boundary · 2026-10-23

## Implementation

The acceptance-evidence bundle reader now enforces a **16 MiB per-file bound**
before opening an evidence path, after opening it, and after reading it. Content
is read in bounded chunks through the opened descriptor; regular-file identity
and final byte count are rechecked before hashing. Oversized files and files
that grow during the read fail closed without entering the bundle.

## Verification

- Bundle-builder and bounded-reader focused contracts: **6/6 passed**.
- The full adjacent acceptance contract suite: **57/57 passed**.
- Study-protocol validation, syntax validation, and `git diff --check`: passed.

## Boundary

This is ACCEPT-003 implementation evidence only. It does not claim reviewer,
provider, Production, customer/recipient, independent-review, AppSec/Hunt, or
final release acceptance. No backlog checkbox changed; nothing was deleted or
overwritten. The live score remains **244 checked / 36 open / 280 total
(87.1%)**.
