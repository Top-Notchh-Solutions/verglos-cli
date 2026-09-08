# Verglos data and schema migration inventory

Status: governing migration baseline for `TRUTH-009`

Reviewed: 2026-09-08

Implementation baseline: `8611632`

Owners: Hosted Platform for schema/cutover; Security for tenant authorization and secrets; Data Operations for backfill/reconciliation; Product for legacy user-visible behavior

Scope: every current `verglos-web` table and its API/UI consumers, the target tenant/application/subject/evidence model, data-quality gaps, additive migration order, dual-read/write, reconciliation, rollback, and deletion holds.

This inventory does not implement or authorize a production migration. No current row is treated as a canonical Release Record, verified observation, tenant membership, or billable usage unless its existing fields prove that meaning.

## Migration safety rules

1. Production schema changes are generated, reviewed, immutable, ordered, checksum-verified, and exercised against a production-shaped snapshot before apply.
2. Expand before migrate; migrate before contract. New nullable tables/columns and indexes land first. Old readers/writers remain valid until dual-write, backfill, shadow-read, cutover, and rollback windows pass.
3. Backfills are idempotent, resumable, bounded, tenant-safe, observable, and keyed by a durable legacy-to-target mapping. They never mint missing facts.
4. Unknown, ambiguous, orphaned, malformed, or privacy-sensitive rows enter a named quarantine/review state. They are not dropped, reassigned, made public, or upgraded into stronger evidence.
5. Tenant context becomes mandatory at the data-access boundary before target reads become authoritative. Route authentication alone is insufficient.
6. Old and new counts, identities, digests, and user-visible projections reconcile at a recorded watermark. A mismatch pauses cutover.
7. Rollback means switching reads/writes through tested feature controls or applying a forward fix. Destructive down migrations are not the recovery plan once new data exists.
8. Backup/restore evidence precedes any irreversible contract step. Retention/deletion work is separate and cannot be smuggled into a schema migration.
9. Legacy alpha summaries remain labeled legacy. Migration cannot turn a caller assertion into a signed record or a score row into a release decision.
10. Blog and landing-page data are outside this migration and remain untouched.

## Current migration-tooling truth

`verglos-web` defines 12 Drizzle tables in `src/lib/db/schema.ts` and uses Neon HTTP/Postgres through `src/lib/db/index.ts`. `drizzle.config.ts` points to that schema and the `drizzle` output directory. The only package database command is `db:push` (`drizzle-kit push`).

Five handwritten SQL files exist:

- `0000_rename_sentinel_to_pro.sql` changes the license default and rewrites the legacy plan string;
- `0001_scan_events.sql` creates scan telemetry;
- `0002_cli_auth_codes.sql` creates device-auth codes;
- `0003_pro_backing_tables.sql` creates monitoring, dispatch, and score-history tables;
- `0004_attestations.sql` creates public summary and verification-view tables.

There is no checked-in Drizzle migration journal/snapshot directory and no migration creating the foundational `users`, `licenses`, `activations`, `reports`, or `heartbeats` tables. The SQL files use `IF NOT EXISTS` in places but there is no application-owned migration-history table, checksum verification, apply/status command, drift check, or database test. Repository state therefore cannot reproduce or prove a clean production schema today. `HOSTED-001` must establish that foundation before target schema work.

## Target logical model

The later schema tasks choose physical names, indexes, and partitioning. This migration freezes the logical separation that backfills must preserve.

| Target entity family | Minimum identity/ownership | Meaning |
|---|---|---|
| Principal/profile | External auth subject plus internal immutable ID | A human/service identity; email is mutable profile data, not tenant authority. |
| Tenant/organization/membership | Tenant ID plus principal ID, role, lifecycle, invited/accepted/removed timestamps | Ownership and authorization boundary. Founder/super-admin is a separately audited override, never a public plan. |
| Catalog/subscription/entitlement/billing | Tenant, catalog version, effective interval, billing-customer/order/payment IDs, status | Commercial authority separated from raw access credentials and user profile. |
| Credential/device/auth challenge | Scoped hashed credential/token ID, tenant/principal/device binding, expiry/revocation | CLI authentication and installation state; secrets are not stored or returned in plaintext when avoidable. |
| Application/project/environment/repository reference | Tenant plus stable application ID and immutable external reference | A product/application independent of a changing clone path, branch, activation fingerprint, or monitor registration. |
| Subject/release | Application plus exact source/artifact/OCI identity and digest | The immutable thing evaluated and the release grouping around it. |
| Tool run/observation | Subject/release, producer/version/config/rule, run health, normalized observation ID | Queryable evidence metadata with producer lineage; vendor structs are not the domain model. |
| Evidence object/manifest/link | Content digest, media type, size, encryption/redaction/access/retention class | Raw or normalized evidence stored content-addressably and linked without embedding source in relational rows. |
| Policy/evaluation/exception/approval | Tenant/application/release, immutable policy version/digest, actor, interval, reason | Accountable decision history separate from a scanner score. |
| Release Record/projection/receipt | Record digest/version, subject and decision links, signer state, private/public projection and upload receipt | Canonical portable record and explicit hosted custody/publication; legacy attest summaries are a different type. |
| Component inventory/advisory/match | Released subject, normalized PURL/ecosystem/version/digest, advisory source/version/freshness | Monitoring truth with reverse indexes and incomplete-source state. |
| Monitor schedule/channel credential | Tenant/application, cadence/state, encrypted destination reference | Monitoring intent and secret delivery configuration separated from inventory content. |
| Job/outbox/delivery attempt | Tenant/resource, idempotency, lease/retry/DLQ state, logical notification and per-channel attempt | Durable operations; retries do not rewrite or suppress delivery truth. |
| Usage/audit/cost | Tenant/catalog/dimension/window and immutable event IDs | Allowance/cost/accountability records defined by `VERGLOS_HOSTED_COST_AND_USAGE_LEDGER.md`. |
| Product analytics | Consent/purpose/version and coarse non-content event | Separate from tenant product data and paid synchronization; governed by the privacy inventory. |

## Current table-to-target map

| Current table | Current meaning and consumers | Target mapping | Backfill rule and unresolved data |
|---|---|---|---|
| `users` | One Clerk subject/email. Read or created by account loaders, activation, CLI-auth confirmation, report view, payment webhook, and license helpers. | Principal/profile; creator of one provisional personal tenant; owner membership. | Create one deterministic provisional personal tenant and owner membership per user after duplicate/orphan checks. Preserve Clerk ID as external identity. Email remains profile/contact data. Do not infer an organization from an email domain. |
| `licenses` | One row per user due a unique `user_id`; raw key, free-text plan, Razorpay IDs, expiry/active. Drives almost every paid route and dashboard. | Tenant subscription/entitlement, hashed/scoped credential, billing customer/order/payment records, optional internal override. | Map owner user's provisional tenant. Normalize `sentinel→pro`, `compliance→enterprise` read aliases and move `founder` to audited override; reject unknown future writes. Preserve raw key only in legacy vault until token migration. Split payment identifiers without fabricating subscription state. |
| `activations` | License/fingerprint with optional machine/project name and timestamps. Written by unlock and paid telemetry; read by status/account/history naming. No unique `(license,fingerprint)` constraint. | Provisional application/repository alias plus installation/device last-seen and audit event. | Group only within the same legacy license and exact fingerprint. Create a provisional application marked `inferred`; prefer monitor label over activation name only as display metadata. Duplicate rows reconcile by earliest creation/latest seen; conflicting machine/name values remain aliases/events. Never merge across tenants by fingerprint. |
| `reports` | Nullable user/license, score, untyped findings JSON, optional name. No ingestion route found; report page reconstructs an incomplete `ScanResult` and has an ownership gap. | Quarantined legacy report/evidence candidate; later subject/run/observation/evidence object only after schema validation and ownership proof. | Preserve byte-for-byte and compute a migration digest. Resolve tenant only when an unambiguous user/license owner agrees; disagreement or both-null is quarantine. Do not create a subject, release, decision, or canonical record from score/name alone. Keep target reader disabled until authorization and redaction tests pass. |
| `heartbeats` | Append-only license/machine/fingerprint events from heartbeat and unlock; used for a five-unique-machine/day abuse check. | Installation/device activity event and last-seen projection; possible security signal, not a seat. | Map through license tenant; aggregate exact device digest/fingerprint timestamps without calling them people or applications. Preserve a bounded legacy audit set until retention is approved; no seat usage backfill. |
| `cli_auth_codes` | Short user code and device code, optional Clerk/license binding, expiry/consumption. Used by start/authorize/status and browser confirmation. | Scoped CLI auth challenge linked to principal/tenant and credential issuance. | Do not backfill expired/consumed codes into the new live table. During dual-read, new challenges write both only if secrets stay consistent; after expiry grace, verify zero live old challenges, then retention worker deletes under policy. Never log/map raw codes as general IDs. |
| `monitor_registrations` | One license/fingerprint registration containing project label, full dependency JSON, channel JSON, cadence timestamps/state. Used by register/list/delete/test, cron, and account pages. | Application monitoring schedule; released component inventory snapshot; encrypted channel credentials; operational job state. | Map license/fingerprint to its provisional application. Preserve the original JSON digest/object. Validate and normalize each component without inventing versions/ecosystems. Split channels into encrypted records; malformed/private-sensitive values quarantine. `snapshot_at` is inventory observation time, not release time. |
| `alert_dispatches` | One registration/CVE/package row with JSON channel outcomes; acts as dedup and account history. Cron/test write it. | Advisory reference/match candidate, logical alert event, outbox intent, per-channel delivery attempts. | Preserve legacy row/digest. Create an imported advisory reference only with source ID; mark source snapshot/freshness unknown. Expand each known channel outcome to an imported attempt but do not infer provider acceptance from ambiguous JSON. Canary rows remain test activity. Maintain legacy dedup until new idempotency keys prove parity. |
| `score_history` | Nullable license plus fingerprint, score, critical/high counts, CLI version/time. Paid telemetry writes; API/account history reads. | Legacy score projection linked to a provisional application; optionally a coarse tool-run summary with incomplete lineage. | Tenant-map only non-null valid licenses. A fingerprint/score is not an exact subject, run, observation set, policy, or decision, so none are created. Preserve display history through a compatibility projection and apply current 30-day public truth until migration gates pass. Null-license rows remain privacy-governed analytics, not tenant evidence. |
| `scan_events` | Public telemetry event with fingerprint, environment/tool data, score/counts/provenance flags/duration/detectors. Only telemetry route writes it. | Purpose-separated consented analytics aggregate; authenticated product sync moves elsewhere. | Do not infer tenant or application from fingerprint or later join it to customer data. Freeze/expire raw rows under the privacy contract, aggregate only allowed fields, and require versioned consent for new events. Paid score synchronization dual-writes through an authenticated tenant endpoint instead. |
| `attestations` | License-owned random-hash public score summary with fingerprint/name/counts/version. Attest API writes; public list/detail read it. | `legacy_public_summary` plus optional owner receipt/revocation state; not Release Record/projection/signature. | Map license to tenant, preserve URL/hash and public behavior during compatibility, label legacy, and never synthesize record digest, subject, signer, policy, or verification. A future explicit migration can create a redacted projection only from a newly uploaded valid record. |
| `attestation_verifications` | One attestation hash plus daily IP-derived digest and timestamp; public verify pages write/read aggregate counts. | Legacy view event/aggregate governed by short retention; new public request/cost meter is separate from cryptographic verification results. | Do not map a view to signature verification or billable traffic. Aggregate permitted counts at a watermark, retain linkage needed for legacy stats only through approved policy, and remove hard-coded salt before target collection. |

All target rows receive `migration_source`, legacy table/ID, source digest, migration version, migrated timestamp, and status (`mapped`, `partial`, `quarantined`, `superseded`). A unique legacy mapping prevents duplicate backfill and enables reconciliation without putting old IDs into public APIs.

## Current consumer cutover map

| Consumer group | Current tables | Target read/write path | Cutover requirement |
|---|---|---|---|
| Clerk/account context and activation UI | users, licenses, activations | Principal → membership → tenant → subscription; tenant-scoped application/installation projections | Existing paid user reaches the same account and sees all legacy activations before role-aware navigation activates. Founder override remains separate/audited. |
| Razorpay create/status/webhook and license issue | users, licenses | Tenant billing customer/order/payment event → subscription/catalog entitlement → scoped credential issuance | Gateway identifiers and amounts reconcile; webhook replay/out-of-order tests; old license remains usable through rollback window. |
| License validate/status/unlock/heartbeat | licenses, activations, heartbeats | Scoped credential/token → tenant/subscription/capability; application/install activity service | Old CLI response/exit compatibility; raw-key transition; atomic application allowance; no duplicated activation/heartbeat under retry. |
| CLI device auth | cli_auth_codes, users, licenses | Auth challenge → principal membership/tenant selection → scoped credential | Polling old CLIs continue; code TTL and one-time consumption hold across dual write; no cross-tenant issuance. |
| Scan telemetry and score history | scan_events, score_history, activations | Consented coarse analytics endpoint separate from authenticated product-sync/run-summary endpoint | Default/privacy contract, tenant authorization, idempotency, and history projection parity before old conflated write stops. |
| Monitor register/list/delete/test and cron | monitor_registrations, alert_dispatches | Tenant application/inventory/schedule/channel APIs plus queue/advisory/outbox/delivery services | Registration/list parity, normalized inventory reconciliation, encrypted destinations, durable retry/dedup, usage accounting, and reversible scheduler cutover. |
| Report view | reports, users | Tenant-authorized legacy report quarantine reader; later canonical subject/run/observation/evidence reader | Fix current ownership gap first. No target report read without explicit tenant/resource authorization and redaction/schema validation. |
| Attest API and public verify pages | attestations, attestation_verifications | Legacy-summary compatibility route alongside canonical record receipt/redacted projection/verification | URLs remain resolvable and honestly labeled; new records never fall back to legacy random-hash semantics; public index visibility is explicit. |
| Account dashboards/history/alerts/monitoring | licenses, activations, monitor registrations, alert dispatches, score history | Tenant-scoped query layer over applications, releases/legacy projections, inventory, deliveries, usage, and billing | Shadow queries reconcile row counts/order/names/window boundaries; pagination and authorization tests precede each page flag. |

No target route may query by a resource UUID/hash/fingerprint alone. The repository/data-access layer receives tenant and principal/role context, applies both in every lookup/mutation, and returns a non-enumerating denial.

## Pre-backfill data audit

Before writing target rows, capture a read-only signed manifest containing schema/migration checksums, database snapshot/watermark, table row counts, primary-key ranges, null/orphan counts, duplicate logical keys, enum/value histograms, timestamp ranges, and stable per-table digests where feasible. At minimum audit:

- users without licenses, licenses without users, and the one-license-per-user assumption;
- raw plan values, active/expiry contradictions, duplicate/null payment identifiers, and legacy founder rows;
- duplicate `(license_id,fingerprint)` activations, conflicting project names/machines, and activations with no monitoring/history;
- reports with null/both/mismatched owner references, invalid findings shape, oversized JSON, source/path/secret content, and IDs reachable through the reader gap;
- expired/consumed/live CLI auth codes and codes attached to inactive licenses;
- monitor dependency/channel JSON shape, invalid versions/URLs, duplicate/private package names, inactive rows, and last-check freshness;
- dispatch dedup collisions, canary classification, channel result shapes, and deliveries without registrations;
- nullable/orphan score-history licenses, duplicate timestamps/events, impossible scores/counts, and history outside current retention truth;
- telemetry malformed/outlier fields, repeated event IDs, fingerprint cardinality, and rows that must not be tenant-linked;
- attestation public-name exposure, missing owners, invalid counts, hash collisions, and verification rows without summaries.

Foreign keys and current TypeScript types do not replace this audit. Concurrency paths already use lookup-then-insert for some logical uniques, so database contents must be treated as potentially divergent until measured.

## Additive migration and cutover sequence

### M0 — establish migration control

- Create a complete schema baseline, immutable migration journal/checksums, status/generate/apply/verify commands, advisory lock, production-role separation, backup/restore procedure, and CI clean-database/drift tests.
- Record current production migration history explicitly; never pretend the five SQL files created tables they do not contain.

### M1 — add identity and tenant roots

- Add principals/profiles, tenants, memberships, catalog/subscription, credential references, audit events, and legacy mapping/quarantine tables without changing current routes.
- Backfill deterministic personal tenants and owner memberships from valid users/licenses; reconcile 1:1 current account behavior.

### M2 — add applications and operational splits

- Add application/repository/environment/installation, normalized inventories/components, monitoring schedules, encrypted channels, jobs/outbox/delivery attempts, usage, and audit structures.
- Backfill provisional applications from license/fingerprint groups, then monitoring inventories/channels and legacy alert projections. Keep old monitor tables authoritative.

### M3 — add evidence domain

- Add exact subjects/releases, tool runs, normalized observations, evidence objects/manifests, policies/evaluations/exceptions/approvals, canonical records, upload receipts, and redacted public projections.
- Quarantine legacy reports; import only rows that pass ownership, schema, privacy, and digest checks. Preserve legacy attest summaries as their own type. Do not backfill missing subject/signature facts.

### M4 — dual write and shadow read

- Update one bounded write path at a time. A request uses one idempotency key and transaction/outbox boundary; old success with new failure is observable/replayable, never silently ignored.
- Continue old authoritative reads while target shadow queries compare identity, count, order, totals, names, and timestamps. Store comparison summaries without sensitive payloads.
- New-only capabilities remain disabled during rollback compatibility; do not force them into lossy old tables.

### M5 — per-resource read cutover

- Enable target reads behind independently reversible controls for account identity, licensing, activation/history, monitoring, alerts, reports, and public verification.
- Start with internal/founder fixtures, then explicitly selected accounts, then bounded percentages. A mismatch, authorization anomaly, elevated error/latency, or reconciliation lag automatically pauses/rolls back that surface.

### M6 — stop legacy writes and contract later

- After the published compatibility window and zero unresolved divergence, make target writes authoritative while maintaining a bounded legacy projection for supported old CLIs.
- Archive old tables read-only. Drop columns/tables only in a separately approved retention/deletion migration after backups expire, rollback is no longer required, legal/privacy holds are resolved, and row-level deletion receipts exist.

## Dual-write and failure semantics

1. Prefer one Postgres transaction when both representations live in the same database. Where object storage/provider work is involved, commit an outbox intent in the database and execute idempotently after commit.
2. Every legacy create/update/delete receives a stable operation ID. Backfill and live dual-write share the legacy mapping uniqueness constraint.
3. During old-authoritative mode, a failed target write records a repair item and keeps the legacy response only for explicitly approved compatibility paths; repair lag has an alert/SLO and blocks cutover.
4. During target-authoritative mode, a failed legacy projection cannot roll back canonical state. It records an error and may block responses only where an old supported CLI would otherwise receive false success.
5. Deletes are lifecycle events (`disabled`, `archived`, `revoked`, `pending_deletion`) until the owning retention worker removes relational/object/provider copies and records a receipt. Dual-write delete never hard-deletes the only rollback copy.
6. Backfill workers use keyset pagination, bounded batches, transaction timeouts, retry checkpoints, and explicit rate limits. Row locks/compare-and-set prevent racing live updates; `updated_at` or an equivalent version must be added where absent.

## Reconciliation and rollback gates

| Gate | Required evidence | Failure action |
|---|---|---|
| Schema reproducibility | Empty database reaches exact expected schema from journal; existing snapshot upgrades; drift is zero | Stop apply/cutover; restore test DB or forward-fix migration. |
| Mapping completeness | Every eligible legacy ID is mapped once; every skipped row has a reason/quarantine owner | Pause backfill; no inferred reassignment. |
| Tenant integrity | Every target resource resolves through one tenant and valid ownership path; cross-tenant negative matrix passes | Disable target surface immediately; investigate as security incident. |
| Evidence honesty | Legacy scores/reports/summaries remain legacy/partial and no invented subject, decision, signer, or verification appears | Roll back target reads and quarantine affected mappings. |
| Count/digest parity | Per-table/source and per-tenant counts, sums, timestamp bounds, JSON/object digests, and sampled UI projections match at watermark | Keep old reads; replay/repair discrepancies. |
| Live-write parity | Duplicate/retry/concurrency/failure tests and production shadow metrics show bounded zero unexplained divergence | Pause rollout; replay idempotently or switch writer flag back. |
| Performance | Query plans/indexes, p95/p99 latency, connection use, lock time, job lag, and cost stay within owned measured thresholds | Roll back surface flag; tune additively, never drop old index under pressure. |
| Restore | Pre-migration backup restores and target object/digest reconciliation passes in an isolated environment | No production contract step. |
| Old-client compatibility | Supported CLI matrix validates auth, capabilities, monitoring, history, errors, and revocation against dual-read service | Maintain compatibility adapter or postpone cutover. |
| Contract/drop | Retention/legal/privacy approval, rollback window closure, zero legacy reads/writes, backup expiry, and deletion receipt tests | Keep legacy tables read-only; no destructive migration. |

Rollback controls and the last known-good schema/application versions are recorded per surface, not as one global switch. A database migration that cannot be rolled back structurally must remain backward-compatible long enough to deploy the previous application version safely; otherwise it is not approved.

## Follow-on ownership

- `HOSTED-001` implements migration tooling and policy.
- `HOSTED-002` through `HOSTED-010` add the target entity families without destructive backfill.
- `HOSTED-011/012` enforce tenant-scoped access and its negative suite before target reads.
- `HOSTED-013` implements this dual-write/backfill/cutover plan with production counts and digests.
- `PLAN-WEB`, `OPS`, `PRO`, `TEAM`, `STUDIO`, and `VERIFY-WEB` own their resource-specific projections and compatibility tests.
- `TRUTH-012` records the tenant, migration, privacy, credential, SSRF, cost, and evidence-honesty risks surfaced here.

`TRUTH-009` changes no database, runtime route, user data, plan, blog content, or landing-page content.
