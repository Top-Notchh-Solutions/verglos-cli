# Verglos V1 architecture decision set

Status: governing architecture baseline for `TRUTH-011`

Reviewed: 2026-09-08

Implementation baseline: `a74fb7b`

Owners: Evidence Contracts, CLI Core, Hosted Platform, Operations, Security/Signing, Release Engineering

Scope: V1 system shape, package and deployment boundaries, evidence-producer independence, language truth, hosted authority, data placement, asynchronous work, signing identities, provider selection gates, and explicit contradictions.

This document decides architecture at the level required to build safely. It deliberately does not select an unmeasured queue/object-storage vendor, promise a future plan, activate a price, or expand V1 into a CNAPP, production DAST platform, endpoint/runtime product, autonomous pentester, or proprietary vulnerability database.

## Decision summary

| ID | Decision | Status | Consequence |
|---|---|---|---|
| `ADR-001` | Apache local core plus commercial hosted operation | Accepted | Local evidence creation/reading/verification stays useful; paid value is server-authorized custody, workflow, delivery, collaboration, managed operation, and support. |
| `ADR-002` | One signed `verglos` npm front door | Accepted | Users install/run one command. Internal packages may remain modular/versioned, but their existence is not a fragmented product or client-only security boundary. |
| `ADR-003` | Versioned Verglos contracts around replaceable evidence producers | Accepted | Trivy, detect-secrets, native detectors, SARIF/SBOM/VEX/provenance importers, and future tools emit observations; no producer owns the domain model. |
| `ADR-004` | Language-neutral evidence, policy, record, and import layers; native deep SAST labeled JS/TS | Accepted | Imported/external coverage is distinct from native coverage; unsupported language cannot receive a misleading clean/PASS result. |
| `ADR-005` | Hosted modular monolith with durable worker processes | Accepted | Keep one web/application codebase and shared domain modules; split deployment processes only for bounded asynchronous/retry/isolation needs. No speculative microservices. |
| `ADR-006` | Postgres for transactional metadata; content-addressed object storage for evidence payloads | Accepted with provider deferred | Relational rows hold ownership/index/contracts; raw/bulk immutable objects live behind digests, encryption, retention, and tenant access. |
| `ADR-007` | Transactional outbox plus a durable queue abstraction | Accepted with provider deferred | Request paths record intent atomically; workers lease/ack/retry/DLQ idempotently. Current sequential cron is a compatibility source, not the target queue. |
| `ADR-008` | Server-side catalog, authorization, usage reservations, and billing authority | Accepted | The CLI consumes opaque effective capabilities; a modified client cannot grant hosted value or forge usage/tenant identity. |
| `ADR-009` | Customer, organization, and Verglos signing identities remain separate | Accepted | Basic local signing is open; guided/keyless and organization workflow can be hosted value; Verglos official keys sign only Verglos-controlled releases/trust content. |
| `ADR-010` | Explicit upload/publication and private-by-default evidence custody | Accepted | Ordinary scan/Hunt/record creation never silently uploads source/evidence. Public projection is allowlisted, separately approved, and never the canonical private record. |
| `ADR-011` | Additive, tenant-first migration before target hosted authority | Accepted | Expand/backfill/dual-write/shadow/cut over per surface; legacy scores/reports/summaries retain honest legacy types. |
| `ADR-012` | Evidence-based provider and capacity selection | Accepted | Queue, object store, managed isolation, region, and support commitments activate only after measured fit, cost, privacy, licensing, recovery, and exit gates. |

## System boundaries

### Local/open core

The local core owns deterministic contracts and customer-controlled execution:

- target/source/artifact/OCI subject inspection and digesting;
- native JS/TS detectors and adapters/importers for external evidence;
- observation normalization, correlation, lineage, coverage, and engine health;
- policy evaluation and explicit PASS/REVIEW/BLOCK/INCOMPLETE decisions;
- local viewer and portable JSON/SARIF/SBOM/VEX/provenance exports;
- canonical `.vgl` assembly, safe reading, local signing, and independent verification;
- bounded local Hunt planning/execution with explicit approval and isolation labels;
- CLI and MCP interfaces over the same authorization and evidence contracts.

Customer source, paths, findings, secrets, configurations, evidence, and signing keys remain customer assets. The local core may use network-producing adapters only under the network/consent contract; `local` is a data-placement claim, not a hidden zero-network claim.

### Hosted/commercial operation

The hosted system owns stateful multi-user and operational value:

- identity, tenants, organizations, membership, roles, and audit;
- server-side plan catalog, subscriptions, entitlements, authorization, usage, quotas, overage consent, and billing reconciliation;
- tenant applications, environments, releases, retained evidence metadata/objects, records, receipts, and history;
- policy collaboration, exceptions, approvals, client workspaces, and handoff/public projections;
- normalized inventory/advisory monitoring, durable scheduling, delivery, retry, DLQ, retention, deletion, recovery, and operational health;
- encrypted integration credentials, SCM/work-item integrations, public verification delivery, private runners/verifiers, and contracted support surfaces.

Possession or modification of Apache client code grants no hosted tenant, plan, role, allowance, signing authority, or data access. Every hosted operation resolves the authenticated principal/service, tenant, resource, action, role, capability, catalog version, and usage reservation server-side.

## Repository and package topology

### `verglos-cli`

Keep the monorepo package decomposition where it reflects real contracts:

| Package | Architectural role |
|---|---|
| `@verglos/shared` | Versioned subject/observation/policy/record/error primitives and compatibility decoders. |
| `@verglos/scanner` | Native JS/TS evidence producer and local project inspection. |
| `@verglos/reporter` | Projections/rendering over stable contracts; no independent evidence truth. |
| `@verglos/entitlement` | Opaque entitlement verification/client protocol; never final hosted authority. |
| `@verglos/mcp` | Agent transport over the same commands/contracts and approval limits. |
| `@verglos/hunt` | Bounded local verification planner/runtime/adapters; recipes are separately classified content where applicable. |
| `@verglos/attest` | Canonical record assembly, signing adapters, and independent verifier. |
| `verglos` | One user-facing npm binary that composes the packages and maintains command compatibility. |

The six currently publishable package artifacts still require license/notice/provenance gates. “One front door” does not require collapsing maintainable packages into one file; it requires one supported install/run journey, one compatibility manifest, coherent versions, and signed provenance. Internal package publication is permitted only where dependency resolution or ecosystem reuse requires it and cannot be used to hide commercial logic in removable client checks.

### `verglos-web`

Keep one deployable application repository and organize code by domain modules rather than route-owned business logic:

- identity/tenant/access;
- catalog/subscription/billing/usage;
- application/subject/release/evidence/record;
- policy/approval;
- inventory/advisory/monitoring;
- jobs/outbox/delivery/retention;
- signing/trust/public verification;
- integrations/audit/operations.

HTTP pages/routes, workers, cron/scheduler producers, and migration/admin tools call those domain services. They do not each reimplement authorization, entitlement, idempotency, redaction, or database queries. The target tenant-scoped repository layer prevents unscoped resource access by type/API.

## Evidence-producer architecture

An evidence producer is replaceable and cannot define the stable product schema. Each native engine, external executable, imported standard, or hosted source supplies:

- producer ID/name/version and installation/provenance state;
- rule/database/config digests and license/attribution references;
- exact subject binding and invocation parameters;
- start/end time, exit/error/timeout state, freshness, coverage, and limitations;
- immutable raw-artifact digest/reference when retained;
- normalized observations with source lineage and loss notes.

The pipeline is:

`target resolution → producer run/import → raw evidence digest → normalization → correlation → policy evaluation → Release Decision → Release Record → private/public projections`

Engine absence, failure, stale data, parse loss, unsupported subject/language, or missing required evidence produces incomplete coverage. It cannot be converted into no findings or PASS. Correlation preserves every producer observation and relationships; deduplication never deletes origin truth. Existing records remain independently readable/verifiable when an engine is removed or upgraded.

Native scan, Trivy, and imported SARIF are peers at the observation layer even if their collection paths differ. Trivy-specific fields cannot leak into policy, record, viewer, dashboard, or monitoring domain contracts. The engine-exit acceptance test swaps/removes a producer and exercises those downstream layers unchanged.

## Language and coverage architecture

- Subject, observation, policy, record, signature, import/export, viewer, and hosted ownership contracts are language-neutral.
- Current deep native source analysis is JavaScript/TypeScript-oriented. Coverage labels state `native`, `external`, `imported`, or `unsupported/incomplete` per language/subject/engine.
- Package, lockfile, provenance, artifact, container, secret, and configuration evidence can apply across languages only when the exact producer proves that coverage.
- A repository with insufficient supported code and no findings is not 100/100 by default. Policy requires its declared evidence set and returns INCOMPLETE when required coverage is missing.
- Adding a language means adding a producer/adapter, fixtures, rule scope, coverage semantics, and acceptance evidence—not widening marketing copy or changing the stable record model.

## Hosted process topology

V1 uses a modular monolith plus independently scalable durable workers:

| Process | Responsibility | Must not own |
|---|---|---|
| Web/API | Authenticated request validation, authorization, resource mutation/query, upload admission, quota reservation, receipts | Long unbounded scans, sequential global cron work, best-effort delivery after response |
| Scheduler producer | Find due work with fairness/backpressure and enqueue deterministic jobs | Advisory evaluation or channel delivery itself |
| Inventory/advisory worker | Normalize/cache source updates, evaluate affected released inventories, persist freshness/incomplete state | Direct unaudited user notifications |
| Outbox/delivery worker | Lease logical deliveries, dispatch bounded channel attempts, retry/DLQ, record outcome | Recomputing product evidence or suppressing intent on transient failure |
| Retention/reconciliation worker | Expire/delete relational/object/provider data, rebuild usage projections, reconcile digests/orphans/backups | Policy-free hard deletion or silently repairing evidence truth |
| Managed execution worker/runner | Only explicitly admitted bounded jobs under selected isolation, resource, network, and secret controls | Ordinary source scanning by default or arbitrary autonomous shell |

They share versioned domain contracts and one authoritative metadata model. Separate deployment/scaling does not imply separate microservice ownership or duplicative databases. A new service boundary requires a distinct scaling/security/failure need, measured operational benefit, compatibility contract, observability, on-call owner, and recovery/exit plan.

## Data placement and consistency

### Postgres

Use Postgres for transactional metadata and constraints: principals/tenants/memberships, catalog/subscriptions, applications/releases/subjects, normalized observation indexes, policy decisions, manifests/object references, jobs/outbox, usage/audit, inventory/advisory matches, encrypted credential metadata, and public projection indexes.

Tenant ID participates in ownership paths, uniqueness, and high-value indexes. Cross-resource relationships are constrained through tenant-compatible keys or verified repository methods. UUID/hash lookup alone never establishes ownership.

### Object storage

Use content-addressed object storage for bounded evidence payloads, canonical records, imports/exports, large manifests, and private/public projections when relational JSON is no longer appropriate. An object reference includes digest algorithm/value, media/schema version, logical and physical size, tenant/access class, encryption/key version, redaction class, retention/hold/delete state, creation/source provenance, and integrity status.

Objects are immutable by digest. Metadata commit and object upload use staged state plus idempotent finalize/outbox semantics; orphaned staging objects and missing/corrupt referenced objects are reconciled. Public projections are separate allowlisted objects and cannot expose private object locations. Signed URLs are short-lived and authorized before minting.

Postgres does not become an unbounded evidence blob store, and object storage does not become an authorization database.

### Consistency model

- Tenant/resource/catalog/quota admission and transactional metadata are strongly consistent within Postgres.
- External provider work is eventually consistent through an outbox and idempotent worker, with visible pending/failed/incomplete state.
- Usage commits link to durable accepted work; retries add cost attempts but not duplicate customer units.
- Evidence and signed-record facts are immutable. New evaluations/projections supersede by linkage rather than mutation.
- Cache failure cannot create authorization, signature validity, or PASS. Caches record source/version/freshness and have a safe origin/failure path.

## Queue decision and provider gate

The architecture accepts a durable queue abstraction but defers the provider to `OPS-001`. The interface requires:

- deterministic enqueue/idempotency key, schedule time, priority class, tenant/fairness key, payload schema/version, and trace link;
- atomic or transactionally relayed enqueue from the Postgres outbox;
- bounded lease/visibility timeout, heartbeat/extension, ack, retry with jitter, attempt history, cancellation, terminal DLQ, and authorized replay;
- at-least-once delivery assumed and consumers proven idempotent; no correctness claim depends on exactly-once provider marketing;
- payload/reference size limits, encryption, regional/data-residency fit, access controls, audit logs, metrics, backpressure, and outage behavior;
- local deterministic test adapter and failure injection without creating a second production architecture;
- measured throughput/latency, retention, operations burden, provider actual cost, export/exit, and recovery evidence.

Selection is blocked until representative jobs define payload size, concurrency, duration, scheduling precision, retry/DLQ volume, region, and cost needs. A Postgres-backed queue may be the smallest valid V1 choice only if lease contention, connection limits, vacuum/storage, fairness, recovery, and managed-provider constraints pass load/restore tests. A vendor queue may be chosen only if it improves those measured constraints without weakening transaction, privacy, portability, or local-test requirements.

Current hourly sequential cron is retained only as a migration source. It cannot satisfy durable retry, fairness, source freshness, per-channel delivery, DLQ, or bounded global execution at V1 scale.

## Object-storage decision and provider gate

The object-store provider remains deferred until `HOSTED-006` has contract fixtures and representative artifacts. Selection must prove:

- required regions/residency, encryption and customer/KMS key options, immutable/versioning behavior, lifecycle/deletion/hold, audit/access logs, and least-privilege credentials;
- multipart/streaming digest verification, conditional create/idempotency, object size/count limits, signed access, metadata integrity, range/download behavior, and malware/untrusted-content handling;
- backup/replication semantics, restore/object reconciliation, durability evidence, outage behavior, export tooling, vendor exit, and deletion receipt capability;
- actual storage, request, retrieval, replication, and egress costs under p50/p95/p99 representative record sizes and plan retention—not list-price guesses;
- licensing/terms/privacy/DPA/subprocessor review and a test emulator or adapter contract.

Until selected, implementations depend on a narrow object interface and an in-memory/filesystem test adapter restricted to tests/local development. Production evidence custody cannot silently fall back to local ephemeral filesystem or database JSON.

## Plan, entitlement, and usage authority

One versioned server catalog owns public plan identity/status/effective dates, currency/period prices, capabilities, seats, applications, clients, records, retention, traffic, managed work, support, and overage policy. Inactive Team/Studio hypotheses remain unavailable. Enterprise resolves contracted values; null/unset never means unlimited.

The authorization request is conceptually:

`principal/service + tenant + resource + action + role + capability + catalog/contract + allowance window`

The server validates every component and atomically reserves usage before accepting bounded hosted work. Entitlement tokens are short-lived signed projections for client UX/offline behavior, scoped to tenant/user/role/catalog/version/expiry and revocable. They do not replace server checks. Founder status is an audited internal override separate from public plan.

## Signing and trust architecture

### Customer-controlled local signing

Basic record creation, user-supplied/offline signing, reading, and independent verification remain open core. Private key material stays under the user's selected local signer and is never included in the record, telemetry, report, support bundle, or Verglos database. The record states signature scheme, public identity/material reference, issuer/subject policy, signing time, and limitations without claiming organization or Verglos authority.

### Guided/keyless signing

A supported guided flow may use Sigstore-compatible keyless identity after explicit browser/network/sign approval. The CLI constructs and verifies the exact in-toto statement/record digest locally; the external identity/CA/transparency services issue evidence under their own availability/privacy contracts. Verglos does not proxy source or hold a universal customer private key. Offline verification uses the stored verification bundle and pinned/versioned trust policy.

### Organization signing

Team/Enterprise organization records require tenant membership, signer role, approved exact release decision/subject/policy, organization issuer/identity policy, and immutable audit. Producer, reviewer/approver, signer, and uploader identities remain distinguishable. KMS/HSM/private-runner options are contracted and isolated by tenant/key policy.

### Verglos official signing

Verglos-controlled private keys may sign only Verglos-owned package releases, compatibility manifests, engine/feed indexes, maintained content/recipes, or explicitly defined service receipts. They do not sign customer evidence as if Verglos authored or approved its security facts. Official keys live in approved release/KMS infrastructure with least privilege, environment separation, public trust roots, transparency/provenance where applicable, rotation, revocation, incident response, and offline verification fixtures. Placeholder keys never become production trust.

### Record/public verification

The canonical `.vgl` record binds exact subjects, evidence digests, runs/coverage, normalized observations, policy decision, exceptions, lineage, redaction manifest, and signature envelope. Public verification renders only a separately generated allowlisted projection and honest limitations. Current random-hash attestation summaries are legacy caller assertions and remain a separate type/route during migration.

## Explicit current contradictions

| Target decision | Current contradiction | Required owner/gate |
|---|---|---|
| Useful local core with explicit network policy | Default scan can perform mandatory update, npm/OSV, and default-on account-linkable telemetry; no common offline control | `TRUTH-007`, command/network implementation, privacy gate |
| One stable command/machine contract | 19 commands have inconsistent exits and sparse process tests; target common flags are absent | `TRUTH-010`, command contract/fixtures |
| Producer-independent evidence | Current `ScanResult`/Finding are file/scanner-shaped and reporter/dashboard vendor copies can drift | Contract, adapter, normalization, engine-exit epics |
| Language-neutral decision truth | Current native scan is JS/TS and external/import layers do not exist | Target/import/policy coverage gates |
| Tenant-aware modular monolith | Current web data is user/license/fingerprint-centric with unscoped route queries and zero application tests | `TRUTH-009`, `HOSTED-001-013` |
| Durable async operation | One sequential cron calls OSV and channels inline with no durable retry/DLQ/fairness | `OPS-001-015` |
| Metadata/object separation | Reports/dependencies/channel outcomes are JSON; no object store, content-addressed custody, or encrypted channel model | `HOSTED-005/006/008/010`, provider gate |
| Server catalog/usage authority | Plan constants conflict; no tenant/catalog/usage/reservation/overage model | `TRUTH-004/008`, `PLAN-WEB` |
| Canonical signed record | CLI Attest is an exit-78 shell; hosted route stores unsigned caller summary behind random URL | Record and verification epics |
| Trust-separated signing | Placeholder/local entitlement signing pieces exist, but production roots/KMS/rotation/revocation/receipts are absent | Record, distribution, signing release gates |
| Reproducible schema migration | Partial handwritten SQL and `db:push` cannot recreate the foundational schema | `HOSTED-001`, restore/drift gates |
| Evidence-backed operations/cost | Queue/object provider, production configuration, actual cost, retention, and support baselines are unknown | `TRUTH-008`, provider selection, `OPS-013`, release gates |

Contradictions are work inputs, not permission to describe planned behavior as current.

## Architecture acceptance gates

1. Stable contracts have version/canonicalization/compatibility fixtures and pass malformed/oversized/unknown-field tests.
2. At least two producer paths (native plus imported/external/fixture) exercise normalization, policy, record, viewer, dashboard, and monitoring; removing one producer does not change domain schemas.
3. Unsupported/missing/stale/failed engine states yield INCOMPLETE where policy requires coverage and never a false PASS.
4. All tenant resources pass positive role and complete cross-tenant/non-member negative tests through the shared repository/authorization layer.
5. Schema builds cleanly, migrates production-shaped data additively, shadow-reconciles, rolls application versions back safely, and restores with object digests intact.
6. Queue jobs pass duplicate, timeout-after-commit, lease expiry, retry, DLQ/replay, fairness/backpressure, provider outage, and recovery tests.
7. Objects pass digest mismatch, traversal, duplicate member, bomb/size, partial upload, orphan/missing object, encryption/key rotation, signed URL, retention/deletion, and restore tests.
8. Usage/quota passes last-unit concurrency, replay/reconciliation, 80/100 warnings, no-surprise overage, and modified-client tests.
9. Hunt passes isolation/network/resource/process-tree/output/secret cleanup and verdict-failure classification review independently.
10. Signing passes deterministic record, tamper, subject mismatch, identity/issuer, offline bundle, key rotation/revocation, transparency outage, redaction, and trust-separation tests.
11. Privacy/licensing gates prove no forbidden fields leak and every redistributed/provider asset has approved obligations/evidence.
12. Representative load and actual provider evidence establish per-plan hosted cost and bounded managed execution before activation.

`TRUTH-011` changes no package topology, runtime, provider, deployment, database, plan, signing key, blog content, or landing-page content.
