# Production migration 0021–0025 — 2026-10-06

- Target: Vercel production Neon database for `verglos-web`.
- Preflight identity: database `neondb`, role `neondb_owner`, schema `public`.
- Before state: `drizzle.__drizzle_migrations` contained 21 rows (through
  local migration `0020`); `account_deletion_requests` was absent.
- Reviewed plan: apply only additive migrations `0021_scm_check_delivery`,
  `0022_scm_delivery_leases`, `0023_scm_provider_token_envelopes`,
  `0024_account_deletion_requests`, and
  `0025_account_deletion_pending_uniqueness`. No data updates, deletes,
  backfills, or cutovers were included.
- Backup/rehearsal: local-only `pg_dump` snapshot at
  `/tmp/verglos-db-rehearsal-1791295073.dump` (116 KiB); restored into Docker
  PostgreSQL 18 and rehearsed through 26 migrations, including the deletion
  table and pending index.
- Apply: `DATABASE_URL=<production secret> pnpm db:migrate` completed
  successfully. No secret value is retained in this document.
- After state: migration count 26; new tables `scm_installations`,
  `scm_check_deliveries`, `account_deletion_requests`; lease, queue, delivery,
  and pending-request indexes present.
- Invariant counts unchanged: users 2, organizations 1, webhook events 3,
  account-deletion requests 0.
- Code qualification: account-deletion route/quality tests 23/23, typecheck,
  Drizzle check, and ordered migration check 26/26 passed.
- Boundary: this qualifies additive schema deployment only. TEAM-WEB-006 still
  lacks live GitHub/GitLab provider evidence; QUAL-WEB-005 still lacks a hosted
  deletion worker, legal/customer-held decision run, consent inventory, and
  end-to-end deletion acceptance. No deletion or customer-data mutation ran.
- Operational security note: a temporary diagnostic process listing exposed the
  production connection string as a command-line argument. The value is not
  repeated here and was not committed. Rotate the Neon/database credential and
  refresh the Vercel production secret before any further production operation.
- Deployment smoke: Vercel production deployment `dpl_Cie71NTDhWpx4tQY9NbtBqcDKCYp`
  is Ready and its output manifest contains `api/v1/account/deletion`. An
  anonymous request returns 404 because Clerk middleware intentionally hides
  protected routes; this is not evidence of an absent deployment route.
