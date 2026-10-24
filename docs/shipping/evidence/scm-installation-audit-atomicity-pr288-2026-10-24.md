# SCM installation audit atomicity hardening

Date: 2026-10-24

Web PR **#288** merged normally as
`557d508422374a5b14dfbbe3f3ddeacd2ee5dbcf` from source commit `02993fa`.

The organization SCM installation POST path now persists installation rows and
their audit records inside one tenant-scoped database transaction. Audit rows
are inserted as one batch instead of unbounded parallel writes. If audit
persistence fails, the installation insert rolls back with the request rather
than leaving provider state committed while returning an error.

Verification:

- Adjacent SCM contract suite: **18/18** passed.
- Web TypeScript check passed.
- `git diff --check` passed.

This is production provider-lifecycle hardening. It does not create a live
provider installation, customer consent, independent review, or final release
sign-off. No provider installation, customer data, database migration,
payment, deletion, or publication operation occurred. No backlog checkbox
changed; score remains **246 checked / 34 open / 280 total (87.9%)**, split
**13 AppSec-dependent / 21 non-AppSec**.
