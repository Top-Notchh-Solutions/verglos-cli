# Verglos hosted cost and usage ledger

Status: governing design for `TRUTH-008`

Reviewed: 2026-09-08

Implementation baseline: `b226e7e`

Owners: Hosted Platform for metering/reconciliation; Product/Founder for active allowances and overages; Finance/Operations for provider costs; Support for human-service attribution

Scope: measurable units, allowance semantics, reservations, immutable usage, provider-cost evidence, plan mapping, reconciliation, privacy, and release gates for hosted Verglos services.

This document defines what can be measured. It does not invent a vendor rate, plan allowance, overage price, margin, or billable feature. Current prices and target launch defaults remain governed by `VERGLOS_PLAN_AND_CAPABILITY_RECONCILIATION.md` and are inactive wherever that document says they are hypotheses.

## Governing rules

1. Local scanning, local Hunt, local record creation, local verification, and customer-controlled compute are not metered by Verglos. Free local value does not require a hosted usage event.
2. Every hosted allowance has one stable dimension ID, unit, lifecycle, aggregation method, billing window, and enforcement point. Display labels never define quota behavior.
3. `unset` means no approved allowance exists. It never means unlimited. `contracted` means an immutable contract/catalog value must resolve before access is granted.
4. Entitlement and usage are server-side. An open or modified CLI can request work but cannot grant a hosted capability, change a window, forge a tenant/resource, or bypass a reservation.
5. Customer quota and internal cost are separate ledgers. Retries or provider calls can increase cost without consuming another customer allowance; one customer action can consume a quota unit while producing several cost units.
6. Usage writes are append-only and idempotent. Corrections are compensating events linked to the original; no counted event is edited or silently deleted.
7. At 80% of an enforced allowance, warn once per dimension/window. The included amount is usable through 100%; the next increment is rejected or requires an explicit pre-authorized overage. Existing records, downloads, verification, account access, and local work remain available.
8. No surprise charges. An overage has a catalog/contract price, explicit opt-in, limit, effective interval, receipt, and revocation path before it can commit paid usage.
9. Cost claims use actual invoices/provider exports or labeled measured estimates with source, period, currency, allocation rule, and confidence. Missing evidence remains unknown.
10. Usage metadata follows the privacy inventory: identifiers and numeric quantities only. Source, paths, finding text/snippets, matched secrets, signing material, project labels, webhook URLs, and customer-entered content are forbidden.

## Canonical customer-usage dimensions

| Dimension ID | Unit and exact counting rule | Type/window | Reservation/enforcement | Current evidence and V1 status |
|---|---|---|---|---|
| `member.active` | One distinct active tenant membership occupying a seat. Pending invitation does not count until accepted; suspended/removed membership stops counting when the state transition commits. A person in two tenants consumes one seat in each. Service identities use a separate contracted dimension. | Gauge; instantaneous with peak/current snapshots | Atomically authorize and reserve the Nth active membership before invite acceptance/reactivation; release on removal. | No tenant or membership table exists. Current entitlement `seats` claims are not enforcement. Target: Pro 2, Team 5, Studio 10, Enterprise contracted. |
| `application.monitored_active` | One active tenant-owned application with one stable application ID. Repositories, branches, fingerprints, activations, and monitor registrations map to it but do not independently consume units. Re-registering or rotating a fingerprint does not add an application. | Gauge; instantaneous | Reserve before first active monitoring registration for an application; release when monitoring is disabled/deleted after dependent jobs stop. | Current `monitor_registrations` is keyed by license/fingerprint and cannot prove application identity. Target: Pro 5, Team 25, Studio 100, Enterprise contracted. |
| `client_workspace.active` | One active Studio client workspace, independent of applications inside it. Archived workspaces stop consuming after retention/restore semantics complete; rapid archive/restore cannot bypass limits. | Gauge; instantaneous | Reserve before workspace creation/restore; release after archive transition completes. | No client workspace model exists. Target: Studio 20; other public plans unset; Enterprise contracted. |
| `record.hosted_ingested` | One canonical Release Record accepted into hosted custody for the first time in the window, keyed by tenant plus record digest. Idempotent retry, re-upload of the same digest, verification, download, metadata repair, and server retry do not add units. Rejection does not count; later deletion does not refund the monthly unit. | Counter; monthly allowance window | Reserve before ingestion, commit only after durable record/object/index transaction succeeds, release on failure. | Current `attestations` rows are unsigned summaries, not canonical records and not authoritative usage. Target: Pro 100/month, Team 500/month, Studio 2,000/month, Enterprise contracted. |
| `storage.byte_hour` | Sum of physical tenant-attributable bytes persisted for one hour across database payload, object versions, indexes attributable by measurement, and retained exports. Record logical and physical/compressed bytes separately; do not double count replicas already priced inside a provider rate. | Accumulation; hourly, aggregated to billing/retention windows | Measurement for cost and capacity. It becomes customer-enforced only after a catalog/contract allowance is approved. | No storage measurement exists and no public numeric storage allowance is approved. Retention days do not imply unlimited bytes. |
| `verification.public_request` | One completed public verification HTTP request classified by outcome (`valid`, `invalid`, `not_found`, `rate_limited`, `error`) and cache tier. Bots, cache hits, origin hits, and egress bytes remain separate attributes/cost dimensions. An IP/day uniqueness row is not a request count. | Counter; request timestamp and monthly rollup | Rate/abuse controls precede optional quota reservation. Only an explicitly cataloged outcome can consume a customer allowance. | Current `attestation_verifications` deduplicates hash plus daily IP digest and cannot meter traffic. No numeric public-traffic allowance is approved; Studio capability itself is not an unlimited-traffic promise. |
| `alert.logical_delivery` | One alert event addressed to one configured channel, independent of attempts. Email + Slack + webhook for one advisory are three logical deliveries. Canary/test, immediate, digest, suppressed, and customer-disabled states are tagged separately. | Counter; monthly rollup | Reserve only if a future catalog allowance applies; commit when an outbox intent is durably created. Retries do not consume another customer unit. | Current `alert_dispatches` is one row per registration/advisory/package with channel JSON, so it cannot reconcile per-channel delivery. No numeric alert allowance is approved. |
| `advisory.component_evaluation` | One normalized released component coordinate evaluated against one advisory snapshot/version. Reusing a cached result for many inventories records one source evaluation plus the number of inventory matches separately. | Counter; job and monthly rollups | Internal capacity/cost measurement by default; future customer quota requires an activated catalog rule. | Current cron re-queries each registration's full dependency list and records neither query nor component work. No customer advisory-work allowance is approved. |
| `managed_execution.run` | One admitted hosted Hunt, import transformation, private-runner job, or other managed execution, classified by execution kind and isolation class. A retry is another internal attempt but not another customer run unless the customer starts a new logical request. | Counter; monthly customer window | Reserve before enqueue/admission; commit when the logical job is durably accepted; release if never admitted. Every plan value is bounded. | No managed execution service exists. It is separately metered if launched; no bundled allowance is approved. Enterprise/private-runner values are contracted. |
| `support.case` | One support case with a stable case ID; reopen within the policy window remains the same case. Severity, channel, plan, and response/SLA class are attributes. | Counter; contract/service window | Operational measurement; enforcement only for a contractually bounded service. | No support system integration or numeric allowance exists. Enterprise support is contracted; public-plan support promises remain unset. |

### Internal work and cost dimensions

Customer usage alone cannot explain hosted cost. The following internal dimensions are measured even when they never appear as a customer quota:

| Dimension ID | Unit | Attribution rule |
|---|---|---|
| `compute.invocation` | Function/worker/job attempt | Attribute directly to tenant/resource when safe; otherwise record shared/unattributed. |
| `compute.millisecond` | Actual execution milliseconds | Record runtime/region/worker class; retries remain visible. |
| `compute.memory_byte_millisecond` | Configured or measured memory bytes multiplied by execution time | Preserve provider billing granularity separately from raw measurement. |
| `queue.operation` | Enqueue, lease, ack, retry, dead-letter, replay operation | Link to logical job and attempt; a replay never rewrites history. |
| `database.operation` | Query/mutation/transaction count plus measured rows/bytes where available | Never infer exact provider cost without its billing export. |
| `storage.byte_hour` | Physical attributable bytes over time | Allocate shared/index/backup bytes under a versioned rule; retain an unattributed bucket. |
| `network.egress_byte` | Bytes leaving the hosted boundary | Classify destination/provider/region and cached versus origin response. |
| `verification.origin_request` | Origin execution for a public verification request | Separate from CDN/cache request and customer-facing request count. |
| `advisory.source_query` | External advisory API request/batch | Store provider, batch size, cache hit/miss, outcome, and retry attempt—not package names in the usage event. |
| `alert.delivery_attempt` | Provider attempt per channel | Link all retries to one `alert.logical_delivery`; record provider response class, never destination/secret. |
| `managed_execution.attempt` | Sandbox/runner attempt | Link to logical run; add CPU milliseconds, memory-byte milliseconds, egress bytes, artifact bytes, timeout, and exit class. |
| `support.human_minute` | Whole staffed minute attributed to a case | Timer/source and role class required; no automatic customer charge. |

Provider-specific billable units are recorded in a versioned mapping beside these stable Verglos dimensions. A changed provider SKU must not change historic unit semantics.

## Plan allowance mapping

Values below reproduce approved target defaults and explicit unknowns; they do not activate checkout or authorization.

| Dimension | Free | Pro target | Team hypothesis | Studio hypothesis | Enterprise |
|---|---|---:|---:|---:|---|
| `member.active` | No hosted account required; local user unmetered | 2 | 5 | 10 | Contracted |
| `application.monitored_active` | Unset; local projects unmetered | 5 | 25 | 100 | Contracted |
| `client_workspace.active` | Unset | Unset | Unset | 20 | Contracted |
| `record.hosted_ingested` | Unset; local records unmetered | 100/month | 500/month | 2,000/month | Contracted |
| History retention | No hosted storage required | 90 days target; current public truth remains 30 | 12 months | 3 years | Contracted |
| Storage bytes | Unset | Unset | Unset | Unset | Contracted |
| Public verification traffic | Unset | Unset | Unset | Unset | Contracted |
| Logical alert deliveries | Unset | Unset | Unset | Unset | Contracted |
| Advisory evaluations | Unset | Unset | Unset | Unset | Contracted |
| Managed execution | None approved | Separately metered if launched | Separately metered if launched | Separately metered if launched | Contracted and bounded |
| Support | No numeric promise | Unset | Unset | Unset | Contracted service/SLA |

An `unset` hosted allowance cannot be advertised as included, unlimited, or purchasable. A capability may be present while its protective operational limit is still internal, but production activation requires an explicit safe capacity ceiling and user-visible behavior. Founder approval plus measured COGS is required before converting an unset value into a public catalog allowance.

## Window and lifecycle semantics

- Counter windows are derived from the subscription/catalog contract in UTC. Monthly allowances use subscription-anniversary subwindows; annual billing still receives twelve monthly record windows unless a catalog version explicitly says otherwise.
- Gauge dimensions enforce the current active count, not creations during the month. Store every state transition and periodic reconciliation snapshot; report current and peak values.
- Retention is an object lifecycle rule, not a resettable usage counter. A policy/version and `retain_until` value are fixed when data is accepted, subject to explicit legal hold, contract migration, or user-requested earlier deletion.
- Catalog changes do not rewrite a live window silently. The entitlement snapshot records the catalog version/effective interval; upgrades may increase current limits immediately, while downgrade behavior must be previewed and must not delete or hide existing data.
- All quantities use integers and canonical base units: bytes, milliseconds, attempts, requests, records, memberships, applications, and workspaces. Human presentation may convert units but never change accounting.
- Test/canary/internal/founder activity is tagged and excluded from customer billing while retained in cost measurement. Production traffic cannot be hidden as test traffic through a client-controlled flag.

## Immutable ledger contract

The hosted data model later implemented by `HOSTED-009` and `PLAN-WEB-005/006` must provide these logical records:

### Usage event

- immutable `event_id`, tenant, subscription, catalog version, dimension/version, integer quantity/unit, occurrence/receipt times, window ID, resource type/opaque ID, operation, source service, environment, and idempotency key;
- classification as customer allowance, internal cost, both, test, correction, or migration;
- optional link to reservation, logical action, job, attempt, and prior event being corrected;
- allowlisted non-content metadata such as region, runtime, provider class, result class, cache class, and isolation class;
- no mutable balance field treated as source of truth.

### Reservation

- immutable tenant/dimension/window and requested quantity with a unique idempotency key;
- states `reserved`, `committed`, `released`, or `expired`, each with timestamp/reason and exactly-once transition rules;
- atomic comparison against committed plus unexpired reservations for counters, or current resource state plus reservations for gauges;
- expiry and reconciliation for abandoned requests without granting work first;
- linkage from successful work to one committed usage event.

### Aggregate/projection

- rebuildable per-tenant/dimension/window totals and current gauges;
- catalog allowance, committed, reserved, remaining, utilization percentage, threshold state, and as-of watermark;
- versioned warning history so retries do not send repeated 80%/100% notices;
- never the sole audit source; drift against events/resources triggers reconciliation failure.

### Provider cost entry

- provider, service/SKU, invoice/export source ID and digest, service period, ingestion timestamp, currency, amount in minor units, billed quantity/unit, tax/credit classification, and actual-versus-estimate label;
- direct tenant/resource attribution where the provider exposes it; otherwise a versioned allocation rule and explicit shared/unattributed remainder;
- corrections as linked entries and currency conversion only with dated source/rate evidence;
- no customer charge derived directly from an internal cost entry.

## Idempotency and quota examples

| Operation | Customer usage result | Internal cost result |
|---|---|---|
| Same record upload retried after a response timeout | One `record.hosted_ingested` commit by tenant+digest idempotency | Every storage/compute/network attempt remains measurable. |
| Record validation fails before durable acceptance | Reservation released; zero record usage | Validation compute/request cost remains. |
| Accepted record is deleted later that month | Monthly record count is not refunded; stored bytes stop accruing after verified deletion | Deletion work and final byte-hour watermark remain. |
| Alert email retries twice before success | One logical delivery | Three provider attempts plus compute/queue cost. |
| One advisory snapshot is reused for 100 inventories | Customer work remains per approved dimension, currently unset | One source query/evaluation plus 100 inventory matches, cache operations, and worker time. |
| Public verification served from cache | One public request if that future allowance counts it | CDN request/egress; zero origin invocation. |
| Two concurrent requests try to consume the last record unit | Exactly one reservation succeeds | Both admission attempts can have small internal cost; denied work does not ingest. |
| User reaches 100 records included | The 100th succeeds; the 101st new digest is rejected unless pre-authorized overage exists | Existing data/read/verify/local operations continue. |

## Current implementation gap

The current hosted schema contains no tenant, membership, catalog version, allowance, usage event, reservation, aggregate, cost entry, invoice-line reconciliation, or overage authorization model.

- `monitor_registrations` can approximate active fingerprints per license but cannot represent stable applications, tenant ownership, or safe concurrency.
- `attestations` counts unsigned summary rows, not canonical record ingestion, and has no monthly idempotency contract.
- `attestation_verifications` counts unique hash/IP-digest pairs rather than requests, cache/origin work, or egress.
- `alert_dispatches` mixes a logical advisory alert with a JSON map of channel outcomes; retries and provider attempts are not durable.
- The sequential cron does not record advisory query batches, component evaluations, cache reuse, worker duration, or per-tenant work.
- Current plan constants contain seats/projects/history only, with conflicting Pro app and history semantics and no server-side ledger enforcement.
- No production provider invoice, rate card, database/storage byte measurement, queue bill, delivery bill, verification traffic baseline, managed-execution baseline, or support-time source is checked into the evidence set. Current per-plan COGS is therefore unknown.

Existing rows may seed a dry-run comparison, but they are not silently promoted into billable usage. Migration events are marked `migration`, excluded from new-window quota unless an approved rule says otherwise, and reconciled by count/digest before cutover.

## Cost and plan viability reporting

For each plan/catalog version and service month, report:

- active subscriptions and recognized net revenue from the billing system, separate from usage;
- actual direct provider cost, allocated shared cost, unattributed cost, support human minutes/cost, credits/tax treatment, and evidence completeness;
- usage totals and distributions for every dimension, including retries, denial rate, cache rate, and peak gauges;
- cost per active tenant, monitored application, accepted record, successful logical delivery, verification request, advisory evaluation, and managed run where the denominator is meaningful;
- gross contribution amount/rate only when revenue and cost periods/currencies reconcile; otherwise `unknown` with the missing evidence;
- p50/p95/p99 tenant consumption and concentration so a safe bounded allowance is based on real behavior rather than averages alone.

No margin or `cost per X` claim may divide by zero, omit unattributed spend, mix calendar and billing periods, use list prices when invoices differ, or present estimates as actual. Provider rates are volatile operational inputs and belong in dated private evidence/configuration, not duplicated public constants.

## Reconciliation and release gates

1. Replaying all immutable events deterministically rebuilds aggregates and matches resource state at a recorded watermark.
2. Duplicate requests, worker retries, webhook replays, queue replay, transaction rollback, timeout-after-commit, and concurrent last-unit tests produce exactly one customer usage result.
3. Every accepted hosted record has one committed reservation/event; every committed record event resolves to a durable tenant-owned record and storage measurement.
4. Seat/application/workspace gauges reconcile to active authoritative resources; invitation, removal, archive, restore, ownership transfer, and tenant migration races are tested.
5. 80% warning and 100% admission behavior are tested for each enforced dimension/window. The Nth included unit succeeds; N+1 preserves existing hosted data and all local operation.
6. Overage remains disabled unless catalog/contract, explicit consent, maximum spend/quantity, gateway behavior, invoice line, and cancellation tests pass.
7. Cost imports reconcile line-for-line and total-to-total with provider evidence, retain unattributed spend, and survive credits/corrections/multi-currency cases.
8. Usage events pass forbidden-field/privacy tests and tenant authorization tests; operators cannot query another tenant through ledger APIs.
9. Dashboard, entitlement, invoice, and export show the same catalog version, window, quantity, allowance, warning state, and as-of time.
10. Per-plan hosted COGS and support cost are measured on representative internal traffic before a target plan or managed feature becomes active. No unbounded managed execution ships.

`TRUTH-008` changes no runtime metering, quota, price, checkout, plan activation, blog content, or landing-page content.
