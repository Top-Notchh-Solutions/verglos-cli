# DIST-006 strict rollback-input validation — 2026-10-24

## Scope

The shared rollback/revocation decision boundary now treats runtime input as
untrusted: approval and historical-record preservation must be literal boolean
`true` values, and malformed reasons are rejected without throwing.

## Implementation

- PR #377 merged normally as `b9e411e66a40e52c6856665de6af55248f86464d`.
- Null/non-string reasons fail closed with `target-reference-invalid`.
- Truthy non-boolean approval values fail with `approval-required`.
- Truthy non-boolean history-preservation values fail with
  `history-invalidation-requested`.
- Existing immutable-reference, replacement-identity, and historical-record
  preservation rules remain unchanged.

## Verification

- Shared rollback tests: **7/7 passed**.
- CLI rollback-plan tests: **8/8 passed**.
- Shared typecheck/build passed.
- CLI build passed.
- No npm, registry, engine, Hunt-feed, signing-provider, Vercel, customer, or
  paid Actions state was changed.

## Boundary

This is local DIST-006 decision-boundary implementation evidence. It does not
perform an authenticated provider rollback/revocation or create operational
review and final acceptance evidence. DIST-006 remains open and the score
remains **246 checked / 34 open / 280 total (87.9%)**, split **13
AppSec-dependent / 21 non-AppSec**. Nothing was deleted or overwritten.
