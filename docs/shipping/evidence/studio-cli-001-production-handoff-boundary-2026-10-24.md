# STUDIO-CLI-001 Production handoff boundary smoke · 2026-10-24

## Scope

This is a read-only Production boundary check using a nonexistent UUID and a
forged token. It did not create, acknowledge, revoke, or inspect a real
handoff and did not use customer data.

## Receipt

Against `https://verglos.com`:

- `GET /handoff/00000000-0000-4000-8000-000000000000` returned **200**.
- The public page returned `Cache-Control:
  private, no-cache, no-store, max-age=0, must-revalidate`, and did not expose
  database or recipient fields for the nonexistent handoff.
- `GET /api/v1/handoffs/00000000-0000-4000-8000-000000000000/acknowledge`
  returned the expected **405** method refusal.
- A forged `POST` with `token: not-a-real-token` and
  `recipientEmail: recipient@example.invalid` returned **400** JSON:
  `{"ok":false,"reason":"handoff unavailable"}`.
- The forged POST response returned `Cache-Control: no-store`, JSON content
  type, and `X-Content-Type-Options: nosniff`.

## Boundary

This verifies deployed route behavior and fail-closed handling only. It is not
recipient consent, a customer acknowledgement, an independent review, or
final release acceptance. `STUDIO-CLI-001` remains unchecked; score remains
**246 checked / 34 open / 280 total (87.9%)**, split **13 AppSec-dependent /
21 non-AppSec**. Nothing was deleted or overwritten.
