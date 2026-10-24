# ACCEPT-003 record-store read hardening — 2026-10-24

## Scope

The shared content-addressed record store now binds member reads to a stable
opened regular-file handle. This protects local evidence/record reads from a
pathname being swapped after validation and before the bytes are consumed.

## Implementation

- PR #373 merged normally as `e68685db110bef82d86c1c4f058c869e233d413f`.
- Member reads use `O_NOFOLLOW` where the platform exposes it.
- File identity and size are checked before and after the read.
- The existing 50 MB bound and SHA-256 content-address verification remain
  enforced.

## Verification

- Shared package test suite passed with zero failures, skips, cancellations, or
  todos; record-store coverage passed, including symlink rejection.
- Shared typecheck passed.
- Shared build passed.
- No customer, provider, registry, database, deployment, or paid Actions state
  was changed.

## Boundary

This is local record-integrity implementation evidence supporting ACCEPT-003.
It does not create provider/hosted acceptance, independent review, customer or
recipient acceptance, or final release sign-off. ACCEPT-003 remains open and
the score remains **246 checked / 34 open / 280 total (87.9%)**, split **13
AppSec-dependent / 21 non-AppSec**. Nothing was deleted or overwritten.
