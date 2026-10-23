# Production source-data audit — 2026-09-12

This is an unsigned, aggregate-only read-only audit. It is not a backup, snapshot, approval, dry-run of target writes, or authorization to mutate production. No row values or identifiers were selected or emitted.

- Completed: `2026-09-12T17:48:12.842Z` UTC.
- Connection: local `neon-string` credential; secret value not logged.
- Transaction: PostgreSQL `REPEATABLE READ READ ONLY`, bounded 15-second statement and 2-second lock timeouts.
- Server: PostgreSQL `180006`; transaction snapshot marker `500737:500737:` (not a recovery snapshot).
- Migration state: `drizzle.__drizzle_migrations` exists with 15 rows, corresponding to the already-applied base migration set `0000`–`0014` as recorded by the prior approved postflight. `legacy_migration_mappings` is absent. A local, uncommitted migration `0015` was included in the audit tool's current-checkout fingerprint and is not evidence that `0015` is applied.
- Inventory: all 12 audited legacy source tables present; 5 of the auditor's 6 named target tables present (the absent table is `legacy_migration_mappings`). The prior approved postflight independently established 33/33 declared application tables after `0000`–`0014`.
- Source counts: users 1; licenses 1; activations 6; reports 0; heartbeats 0; CLI auth codes 4; monitor registrations 1; alert dispatches 1; score history 10; scan events 50; attestations 0; attestation verifications 0. Total: 74.
- Data-quality aggregates: no missing Clerk IDs/emails, duplicate Clerk IDs, orphan licenses/activations/monitor registrations/alert dispatches/scores, duplicate license-fingerprint activations, activation conflicts, malformed report/monitor/alert JSON, oversized findings, or duplicate payment IDs. License grouping returned one `founder-override` row, zero `sentinel`/`compliance` aliases, zero unknown plans, and zero active-but-expired rows. CLI auth codes: 2 consumed, 2 expired-unconsumed, 0 live-unconsumed. Monitor registration: 1, with 1,350 dependency entries and 1 non-empty legacy channel object. Alert dispatches: 1, a canary row. These aggregates do not authorize reinterpretation or deletion.
- Digest capability: PostgreSQL built-in SHA-256 available; `pgcrypto.digest` unavailable. Complete per-source SHA-256 digests follow.

| Source table | Rows | Digest |
|---|---:|---|
| users | 1 | `sha256:83751fb9bbf1a29bf47b641281b62371b8e48b0cc34dab44bc0e8f7732fe0312` |
| licenses | 1 | `sha256:4cb4ad08d830599bb07ee09b74900f78ebba81ad98ec3f8d6410ee82d3963640` |
| activations | 6 | `sha256:645a7009758878d058535c83fb22a30743fdfcdea6d9d0d48b75c7390b4e6a11` |
| reports | 0 | `sha256:4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945` |
| heartbeats | 0 | `sha256:4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945` |
| cli_auth_codes | 4 | `sha256:3f91d184dadd7092d257dc94889a192bb2f3a8ccbf7a9b1ebbdaf6e204329861` |
| monitor_registrations | 1 | `sha256:d750665f62e38fd5e986a445898b1e4d494bcd2cf5b604a22a7f3ed23d56d415` |
| alert_dispatches | 1 | `sha256:eeee99ac7619bf9250f98213b456cca840e2af5c3896ee3ef746e0c6df6fddfe` |
| score_history | 10 | `sha256:7921ed3970469d3093e907e0446fe5c7ca5072b60ac09c5ec8620ac01f0aa63d` |
| scan_events | 50 | `sha256:d02c9ea9a745a1d1593aea37df9d546786a3eb3d75964bc864b8a45a98e1f549` |
| attestations | 0 | `sha256:4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945` |
| attestation_verifications | 0 | `sha256:4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945` |

HOSTED-013 remains open. No source-to-target mapping/backfill, dual-write, cutover, or production write occurred. The audit role is write-capable outside the explicit read-only transaction. Backup/restore, reconciliation, application rollback, and independent review remain separate gates.
