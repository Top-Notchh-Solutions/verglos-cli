# DIST-003/ACCEPT-003 scanner provenance concurrency hardening

Date: 2026-10-24

CLI PR **#385** merged normally as
`90811e92eeb9703a8eceaad109871bb08778a77b` from source commit
`6918d4c4`.

## Production implementation

Per-file provenance analysis now uses an order-preserving worker pool capped at
**4** files. The existing 300-file sampling bound remains unchanged. This
prevents a large repository from launching Git-backed signal analysis for the
entire sample at once, reducing process and file-descriptor pressure while
preserving deterministic result order and the existing provenance values.

## Verification

- Focused provenance concurrency tests: **2/2** passed.
- Full `@verglos/scanner` package test suite passed.
- Scanner typecheck passed.
- Scanner build passed.
- `git diff --check` passed.

This is production implementation evidence supporting DIST-003 and ACCEPT-003.
Those rows remain unchecked for trusted/provider publication, independent
review, authorized recipient/customer acceptance, and final release sign-off.
No publication, registry/provider action, customer data, deletion, or release
state changed. No checkbox changed; score remains **246 checked / 34 open / 280
total (87.9%)**, split **13 AppSec-dependent / 21 non-AppSec**.
