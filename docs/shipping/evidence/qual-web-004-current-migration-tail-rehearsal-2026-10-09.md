# Current Web migration-tail restore rehearsal

Date: 2026-10-09  
Web branch: `feat/preview-test-auth`  
Web source: `da45a97b6e41c52b471b697446d6bbc26346c59a`  
Scope: disposable Docker PostgreSQL only; no Production operation

## Rehearsal result

The existing local `pg_dump` snapshot was restored into a disposable
`postgres:15-alpine` container using the current Web migration directory. The
rehearsal then completed:

- Docker boot: success
- Snapshot restore: success
- Drizzle migration: success; **38 migrations applied**
- HOSTED-013 writer pass 1: success
- HOSTED-013 writer pass 2: success
- Object reconciliation: success; `status=reconciled`
- Stopped-database failure simulation: success; the subsequent `psql` read
  failed as expected
- Measured RTO: **3,302 ms**
- Snapshot age/RPO: **441 hours**

The harness returned overall `failed` only because the snapshot age exceeds
the critical 48-hour RPO threshold. The snapshot is not current-backup
evidence and is not a Production migration authorization.

## Acceptance boundary

This strengthens the migration-tail, restore, reconciliation, and fail-closed
database-loss evidence for the current migration-bearing Web branch. It does
not close `QUAL-WEB-005`, `DIST-006`, `PLAN-WEB-011/012/014/015`, or any
Production activation gate. Current-backup evidence, authenticated hosted
deletion acceptance, Production-shaped reconciliation, deployment rollback,
and operation-specific approval remain open.

No Production deployment, database/migration write, payment/provider write,
entitlement change, account change, or customer-data mutation occurred. The
temporary container was stopped and no persistent test database was changed.

Score remains **219 checked / 61 unchecked / 280 total (78.2%)**; no checkbox
changed.
