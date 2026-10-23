# QUAL-WEB-005 deletion-worker boundary — 2026-10-07

## Scope

This is a blocker and reconciliation record for `QUAL-WEB-005`, not acceptance
evidence. The inspected Web source was
`cbc0f5a89179995569308695419d4578c57ce716`.

## Current evidence

- `account_deletion_requests` is a durable, authenticated request ledger with
  pending uniqueness and bounded newest-first history.
- `decideAccountDeletionExecution` and `qualifyPrivacyDeletion` are pure,
  fail-closed gates. They require zero in-scope hosted rows after execution,
  unchanged out-of-scope counts, unchanged customer-held digests, and no active
  legal hold.
- Studio and enterprise retention modules model legal, contract, and customer-
  deletion holds as in-memory decision inputs only.
- The retention classifier explicitly says that its caller must perform the
  deletion and verify row counts.

## Blocking gap

No persisted legal-hold/customer-held authority or hosted deletion worker was
found. The generic durable queue is organization-scoped (`jobs.organization_id
NOT NULL`), while account deletion is user-scoped and spans legacy user rows,
personal organizations, and organization-owned data. The current schema also
has no authoritative inventory of offline customer-held signed `.vgl` digests.

Implementing a worker without those contracts would either delete without a
durable hold decision, silently omit owned tables, or claim that offline records
were preserved without being able to observe them. Therefore no destructive
worker, migration, cron route, production deletion, or checkbox change was
made.

## Required next design/acceptance boundary

1. Approve a versioned user/organization deletion inventory and ownership map.
2. Add a durable, auditable hold authority with explicit release semantics.
3. Define how customer-held signed-record digests are registered or proven
   without storing customer record bytes.
4. Implement a bounded worker with claim/retry/idempotency, transactional
   per-kind deletion, row-count reconciliation, terminal audit receipt, and
   restore/rollback rehearsal.
5. Run authenticated non-production end-to-end acceptance with a synthetic
   held-record fixture, then reconcile vendor/log/backup retention separately.

## State

`QUAL-WEB-005` remains unchecked. No production/database/provider write,
customer data access, browser mutation, or secret handling occurred in this
review.
