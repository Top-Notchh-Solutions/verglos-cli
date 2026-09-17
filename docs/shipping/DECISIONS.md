# Verglos shipping decisions

This file is newly created because no tracked `DECISIONS.md` existed in the private shipping worktree when checked on 2026-09-14. It is local-only and must not be pushed to the public CLI or Web repositories.

## OPS-001 · Queue/provider decision — Neon PostgreSQL (founder-authorized 2026-09-16)

- **Status:** Selected. Founder authorized bucket B resolution 2026-09-16 with the explicit reasoning that pre-launch (zero paying users) the architecture-decision-set gates for representative workload / measured throughput / recovery drill / actual-cost comparison do not apply. Post-launch, if measured evidence shows Neon/PostgreSQL is inadequate, the interface remains provider-neutral and a replacement can be swapped in behind the `DurableQueueProvider` contract without touching call sites.
- **Selected provider:** Neon PostgreSQL, using the existing `jobs` and `outbox_events` tables on the same database as the tenant model. Implementation lives at `verglos-web/src/lib/queue/postgres-provider.ts`.
- **Contract satisfied:**
  - Idempotent enqueue via the `jobs_org_kind_idempotency_idx` unique index; duplicate enqueue returns the original row and does not mutate lease state.
  - Atomic claim with `SELECT ... FOR UPDATE SKIP LOCKED`; a second concurrent lease sees zero due rows.
  - Lease fencing via `lease_owner` + `lease_expires_at` + `attempts` as monotonic generation; a stale fence rejects acknowledge, fail, and any state mutation.
  - Retry with configurable `retryAt` (default 60 s) until `attempts >= maxAttempts`, then automatic dead-letter (`status = 'dead-letter'`).
  - Opaque fairness cursor (base64url tenant id) so no single tenant can starve another across sweeps.
- **Evidence:** five DB-integration tests in `postgres-provider.integration.test.ts` (skipped without `TEST_DATABASE_URL`) prove enqueue idempotency, atomic claim / no double-lease, stale-fence rejection, retry-to-dead-letter transition, and fairness cursor advance. Nine input-validation unit tests always run.
- **Non-goals for V1:** no separate queue service, no external message broker, no cross-region replication. The unified DB avoids operational complexity while paying users are zero. Provider swap remains cheap because the interface is stable.
- **Post-launch action:** collect real measurements once users exist; if throughput or contention exceeds Neon's practical limit, evaluate an external queue against the same interface and swap without call-site changes.

## OPS-002 · Scheduler / due-job producer (accepted 2026-09-16)

- **Status:** Accepted with OPS-001. Implementation at `verglos-web/src/lib/queue/monitor-producer.ts`.
- **Contract:** deterministic idempotency key `monitor-check:<registration_id>:<YYYY-MM-DD>` — a second producer run in the same UTC day is a no-op on the unique index. Bounded sweep (default 500 registrations per run) enforces backpressure at the schedule layer; per-tenant static ceiling (default 50 outstanding jobs) prevents a single tenant from filling the queue. Ownership resolves through the personal organization `external_id = 'personal-user:<user_id>'` (HOSTED-013 target); registrations whose license user has no personal org are counted as `ownerUnresolvable` and never enqueued against the wrong tenant.
- **Observable lag:** producer manifest reports `observableLagSeconds` (max age of oldest due registration inside the sweep window) and `nextDueAfter` (earliest recently-checked registration outside the window). Owner of OPS-013 metrics wires these to alerting.

## Blanket authorization scope (2026-09-16)

Founder authorized: agent-selected durable queue provider (bucket B), agent-selected object-storage strategy (deferred to Studio implementation window; V1 uses Neon jsonb columns), agent-drafted contributor DCO policy (bucket D, subject to legal review), and agent-run production DB operations (bucket A, subject to Claude Code platform's own credential-read safety guardrail which is a HARD BLOCK that memory rules cannot clear).
