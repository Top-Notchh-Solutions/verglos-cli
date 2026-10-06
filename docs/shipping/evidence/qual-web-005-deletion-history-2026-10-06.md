# QUAL-WEB-005 deletion request history — 2026-10-06

- Web PR #142 (`0438316`) merged as `3127199`.
- Authenticated `GET /api/v1/account/deletion` now returns no more than 50
  requests, newest-first. This makes the request ledger auditable while keeping
  the response private and bounded.
- Local route contracts, type/schema/migration checks, hosted Verify, Vercel,
  and GitGuardian all passed.

This is boundary progress only. No deletion worker, production migration,
customer data access, consent inventory, or external privacy acceptance run was
performed.
