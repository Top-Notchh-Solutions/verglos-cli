# Read-only legacy-data audit — 2026-10-08

## Scope

The Web `db:legacy-audit` script was run against the database selected by the
local test environment. It used a repeatable-read, read-only transaction with
bounded statement and lock timeouts. The connection value, snapshot token,
row values, identifiers, emails, provider IDs, and per-row digests were not
retained. No migration, backfill, reconciliation write, or cutover occurred.

## Inventory

- Legacy source tables present: **12/12**
- Target tables present: **6/6**
- Migration records: **26** against the current **37**-migration journal
- Source-row digest computation: completed in memory only
- PostgreSQL server major: **18**

## Aggregate findings

Healthy invariants in this selected database:

- 2 users; no missing Clerk IDs, missing emails, or duplicate Clerk-ID groups
- 1 license; no orphan user, duplicate user, unknown-plan, expired-active, or
  duplicate-payment groups
- 6 activations; no orphan licenses, duplicate fingerprint groups, or
  conflicting activation groups
- 0 reports; no ownership, shape, or size violations
- 0 orphan CLI-auth license rows
- 0 orphan score-history license rows
- 0 orphan attestation-verification rows

Cutover-relevant legacy state requiring explicit mapping/retention treatment:

- **1** legacy plan-alias license row (`sentinel`/`compliance`/`founder` class)
- **1** monitor registration with legacy channel payloads
- **1,350** dependency entries in the monitor inventory
- **2** expired and unconsumed CLI auth-code rows; 0 live unconsumed rows
- **1** canary alert-dispatch row

## Disposition

This is aggregate preflight evidence, not migration readiness or authorization
to write. The legacy alias and channel payload require an approved mapping or
retention decision before production cutover; expired auth-code handling also
requires an explicit operational decision. R-041, migration-history drift,
backup/restore, row reconciliation, and production cutover remain open. No
checkbox changed.
