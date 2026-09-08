# Verglos shipping decisions

## 2026-09-08 — Build before external validation

The founder sequence is feature-complete implementation and internal qualification first, then frozen-repository POC/Reddit validation and campaign. Internal tests are continuous; external validation does not define unfinished capabilities as shipped.

## 2026-09-08 — One npm package

Free, Pro, Team, and Studio use one signed npm front door. Local capabilities remain independently usable; hosted value is protected by server-side authorization, not hidden client checks.

## 2026-09-08 — Evidence producers versus Verglos contracts

Trivy, detect-secrets, Docker, IaC, SARIF, SBOM, and provenance are evidence producers. Versioned Verglos subjects, observations, policy, lineage, and Release Records are the stable product contracts.

## 2026-09-08 — UX hierarchy

The first dashboard view answers “can this exact release ship?” and progressively discloses scanner details, raw evidence, and history. This follows GitHub/GitLab security-report patterns and progressive-disclosure guidance.

## 2026-09-08 — Canonical plan catalog and legacy aliases

The target public ladder is Free, Pro, Team, Studio, and Enterprise. Founder becomes an internal override, Compliance remains a read-compatible legacy alias for Enterprise, and Sentinel remains a retired alias for Pro. A versioned server-side catalog owns price, period, currency, allowances, capabilities, status, and effective dates. CLI gates consume opaque entitlement data; server authorization protects hosted value.

Current Pro remains $29/month or $290/year, subject to proving the gateway charge matches display. Team $99/$990 and Studio $249/$2,490 are inactive launch hypotheses until founder activation and acceptance. A $79 Team or $199 Studio offer may exist only as a named, time-bounded founding cohort. Enterprise remains contract-priced; entry ARR is a hypothesis, not a quote.

Migration is dual-read and reversible. Existing licenses retain access; Sentinel maps to Pro, Compliance maps to Enterprise, unknown writes are rejected, and Founder status moves outside the public plan field. See `VERGLOS_PLAN_AND_CAPABILITY_RECONCILIATION.md`.

## 2026-09-08 — Language truth

V1 is language-neutral at artifact, policy, record, and import layers, but native deep SAST remains JS/TS. Imported or external coverage must be labeled separately.

## 2026-09-08 — Open-core and protected-value boundary

All eight current CLI packages are Apache-2.0 core, including private npm package shells. Existing detector and explanation source cannot be silently converted into premium content. Local evidence contracts, import/export, record creation, and independent verification remain open and useful without hosted signup.

Commercial value is the server-authorized operation of authentication, tenants, billing, monitoring, retention, delivery, collaboration, approvals, client workspaces, managed runners, SLA, and support. New premium rule/policy packs and signed Hunt recipes may be separately licensed only when their content license, provenance, digest, update, entitlement, notice, and revocation contracts are approved. Third-party and customer data retain their own ownership class.

Verglos brand and official signing authority are protected identities, not permissions granted by access to source. Public verification roots may be distributed; private keys and official release authority remain controlled and revocable. See `VERGLOS_OPEN_CORE_AND_COMMERCIAL_BOUNDARY.md`.

## 2026-09-08 — Unknown third-party rights fail redistribution

Unknown or unreviewed license, notice, provenance, modification, trademark, source-offer, or service-term status blocks bundling and redistribution of that asset, not local architecture work. A user-supplied external engine may be invoked through an open adapter before Verglos is authorized to redistribute the engine.

Release compliance is measured from actual artifacts, not only manifests: npm tarballs, platform packages, deployed/downloadable web output, engine caches, standards schemas, recipe feeds, and offline bundles each require generated notices and an SBOM where applicable. See `VERGLOS_THIRD_PARTY_INVENTORY.md`.

## 2026-09-08 — Local-first privacy and purpose-separated consent

Free local scanning remains useful without signup, source upload, or scan metering. `Local` does not mean zero network: any registry, advisory, provider-verification, account, analytics, upload, publication, or delivery request must name its recipient and fields and expose the applicable control before execution.

Analytics is affirmative, revocable, coarse, and separate from authenticated product synchronization. Stable project fingerprints, project names, license/account/machine identifiers, IP-derived digests, and destination URLs are identifying or pseudonymous data and must not be described as anonymous. CI, quiet, non-interactive, and agent execution default to no analytics.

No telemetry dataset ships without a named owner, enforced retention, deletion path, access policy, and tests preventing source, absolute paths, finding text/snippets, matched secrets, signing material, raw credentials, and customer identifiers from entering analytics, logs, public verification, or support artifacts. Upload and public publication require separate exact-field previews and explicit approval. See `VERGLOS_TELEMETRY_AND_PRIVACY_INVENTORY.md`.

## 2026-09-08 — Immutable hosted usage and evidence-backed cost

Verglos keeps customer allowance accounting separate from internal provider cost. Seats, monitored applications, and client workspaces are current-state gauges; canonical hosted records are idempotent monthly ingestion counters; storage, public verification, alert delivery, advisory work, managed execution, and support have stable measurable units even when no sellable allowance is approved.

Usage is append-only, versioned, tenant-scoped, and reservation-backed. Corrections compensate rather than rewrite. At 80% the owner is warned once per dimension/window; the included amount remains usable through 100%, and only the next new hosted increment is denied unless an explicit pre-authorized overage exists. Existing hosted records and all local operation remain available.

Unknown allowance or provider-cost values remain `unset`/unknown, never unlimited or zero. Cost claims require dated invoice/export evidence or a clearly labeled measured estimate with an allocation rule and unattributed remainder. See `VERGLOS_HOSTED_COST_AND_USAGE_LEDGER.md`.

## 2026-09-08 — Additive tenant/evidence migration with honest legacy types

Hosted data migrates by expand, idempotent backfill, dual write, shadow read, per-surface cutover, and only later contract. Target rows retain a unique legacy mapping and source digest; ambiguous or unsafe data is quarantined. Rollback uses compatible schemas and feature-controlled reads/writes or a forward fix, not destructive down migrations after new data exists.

Each current user receives at most a provisional personal tenant and owner membership; an email domain never creates an organization. License/fingerprint rows may seed provisional applications within that license only. Legacy score history remains a score projection, reports remain quarantined until ownership/schema/privacy validation, and random-hash attest summaries remain legacy public summaries. Migration never invents an exact subject, release decision, observation lineage, signature, record digest, or verification.

No target resource becomes authoritative before tenant-scoped data access, negative authorization, count/digest reconciliation, old-client compatibility, and tested backup/restore pass. Old tables remain available through the rollback and retention windows. See `VERGLOS_DATA_AND_SCHEMA_MIGRATION_INVENTORY.md`.

## 2026-09-08 — Command compatibility is process-observable behavior

The current 19-command CLI is frozen as an observed compatibility baseline, including syntax, aliases, current working-directory defaults, report filenames/schema, filesystem and network effects, stdout/stderr, and command-specific exits. Internal function tests are insufficient; every command requires an isolated process fixture.

Known defects and alpha-shell behavior are recorded without making them permanent ideals. Fixes to fail-open/incomplete states, hook overwrite/false success, unvalidated values, telemetry consent, or inconsistent exits must be intentional and tested. Hunt/Attest replace exit 78 only after their gates pass, and old report/config readers remain available through a versioned migration.

The target common flags and command groups are additive planned contracts, not descriptions of the current binary. See `VERGLOS_COMMAND_COMPATIBILITY_INVENTORY.md`.

## 2026-09-08 — V1 architecture set

V1 uses an Apache local evidence core behind one signed `verglos` npm front door and a tenant-aware hosted modular monolith with separately scalable durable workers. Evidence producers remain replaceable behind versioned subject, observation, coverage, policy, record, and error contracts. Those contracts are language-neutral; current native deep SAST remains explicitly JS/TS.

Postgres owns transactional metadata/authorization; content-addressed object storage owns bounded evidence payloads; a transactional outbox and durable at-least-once queue own asynchronous work. Queue and object providers remain deferred until measured contract, security, privacy, recovery, exit, and actual-cost gates pass.

Customer local, organization, and Verglos official signing authorities are separate. Verglos official keys sign Verglos-controlled releases/content/receipts, never customer evidence as a Verglos-authored security fact. No universal customer signing key is held. See `VERGLOS_ARCHITECTURE_DECISION_SET.md`.

## 2026-09-08 — Risk closure requires executable evidence

Every V1 risk has a stable ID, accountable owner, severity, trigger, prevention/detection evidence, rollback or containment action, blocking release gate, status, and residual-risk statement. Documentation alone cannot close a risk. Critical risks block the affected feature/release; high-risk exceptions require bounded founder and owner acceptance with evidence, expiry, and reversal trigger.

Current report authorization, generic-webhook SSRF, raw credential/project-linked telemetry, package notice omissions, unreproducible foundational schema, false-clean monitoring/delivery, and unbound payment amount/catalog behavior are active release blockers. See `RISKS.md`.

## 2026-09-08 — Fresh supported-runtime baseline

Regression evidence uses exact repository commits, a cache-bypassed CLI task graph, and the web repository's declared Node 22 engine. A passing build is not integration, security, privacy, migration, distribution, or product acceptance evidence. Unsupported-runtime passes are supplemental only, and a repository with no tests records a coverage gap rather than a passing zero-test suite. See `VERGLOS_BASELINE_VERIFICATION.md`.

## 2026-09-08 — Schema identity and canonical JSON foundation

Verglos schema meaning uses a stable `urn:verglos:schema:*` identifier and a separate strict `MAJOR.MINOR.PATCH` representation version. Patch versions cannot change shape; readers accept known older minors within a major, require an upgrade for newer documents, and require an explicit migration for an older major. Compatibility never replaces schema validation.

The legacy scan report remains exactly `schemaVersion: 2.0.0` without a newly injected identity. A reader may map it to `urn:verglos:schema:scan-report` only through an explicit legacy option, so missing identity is never guessed for arbitrary JSON.

Verglos canonical JSON v1 accepts only the JSON data model, rejects coercion and ambiguous runtime values, sorts object names by UTF-16 code units, preserves array order, and emits compact UTF-8. Bounded readers reject input/structure limits with typed actionable errors and do not echo invalid source content. Raw signed-envelope readers must additionally detect duplicate property names before cryptographic verification. See `VERGLOS_SCHEMA_VERSION_AND_CANONICAL_JSON.md`.

## 2026-09-08 — Content-bound subject identity

A subject names immutable evaluated content, not a tenant, application, mutable lookup, local absolute path, or authorization. Its ID is a SHA-256 digest of a kind-specific canonical identity projection and is recomputed on read. Repository trees bind Git commit/tree and dirty worktree content; packages and generic artifacts require content digests; filesystem snapshots bind both tree and ignore policy; SBOMs bind complete document bytes; OCI manifests bind digest plus explicit platform; OCI indexes bind their own digest and retain explicit unique child platforms.

Mutable OCI tags, registry mirrors, paths, media labels, and reported sizes remain non-identity context and cannot substitute for a digest. A tag-only image is invalid. The same manifest bytes and platform retain one subject ID across mirrors/tags, while tenant/application ownership and source provenance remain separate authorization and lineage relationships. See `VERGLOS_SUBJECT_CONTRACT.md`.

## 2026-09-09 — Producer health cannot collapse into empty success

Engine health records producer identity, digested binary/runtime, configuration, databases and checks, their source/trust, capabilities, and dated freshness independently from a run's process exit. Healthy state cannot contain incomplete reasons or stale components; every degraded, unavailable, incompatible, or stale state requires typed scope and recovery action.

Tool-run success is only a process outcome. Complete coverage additionally requires a healthy engine and no incomplete reasons. Failed, timed-out, cancelled, or not-run work and any non-healthy snapshot are structurally incomplete; a process may exit successfully while unsupported or partial coverage remains incomplete. Evidence producers cannot report target-code execution—bounded Hunt execution remains a separate verification contract. See `VERGLOS_ENGINE_RUN_AND_HEALTH_CONTRACT.md`.

## 2026-09-09 — AI-change evidence classes remain separate

Heuristic AI-change context is always an estimate with reproducible method/config/input digests, named signals, confidence, and visible limitations. Tool metadata, user statements, commit messages, and Git trailers remain declarations unless independently signed and verified. They are not silently promoted to cryptographic evidence.

A valid signature proves only that an identified signer signed exact statement bytes under the recorded trust policy. It does not independently prove line-level authorship. Signed build or artifact provenance cannot assert AI-change classification unless the signed claim itself is specifically an AI-change claim. See `VERGLOS_AI_CHANGE_CONTEXT_CONTRACT.md`.

## 2026-09-09 — Verification outcomes are bounded and non-boolean

V1 verification attempts use exactly six outcomes: `confirmed`, `not_reproduced`, `inconclusive`, `not_supported`, `environment_error`, and `policy_denied`. Confirmation and non-reproduction require executed evidence. Unsupported and policy-denied attempts cannot execute. Environment failure remains separate from non-reproduction, and a bounded non-reproduction never becomes a universal false-positive statement.

Execution binds an immutable subject and observation, verified recipe and trust policy, exact input/parameter digests, approval, sandbox/runtime, network policy, limits, measured usage, cleanup, and redacted-output digests. The document validates these recorded claims but does not itself prove enforcement. The old `verified`, `false`, and `not_attemptable` labels remain legacy compatibility inputs requiring explicit migration; they are not V1 output truth. See `VERGLOS_VERIFICATION_ATTEMPT_CONTRACT.md`.

## 2026-09-09 — Exceptions are exact requests, not mutable bypasses

A V1 policy exception names one immutable subject and an explicit bounded set of observation IDs. Wildcards, future observations, permanent validity, and free-text scope expansion are invalid. The request records owner, requester, reason, evidence-backed compensating controls, reversal triggers, effective time, expiry, and limitations.

Human approval is a separate immutable record bound to the exception ID and SHA-256 digest of the complete canonical request. Editing the request invalidates the approval target. Applicability is evaluated against decision, time, approval validity, exact subject, and exact observation; parsing or retaining an expired record grants nothing. Server-side approver authority, revocation/event history, and control-health verification remain downstream requirements. See `VERGLOS_EXCEPTION_AND_APPROVAL_CONTRACT.md`.

## 2026-09-09 — Incomplete evidence outranks policy violations

Policy evaluation derives four results from exact identity and recorded check facts: `PASS=0`, `BLOCK=1`, `REVIEW=2`, and `INCOMPLETE=3`. A missing, stale, unsupported, or erroneous required check and any mismatched or unresolved subject identity force `INCOMPLETE`, even when another check would block. This preserves both facts without presenting a definitive complete decision from partial evidence.

Satisfied and failed checks require current evidence. Stale state requires an elapsed validity boundary; missing and unsupported state cannot claim evidence. Advisory gaps yield review and advisory checks cannot directly block. Decisions, exit codes, and code-unit-ordered reasons are derived fields and readers reject contradictions. See `VERGLOS_POLICY_EVALUATION_CONTRACT.md`.

## 2026-09-09 — Release decisions preserve evaluation truth

A release decision is a bounded immutable projection of one exact policy evaluation, not a second place to choose an outcome. It records exactly one primary subject matching the evaluation subject, optional unique supporting subjects, the policy, canonical evaluation digest/reference, approval references, issuer identity/authority, generation time, and limitations.

The release result must equal the evaluation result, so `INCOMPLETE` cannot be upgraded during packaging. Policy is repeated in the evaluation reference and cross-checked against the top-level binding. Referenced approvals must predate generation and remain valid at that time. These are portable claims, not proof of hosted RBAC, signature validity, deployment, or publication authority. See `VERGLOS_RELEASE_DECISION_CONTRACT.md`.
