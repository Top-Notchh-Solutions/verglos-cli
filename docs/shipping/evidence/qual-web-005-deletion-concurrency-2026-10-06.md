# QUAL-WEB-005 deletion concurrency — 2026-10-06

- Web PR #141 (`72b651c`) merged as `710a79f`.
- The new partial unique index permits one `pending` request per user. The
  route's preflight query remains an optimization; the database invariant is
  authoritative under concurrent requests. Only PostgreSQL uniqueness race
  `23505` is converted into an idempotent 202 response.
- Focused route contracts pass 3/3; hosted Verify, Vercel, and GitGuardian pass.

This is a persistence-safety improvement, not full deletion qualification. No
production migration or database write was executed.
