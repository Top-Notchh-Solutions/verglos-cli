# Verglos shipping decisions

This file is newly created because no tracked `DECISIONS.md` existed in the private shipping worktree when checked on 2026-09-14. It is local-only and must not be pushed to the public CLI or Web repositories.

## OPS-001 · Queue/provider decision remains deferred

- **Status:** No provider decision accepted. Corrected on 2026-09-14 to align this private tracker with the canonical V1 architecture decision set in `verglos-cli/docs/shipping/DECISIONS.md` and `VERGLOS_ARCHITECTURE_DECISION_SET.md`.
- **Governing decision:** The product accepts a durable queue abstraction but defers provider selection until representative workload, contract, security, privacy, recovery, exit, and actual-cost gates pass. A Postgres-backed queue is only a candidate; existing `jobs`/`outbox_events` tables are not evidence that atomic claiming, contention, fairness, or recovery meet requirements. An existing external scheduler reference does not establish deployed trigger ownership or cadence.
- **Progress:** Web commit `3377a26` adds a provider-neutral interface and focused contract tests. This does not select a provider and does not complete OPS-001. No provider-specific claim SQL, persistent fairness schema, worker, or production qualification was established by that interface.
- **Acceptance evidence still required:** Representative job payload sizes/concurrency/durations/scheduling precision/retry-DLQ volume/region; measured candidate throughput, latency, lease contention, connection/storage/vacuum impact and actual cost; security/privacy/data-residency review; restore/recovery, export/exit and replay evidence; confirmed deployment/runtime/scheduler constraints; and a tested interface covering the full queue contract in the selected implementation.
- **Next:** Collect these facts, compare the smallest viable candidates, then revise this record with the measured choice and rollback/exit plan. Keep producers inactive until a selected implementation passes its acceptance tests.
