# ACCEPT-003 streamed record-source hardening — 2026-10-24

## Scope

The file-backed record ingestion path now streams from the exact source file
handle it validated, instead of reopening the source pathname after the
initial check. It verifies the source identity and size after streaming before
publishing the content-addressed member.

## Implementation

- PR #375 merged normally as `28d331faeef1f7cd10a41633a2434045e1cbe9e2`.
- Source ingestion uses `O_NOFOLLOW` where the platform exposes it.
- Streaming reads use the opened `FileHandle` and a bounded 64 KiB buffer.
- The existing 50 MB cap, SHA-256 digest, temporary-file cleanup, and atomic
  publication behavior remain enforced.

## Verification

- Shared package suite passed with zero failures, skips, cancellations, or
  todos; record-store streaming and symlink coverage passed.
- Shared typecheck and build passed.
- CLI build passed.
- No customer, provider, registry, database, deployment, or paid Actions state
  was changed.

## Boundary

This is local record-ingestion implementation evidence supporting ACCEPT-003.
It does not create provider/hosted acceptance, independent review, customer or
recipient acceptance, or final release sign-off. ACCEPT-003 remains open and
the score remains **246 checked / 34 open / 280 total (87.9%)**, split **13
AppSec-dependent / 21 non-AppSec**. Nothing was deleted or overwritten.
