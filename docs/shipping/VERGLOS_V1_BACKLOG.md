# Verglos V1 master execution backlog

Updated: 2026-09-08

This is the dependency-ordered execution tracker for the final Verglos V1 described by `SHIP_VERGLOS_FINAL.md`, `VERGLOS_PRODUCT_ARCHITECTURE_BLUEPRINT.md`, and `VERGLOS_COMPANY_USAGE_AND_FEATURE_MAP.md`.

## Scope lock

- Authorized repositories: `verglos-cli` and `verglos-web` only.
- Product sequence: Inspect -> Decide -> Prove -> Monitor.
- Native deep source analysis remains JavaScript/TypeScript. Adapter/import coverage is labeled separately.
- Free remains useful without signup, source upload, or local metering.
- The Apache CLI is not a commercial security boundary. Hosted authorization and bounded operational value are enforced server-side.
- Trivy is an attributed, pinned, replaceable sensor. Trivy types and display language cannot enter policy, billing, dashboard, or Release Record contracts.
- Missing, stale, incompatible, or failed evidence yields `INCOMPLETE`, never an empty success or false `PASS`.
- Ordinary scanning never executes target code. Hunt is explicit, approved, recipe-bound, isolated, and network-denied by default.
- Blog work is outside the two authorized repositories and is excluded.
- Landing-page, homepage, campaign, and marketing-copy changes are held until the final truth-lock phase. They must not begin without a later founder command.
- External POC, comparative benchmark publication, paid pilots, and campaign launch start only after the release candidate passes internal gates.

## Tracker rules

- Checkbox state is the task state: unchecked = `not-started`; the active item must also be named in `STATUS.md`; completed items require acceptance evidence and commit IDs.
- Every task is a deployable or independently reviewable behavior slice and forecasts one commit. Split into two or three only when reviewability demands it; combine adjacent IDs only when they are genuinely one deployable behavior. Tests ship with the behavior they prove unless an independently useful fixture/contract must land first.
- Every implementation commit updates this tracker, `STATUS.md`, and `TRACEABILITY.md` when state or evidence changes.
- `Commit(s): —` is replaced with repository-local SHAs. A commit never spans both repositories.
- Do not mark a task verified from compilation alone when behavior, security, isolation, tenancy, billing, migration, or recovery is involved.
- Non-goals for every task: unrelated refactors, speculative services, hidden source upload, silent engine install, client-only paywalls, unsupported claims, and marketing work before the final phase.

## Commit forecast

This is a planning baseline, not a quota. Split or combine only when a logical review boundary demands it.

| Epic | CLI commits | Web commits | Total |
|---|---:|---:|---:|
| 00 Truth, governance, and migration inventory | 13 | 0 | 13 |
| 01 Versioned evidence contracts | 12 | 0 | 12 |
| 02 Target and immutable subject resolution | 11 | 0 | 11 |
| 03 Engine manager and Trivy adapter | 15 | 0 | 15 |
| 04 Standards import/export | 12 | 0 | 12 |
| 05 Normalization, lineage, and release diff | 9 | 0 | 9 |
| 06 Policy, baselines, exceptions, and CI | 13 | 0 | 13 |
| 07 Local command product and viewer | 12 | 0 | 12 |
| 08 Agent/MCP safety and Hunt | 18 | 0 | 18 |
| 09 `.vgl`, signing, and verification | 12 | 2 | 14 |
| 10 Hosted tenant/evidence data model | 0 | 13 | 13 |
| 11 Durable monitoring and operations | 0 | 15 | 15 |
| 12 Entitlements, usage, quotas, and billing | 4 | 12 | 16 |
| 13 Pro dashboard and migration | 0 | 10 | 10 |
| 14 Team workflows | 2 | 10 | 12 |
| 15 Studio workflows | 1 | 10 | 11 |
| 16 Enterprise contract surfaces | 2 | 8 | 10 |
| 17 Packaging, provenance, licensing, and release | 11 | 3 | 14 |
| 18 Integrated qualification | 6 | 6 | 12 |
| 19 Post-RC acceptance and GA truth lock | 9 | 1 | 10 |
| **Core ship forecast** | **162** | **90** | **252** |
| 20 Held final landing/marketing pass | 0 | 8 | 8 |
| **End-to-end forecast** | **162** | **98** | **260** |

Expected working range: 250–290 commits. Reforecast after Epics 00–02 expose migration and compatibility complexity.

## Critical path

`TRUTH -> CONTRACT -> TARGET -> ENGINE/IMPORT -> GRAPH -> POLICY -> LOCAL -> HUNT/RECORD -> HOSTED DATA -> OPERATIONS -> ENTITLEMENT -> DASHBOARDS -> DISTRIBUTION -> QUALIFICATION -> ACCEPTANCE -> FINAL MARKETING`

---

## Epic 00 — Truth, governance, commercial boundary, and migration inventory

Evidence/problem: public and internal registries disagree on plan names, prices, maturity, history, Hunt/Attest semantics, and the commercial boundary. The CLI branch is ahead of `origin/main` and contains untracked founder documents/assets. Preserve all of them.

- [x] **TRUTH-001** · `verglos-cli` repo-wide inventory · deps: none · Map every command, flag, package, detector, report, network call, telemetry field, entitlement, and current test to shipped/partial/planned evidence. Acceptance: paths and tests populate the truth registry; no behavior changes. Impact: docs only; all plans. Commit(s): `9877482`
- [x] **TRUTH-002** · `verglos-web` routes/libs/schema inventory · deps: TRUTH-001 · Map hosted auth, licenses, activations, reports, telemetry, monitoring, alerts, attest summaries, account routes, and production dependencies. Acceptance: every current hosted claim links to code/schema evidence. Impact: docs only. Commit(s): `803c8b4`
- [x] **TRUTH-003** · `docs/shipping/VERGLOS_TRUTH_REGISTRY.md` · deps: TRUTH-001/002 · Expand registry to command- and capability-level states with evidence, owner, reviewed date, and public wording. Acceptance: no unqualified Hunt, Attest, Team, Studio, Enterprise, Trivy, `.vgl`, or dashboard claim. Commit(s): `6038545`
- [x] **TRUTH-004** · CLI/web plan registries · deps: TRUTH-001/002 · Record every mismatch among `shared/plans`, entitlement plans, web capabilities, database plan strings, checkout, and account UI. Acceptance: reconciliation decision is logged before implementation. Commit(s): `f8515dc`
- [x] **TRUTH-005** · open-core boundary inventory · deps: TRUTH-001 · Classify Apache core, commercial hosted operations, separately licensed maintained rules/recipes, and protected brand/signing identities. Acceptance: each package/data feed has one class and owner. Commit(s): `883e6b5`
- [x] **TRUTH-006** · third-party inventory · deps: TRUTH-001 · Inventory direct/transitive dependencies, existing licenses/notices, external engines, standards libraries, fixture licenses, and modification obligations. Acceptance: unknown classifications block redistribution, not local planning. Commit(s): `b758de3`
- [x] **TRUTH-007** · telemetry/privacy inventory · deps: TRUTH-001/002 · Document every outbound request, payload field, opt-in/out path, retention assumption, credential/log surface, and upload consent boundary. Acceptance: source/path/finding/secret leakage cases are named. Commit(s): `08a3b12`
- [x] **TRUTH-008** · hosted cost/usage ledger design · deps: TRUTH-002/004 · Define measurable units for seats, applications, records, storage, verification traffic, alert delivery, advisory work, managed execution, and support. Acceptance: units map to plan allowances without invented costs. Commit(s): `c80f16f`
- [x] **TRUTH-009** · data/schema migration inventory · deps: TRUTH-002 · Map current tables and API consumers to target tenant/project/subject/evidence model; identify dual-read/write and rollback needs. Acceptance: no destructive migration is proposed. Commit(s): `e66737a`
- [x] **TRUTH-010** · command compatibility inventory · deps: TRUTH-001 · Freeze current command/flag/exit behavior and deprecation risks against the target contract. Acceptance: compatibility fixtures are listed for every existing public command. Commit(s): `a76487d`
- [x] **TRUTH-011** · architecture decision set · deps: TRUTH-004/005/008/009 · Record modular-monolith/workers, one npm front door, evidence-producer boundary, language labels, plan catalog authority, queue/object storage decision gates, and signing model. Acceptance: material contradictions are explicit. Commit(s): `702b404`
- [x] **TRUTH-012** · risk register expansion · deps: TRUTH-005/006/007/009 · Add owners, severity, trigger, mitigation, rollback, and gate for licensing, migration, tenant, SSRF, Hunt, signature, quota, cost, and privacy risks. Commit(s): `eb438c5`
- [x] **TRUTH-013** · baseline verification · deps: TRUTH-001/002 · Run existing CLI tests/build/typecheck and web typecheck/build without modifying unrelated files; record exact commits and failures. Acceptance: baseline distinguishes pre-existing failures from new regressions. Commit(s): `744797c`

Ready after this epic: CONTRACT-001, PLAN-WEB-001, LIC-001.

## Epic 01 — Versioned subject, observation, decision, verification, and error contracts

Evidence/problem: current `ScanResult`/`Finding` are file-centric, use transitional optional fields, and cannot represent artifacts, engine health, imported lineage, incomplete coverage, policy decisions, or durable records.

- [x] **CONTRACT-001** · `packages/shared` schema/version primitives · deps: TRUTH-003/010 · Define semantic schema IDs, compatibility policy, canonical serialization rules, and bounded parsing errors. Acceptance: old report fixtures remain readable or fail with an actionable version error. Commit(s): `84d3921`
- [x] **CONTRACT-002** · subject contract · deps: CONTRACT-001 · Add versioned subject types for repository/tree, package, filesystem, SBOM, generic artifact, OCI manifest, and OCI index/platform. Tests: malformed IDs, mutable-only tags, missing digests, path bounds. Commit(s): `1bc2b1b`
- [x] **CONTRACT-003** · tool-run and engine-health contracts · deps: CONTRACT-001 · Model producer, binary/config/database/check digests, capabilities, timing, health, freshness, and incomplete reasons. Tests: absence/staleness/incompatibility. Commit(s): `a71fba7`
- [x] **CONTRACT-004** · canonical observation contract · deps: CONTRACT-002/003 · Model native/imported/adapter coverage, IDs, locations/layers, PURL/CPE, original/normalized severity, confidence, fix, references, redacted evidence, and namespaced extensions. Commit(s): `65ea279`
- [x] **CONTRACT-005** · AI-change context contract · deps: CONTRACT-002 · Separate heuristic/declared/cryptographic provenance with method, confidence, signals, limitations, and subject binding. Acceptance: no heuristic renders as fact. Commit(s): `f6be31e`
- [x] **CONTRACT-006** · verification-attempt contract · deps: CONTRACT-002/004 · Replace boolean-style verification with `confirmed`, `not_reproduced`, `inconclusive`, `not_supported`, `environment_error`, `policy_denied`; record recipe/sandbox/input/output/limits. Commit(s): `fc4d8d2`
- [x] **CONTRACT-007** · exception and approval contracts · deps: CONTRACT-002/004 · Add scope, owner, reason, expiry, compensating control, approver identity, and audit reference. Tests: expired and over-broad scopes. Commit(s): `2dd8ea3`
- [x] **CONTRACT-008** · policy evaluation contract · deps: CONTRACT-003/004/007 · Define PASS/REVIEW/BLOCK/INCOMPLETE reasons, evidence freshness, required checks, identity match, and deterministic exit mapping. Commit(s): `dc9e0b4`
- [x] **CONTRACT-009** · release-decision contract · deps: CONTRACT-008 · Bind policy, evaluation, approvals, exact subjects, generated time, decision identity, and limitations. Tests: subject mismatch and incomplete propagation. Commit(s): `03533ab`
- [x] **CONTRACT-010** · Release Record manifest contract · deps: CONTRACT-002-009 · Define member media type, digest, size, redaction, bundle/schema version, and extension rules without fixing archive transport prematurely. Commit(s): `c1fa719`
- [x] **CONTRACT-011** · typed error/failure taxonomy · deps: CONTRACT-001/003/006/008 · Separate usage, unsupported, incomplete, policy block, infrastructure, authorization, quota, integrity, and internal failures. Commit(s): `a1e8f1f`
- [x] **CONTRACT-012** · frozen contract fixtures and validators · deps: CONTRACT-002-011 · Add valid/invalid/backward-compatibility fixtures plus deterministic serialization tests. Acceptance: fixtures usable by CLI, imports, viewer, web API, and independent verifier. Commit(s): `d4b1296`

## Epic 02 — Target resolution and immutable subject identity

Evidence/problem: the current scanner accepts a project path and fingerprint but cannot prove which commit, artifact, or image was evaluated.

- [x] **TARGET-001** · target resolver package boundary · deps: CONTRACT-002/011 · Add resolver interface, capability discovery, explicit target syntax, and no-execution invariant. Commit(s): `3b1877e`
- [x] **TARGET-002** · repository/worktree resolver · deps: TARGET-001 · Resolve root, HEAD commit/tree, dirty state, submodule status, shallow state, and safe relative paths. Tests: detached HEAD, no Git, dirty tree, symlink escape. Commit(s): `1ec9ba8`
- [x] **TARGET-003** · package/build metadata resolver · deps: TARGET-001/002 · Resolve package manager, lockfile digest, package identity/version, build config inputs, and workspace membership without executing scripts. Commit(s): `ee5b4b9`
- [x] **TARGET-004** · filesystem subject resolver · deps: TARGET-001 · Produce deterministic tree/content digest with ignore policy and explicit unreadable/skipped coverage. Tests: ordering, permission failure, symlink cycles, path traversal. Commit(s): `a3de37a`
- [x] **TARGET-005** · generic artifact resolver · deps: TARGET-001 · Hash regular files/directories, record media type/size, reject special devices, and stream within size limits. Commit(s): `0fb7f21`
- [x] **TARGET-006** · SBOM subject resolver · deps: TARGET-001 · Bind imported CycloneDX/SPDX documents to their declared subject and document digest; mismatch is incomplete. Commit(s): `b72e2b6`
- [x] **TARGET-007** · OCI reference parser and registry boundary · deps: TARGET-001 · Parse registry/repository/tag/digest/platform safely; threat tests cover credential leakage and malformed references. Commit(s): `69a5eaa`
- [ ] **TARGET-008** · OCI manifest/index resolver · deps: TARGET-007 · Resolve mutable tags once to immutable digest, select/record platform, preserve index and child digests, and never silently choose a platform. Commit(s): —
- [ ] **TARGET-009** · local OCI layout/tar resolver · deps: TARGET-005/007 · Read OCI/Docker archives with size, member, traversal, symlink, and decompression protections. Commit(s): —
- [ ] **TARGET-010** · source-to-artifact linkage · deps: TARGET-002/003/005/008 · Correlate declared provenance/build metadata; distinguish matched, mismatched, unavailable, and unverifiable. Acceptance: mismatch cannot PASS. Commit(s): —
- [ ] **TARGET-011** · `verglos target inspect` command · deps: TARGET-002-010 · Emit human/JSON subject manifest with deterministic exit codes and explicit incomplete coverage. Tests: repo, artifact, OCI index, offline error. Commit(s): —

## Epic 03 — Versioned engine manager, verified Trivy adapter, and engine exit

Evidence/problem: no engine-adapter contract or verified engine lifecycle exists. External tools must remain attributed and replaceable.

- [ ] **ENGINE-001** · `EngineAdapter` contract implementation · deps: CONTRACT-003/004, TARGET-001 · Define capability, requirements, health, execute, normalize, raw-output, and update metadata boundaries. Commit(s): —
- [ ] **ENGINE-002** · engine manifest format · deps: ENGINE-001 · Add signed compatibility manifest schema for platform artifacts, checksums, source, license, version range, and rollback metadata. Commit(s): —
- [ ] **ENGINE-003** · engine cache layout and atomic install transaction · deps: ENGINE-002 · Use user-controlled cache path, staging, fsync/rename strategy, lock, cleanup, and explicit rollback. Tests: concurrent/partial install. Commit(s): —
- [ ] **ENGINE-004** · safe archive downloader/extractor · deps: ENGINE-003 · Stream with limits; reject checksum/signature mismatch, traversal, symlink/hardlink escape, unexpected members, and partial output. Commit(s): —
- [ ] **ENGINE-005** · trusted source and signature verification · deps: ENGINE-002/004 · Pin allowed origins/identities and verify artifact before activation. Acceptance: no trust from filename, URL text, or `PATH`. Commit(s): —
- [ ] **ENGINE-006** · system-engine mode · deps: ENGINE-001 · Require explicit path, verify version/capabilities/digest, display trust status, and never silently use same-named binaries. Commit(s): —
- [ ] **ENGINE-007** · mirror/offline source mode · deps: ENGINE-002-005 · Support customer mirror and pre-seeded cache with signed manifest/database/check metadata and no forced internet. Commit(s): —
- [ ] **ENGINE-008** · `engines install/status/update/rollback` commands · deps: ENGINE-003-007 · Add approval-oriented UX, JSON output, deterministic exits, and compatibility reporting. Commit(s): —
- [ ] **ENGINE-009** · Trivy adapter execution profiles · deps: ENGINE-001, TARGET-002-009 · Add repository/filesystem/image/IaC/SBOM profiles with bounded process execution and no target-code execution. Commit(s): —
- [ ] **ENGINE-010** · Trivy JSON parser/normalizer · deps: ENGINE-009, CONTRACT-004 · Treat output as untrusted bounded input, preserve raw bytes and namespaced extensions, and map to canonical observations. Commit(s): —
- [ ] **ENGINE-011** · Trivy attribution and run metadata · deps: ENGINE-010 · Record binary/database/check/config digests, timestamps, capabilities, license, and source in every run/view/export. Commit(s): —
- [ ] **ENGINE-012** · Trivy golden compatibility fixtures · deps: ENGINE-010/011 · Freeze supported version outputs and reject unknown major/schema drift as incomplete. Commit(s): —
- [ ] **ENGINE-013** · engine freshness and failure policy · deps: ENGINE-011/012, CONTRACT-008 · Map missing/stale/incompatible/database errors to affected incomplete coverage; never create empty success. Commit(s): —
- [ ] **ENGINE-014** · raw evidence retention/replay · deps: ENGINE-010-013 · Content-address raw output and metadata locally; replay normalization without rescanning; test tamper detection. Commit(s): —
- [ ] **ENGINE-015** · engine-exit fixture adapter and drill · deps: ENGINE-001/014, GRAPH/POLICY/RECORD later · Implement fixture/alternate adapter now; final drill is gated after downstream epics. Acceptance: no Trivy types escape adapter tests. Commit(s): —

## Epic 04 — Standard evidence import/export

Evidence/problem: mature teams already produce SARIF, SBOM, VEX, and provenance. Verglos must preserve source attribution and validate formats rather than relabel evidence as native.

- [ ] **IMPORT-001** · importer registry and bounded reader · deps: CONTRACT-003/004/011 · Detect format/version, stream or cap input, preserve source digest, and reject ambiguous/oversized content. Commit(s): —
- [ ] **IMPORT-002** · SARIF 2.1.0 importer · deps: IMPORT-001 · Preserve tool/driver/rule/run/location/fingerprint/automation details and reject malformed paths/URIs. Commit(s): —
- [ ] **IMPORT-003** · CycloneDX SBOM importer · deps: IMPORT-001, TARGET-006 · Preserve BOM serial/version, components/PURLs/hashes/dependencies/licenses and subject relationship. Commit(s): —
- [ ] **IMPORT-004** · SPDX SBOM importer · deps: IMPORT-001, TARGET-006 · Preserve document namespace, packages/files/checksums/licenses/relationships and subject identity. Commit(s): —
- [ ] **IMPORT-005** · CycloneDX VEX importer · deps: IMPORT-003 · Preserve vulnerability analysis state, justification, response, detail, timestamps, and component link; never convert assertion into native verification. Commit(s): —
- [ ] **IMPORT-006** · in-toto/SLSA provenance importer · deps: IMPORT-001, TARGET-010 · Validate envelope/statement shape, subjects, builder/run details, and mark unverified signatures separately. Commit(s): —
- [ ] **IMPORT-007** · GitHub/npm/BuildKit provenance adapters · deps: IMPORT-006 · Add provider-specific extraction behind the generic provenance contract with exact subject digest checks. Commit(s): —
- [ ] **IMPORT-008** · detect-secrets baseline importer/exporter · deps: IMPORT-001 · Preserve reviewed status and baseline metadata; no Python install or mandatory invocation. Commit(s): —
- [ ] **IMPORT-009** · optional explicit detect-secrets runner · deps: IMPORT-008, ENGINE-006 · Invoke only configured local installation, attribute it, bound it, and classify absence as unsupported/incomplete per policy. Commit(s): —
- [ ] **IMPORT-010** · SARIF exporter · deps: CONTRACT-004/008 · Emit validated SARIF with Verglos rule/source/subject/decision properties and no private evidence leakage. Commit(s): —
- [ ] **IMPORT-011** · CycloneDX/SPDX/VEX exporters · deps: IMPORT-003-005, GRAPH later · Emit standards-valid documents preserving original components, lineage, and decision/analysis state. Commit(s): —
- [ ] **IMPORT-012** · `verglos evidence import/export` commands · deps: IMPORT-002-011 · Add file/stdin/output behavior, summary, JSON, quiet, explicit attribution, and exit taxonomy. Commit(s): —

## Epic 05 — Normalization, stable identity, correlation, lineage, and release diff

Evidence/problem: existing finding IDs and score views are scanner-run oriented. Multiple sources need a stable graph without deleting lineage or double-counting risk.

- [ ] **GRAPH-001** · native finding-to-observation adapter · deps: CONTRACT-004/005, TRUTH-010 · Convert current JS/TS findings without breaking legacy reports; preserve native rule, context, confidence, provenance, and remediation. Commit(s): —
- [ ] **GRAPH-002** · canonical stable fingerprint v1 · deps: GRAPH-001, TARGET-002-009 · Derive from subject/location/package/advisory/rule/evidence class, never engine order or presentation text. Tests: repeatability, file moves, version changes, collisions. Commit(s): —
- [ ] **GRAPH-003** · severity/confidence normalization · deps: GRAPH-001, IMPORT-002-005, ENGINE-010 · Preserve originals, version mapping policy, and expose uncertain/unmapped values. Commit(s): —
- [ ] **GRAPH-004** · correlation graph · deps: GRAPH-002/003 · Link overlapping native/Trivy/imported observations while retaining every producer and raw reference. Acceptance: correlation never silently erases disagreement. Commit(s): —
- [ ] **GRAPH-005** · deduplication projection · deps: GRAPH-004 · Produce one review item with lineage for exact duplicates and bounded fuzzy candidates requiring review. Tests: three-tool duplicate and near-match. Commit(s): —
- [ ] **GRAPH-006** · source-to-artifact lineage graph · deps: TARGET-010, IMPORT-006/007, GRAPH-004 · Connect commit/tree/build/SBOM/image/artifact evidence with explicit gaps and mismatches. Commit(s): —
- [ ] **GRAPH-007** · release snapshot format · deps: GRAPH-002-006 · Freeze subject, coverage, normalized observations, lineage, and policy inputs for deterministic comparison. Commit(s): —
- [ ] **GRAPH-008** · release diff engine · deps: GRAPH-007 · Classify new/fixed/worsened/unchanged observations plus coverage/identity/policy changes. Tests: detector upgrade, moved file, changed artifact, stale evidence. Commit(s): —
- [ ] **GRAPH-009** · `verglos diff` command · deps: GRAPH-008 · Render decision-first terminal/JSON diff with base/head identity and no hosted requirement; history lookup remains Pro hosted. Commit(s): —

## Epic 06 — Policy evaluation, baselines, exceptions, approvals, and CI semantics

Evidence/problem: current score and critical-threshold gates cannot express required evidence, freshness, identity mismatch, accountable exceptions, or `INCOMPLETE`.

- [ ] **POLICY-001** · policy document schema/versioning · deps: CONTRACT-008/011 · Define required checks, thresholds, confidence, freshness, coverage, artifact match, Hunt requirements, exceptions, approvals, and extension rules. Commit(s): —
- [ ] **POLICY-002** · policy loader/merge precedence · deps: POLICY-001 · Resolve defaults/config/CLI/organization policy deterministically, reject unknown unsafe fields, and record effective digest. Commit(s): —
- [ ] **POLICY-003** · basic Free policy profile · deps: POLICY-002, GRAPH-007 · Preserve critical gate while adding explicit coverage and incomplete behavior without signup. Commit(s): —
- [ ] **POLICY-004** · configurable Pro policy profile · deps: POLICY-002 · Add score/severity/confidence/freshness/Hunt settings while keeping local execution unmetered. Commit(s): —
- [ ] **POLICY-005** · baseline contract and local store · deps: GRAPH-002/007 · Review and persist accepted existing observations with subject/policy metadata and safe concurrent writes. Commit(s): —
- [ ] **POLICY-006** · baseline comparison · deps: POLICY-005, GRAPH-008 · Distinguish new debt from accepted existing debt and expose stale/mismatched baseline as review/incomplete. Commit(s): —
- [ ] **POLICY-007** · exception creation/validation · deps: CONTRACT-007, POLICY-002 · Require owner, reason, bounded scope, expiry, compensating control, and explicit human approval. Commit(s): —
- [ ] **POLICY-008** · exception expiry and audit projection · deps: POLICY-007 · Expired/revoked exceptions re-enter evaluation; immutable event trail records changes. Commit(s): —
- [ ] **POLICY-009** · deterministic evaluator · deps: POLICY-003/004/006/008, ENGINE-013, GRAPH-006 · Emit PASS/REVIEW/BLOCK/INCOMPLETE with ordered reasons and never downgrade incomplete through score. Commit(s): —
- [ ] **POLICY-010** · policy explanation renderer · deps: POLICY-009 · Explain exact subject, policy digest/version, evidence gaps, blockers, owner, and next action without severity-color dependence. Commit(s): —
- [ ] **POLICY-011** · `verglos policy check` command · deps: POLICY-009/010 · Support record/snapshot input, common flags, JSON/quiet, exit 0/1/2/3 semantics, and no mutation by default. Commit(s): —
- [ ] **POLICY-012** · CI command migration · deps: POLICY-011, TRUTH-010 · Route existing `verglos ci`/`scan --ci` through the same evaluator while preserving documented compatibility and machine output. Commit(s): —
- [ ] **POLICY-013** · policy adversarial matrix · deps: POLICY-009-012 · Test every PASS/REVIEW/BLOCK/INCOMPLETE combination, stale/missing engines, identity mismatch, expired exceptions, unknown rules, and deterministic ordering. Commit(s): —

## Epic 07 — Local command product, configuration, report projections, and viewer

Evidence/problem: current commands do not share the promised common flags, and HTML/JSON reports are scan presentations rather than release-decision views.

- [ ] **LOCAL-001** · command framework/common options · deps: CONTRACT-011, TRUTH-010 · Standardize `--help`, `--json`, `--quiet`, `--config`, `--policy`, output paths, consent prompts, and exit handling without breaking current aliases. Commit(s): —
- [ ] **LOCAL-002** · versioned config migration · deps: LOCAL-001, POLICY-001, ENGINE-001 · Replace obsolete node-vm/firecracker laptop defaults, validate engine/Hunt/record/telemetry sections, and provide actionable migration warnings. Commit(s): —
- [ ] **LOCAL-003** · Inspect orchestration pipeline · deps: TARGET, ENGINE, IMPORT, GRAPH · Run selected native/adapters/imports into one snapshot with cancellation, bounded concurrency, progress, and coverage manifest. Commit(s): —
- [ ] **LOCAL-004** · scan compatibility projection · deps: LOCAL-003, GRAPH-001, TRUTH-010 · Preserve current terminal/HTML/JSON outputs for existing users while exposing new schema opt-in/migration path. Commit(s): —
- [ ] **LOCAL-005** · release header projection · deps: POLICY-009, GRAPH-008 · Show decision, exact subjects/digests, policy, generated time, signer state, and incomplete coverage first. Commit(s): —
- [ ] **LOCAL-006** · change/action projection · deps: LOCAL-005 · Show new/fixed/worsened/unchanged, coverage delta, blockers, owner, remediation, rescan, and Hunt eligibility. Commit(s): —
- [ ] **LOCAL-007** · evidence/lineage projection · deps: LOCAL-005, GRAPH-004/006 · Show producer attribution, raw evidence reference, confidence, timestamp, engine health, and limitations. Commit(s): —
- [ ] **LOCAL-008** · exception/export projection · deps: LOCAL-005, POLICY-008, IMPORT-010/011 · Show exception scope/expiry/control plus `.vgl`, JSON, SARIF, CycloneDX, SPDX, VEX, HTML/PDF choices. Commit(s): —
- [ ] **LOCAL-009** · packaged loopback-only viewer server · deps: LOCAL-005-008 · Bind safely to loopback, use unpredictable session path, no external assets, CSP, path controls, and clean shutdown. Commit(s): —
- [ ] **LOCAL-010** · viewer accessible UI · deps: LOCAL-009 · Implement developer/lead/client projections, keyboard navigation, semantic structure, AA contrast, reduced motion, print/machine alternatives, and empty/error states. Commit(s): —
- [ ] **LOCAL-011** · `verglos report view` command · deps: LOCAL-009/010 · Open or print URL explicitly, support no-browser mode, validate record/report input, and reveal no unexpected local files. Commit(s): —
- [ ] **LOCAL-012** · local end-to-end fixtures · deps: LOCAL-003-011 · Prove no-account scan -> inspect -> policy -> diff -> viewer -> export journey on macOS/Linux/Windows path conventions. Commit(s): —

## Epic 08 — Agent/MCP authority, remediation safety, and supported local Hunt

Evidence/problem: current MCP tools are a separate thin surface and Hunt is a shell with unsafe obsolete `node-vm` concepts and ambiguous verdicts.

- [ ] **AGENT-001** · shared action/authority contract · deps: CONTRACT-011, LOCAL-001 · Define inspect/propose/mutate/install/execute/network/except/sign/publish/upload/policy/billing actions and approval requirements. Commit(s): —
- [ ] **AGENT-002** · auditable approval request/receipt · deps: AGENT-001 · Record actor, requested action, exact target, files/network, policy effect, decision, timestamp, and expiry; reject replay or widened scope. Commit(s): —
- [ ] **AGENT-003** · MCP server contract migration · deps: AGENT-001, LOCAL-003, POLICY-009 · Route tools through the same scanner/policy/error/entitlement contracts; preserve legacy names during deprecation. Commit(s): —
- [ ] **AGENT-004** · MCP discovery/capability truth · deps: AGENT-003, TRUTH-003 · Advertise only shipped/partial capabilities with plan, permission, inputs, outputs, side effects, and maturity. Commit(s): —
- [ ] **AGENT-005** · safe scan/package/pre-write tools · deps: AGENT-003 · Keep read-only actions approval-light, bound input sizes/paths, preserve attribution, and return decision/coverage rather than a second finding model. Commit(s): —
- [ ] **AGENT-006** · explanation/remediation proposal tools · deps: AGENT-003, POLICY-010 · Propose bounded changes without writing; include tests, policy effect, uncertainty, and no hidden network. Commit(s): —
- [ ] **AGENT-007** · fix application approval boundary · deps: AGENT-002/006 · Require explicit write approval, show diff, block out-of-scope paths, run selected tests, rescan, and support rollback guidance. Commit(s): —
- [ ] **HUNT-001** · declarative signed recipe schema · deps: CONTRACT-006, AGENT-001, TARGET-001 · Define rule/target support, image digest, command template, assertions, inputs, isolation, limits, cleanup, network reason, redaction, signature, and version. Commit(s): —
- [ ] **HUNT-002** · recipe verification/trust store · deps: HUNT-001 · Verify signature/content digest/license/feed provenance and reject expired/revoked/unknown recipes. Commit(s): —
- [ ] **HUNT-003** · recipe planner/dry run · deps: HUNT-002, GRAPH-002 · Match exact subject/finding/rule, render intended files/process/network/limits, and never accept arbitrary model shell. Commit(s): —
- [ ] **HUNT-004** · A1 trusted probe runner · deps: HUNT-003 · Run only built-in pure probes in a restricted process with explicit non-isolation label and full resource/process-tree limits. Commit(s): —
- [ ] **HUNT-005** · hardened Docker A2 adapter · deps: HUNT-003 · Enforce non-root, read-only source/rootfs, tmpfs, dropped caps, no-new-privileges, seccomp, no socket/devices/namespaces, network deny, and resource bounds. Commit(s): —
- [ ] **HUNT-006** · synthetic input/redaction pipeline · deps: HUNT-003-005 · Replace secrets, cap/stdout/stderr, hash evidence, redact paths/identifiers, and prove raw secrets cannot escape. Commit(s): —
- [ ] **HUNT-007** · verdict/failure classifier · deps: CONTRACT-006, HUNT-004-006 · Distinguish confirmed/not-reproduced/inconclusive/not-supported/environment-error/policy-denied; infrastructure failure cannot become false-positive. Commit(s): —
- [ ] **HUNT-008** · initial high-value recipe set · deps: HUNT-002-007, LIC-001 later · Implement only evidence-backed recipes with positive/negative/timeout/failure fixtures and explicit supported-rule coverage. Commit(s): —
- [ ] **HUNT-009** · `verglos hunt` functional command · deps: HUNT-008, POLICY-009, PLAN-CLI · Replace exit-78 shell only when gates pass; require approval, entitlement, supported recipe, and structured local result. Commit(s): —
- [ ] **HUNT-010** · MCP Hunt tools · deps: AGENT-003/002, HUNT-009 · Expose plan/approval-limited finding/report/before-write/explain tools without extra authority or arbitrary execution. Commit(s): —
- [ ] **HUNT-011** · sandbox adversarial suite · deps: HUNT-005-010 · Test network, socket, device, namespace, symlink, fork bomb, CPU/memory/disk/output/time, signal, cleanup, and secret exfiltration defenses. Commit(s): —

## Epic 09 — Canonical `.vgl` assembly, signing, verification, provenance, and public projection

Evidence/problem: current Attest is a shell, while the web endpoint mints unsigned score-summary URLs. The target is a deterministic portable record with independent verification.

- [ ] **RECORD-001** · content-addressed local blob/member store · deps: CONTRACT-010, ENGINE-014 · Stream and hash members, cap sizes/counts, reject duplicate/path-escape names, and provide deterministic layout. Commit(s): —
- [ ] **RECORD-002** · `.vgl` assembly · deps: RECORD-001, GRAPH-007, POLICY-009 · Assemble subjects, runs, observations, lineage, verification, exceptions, policy, decision, exports, viewer, signatures, and redaction manifest. Commit(s): —
- [ ] **RECORD-003** · deterministic manifest/canonicalization · deps: RECORD-002 · Stable member ordering/media types/digests/sizes and reproducibility across repeated builds. Commit(s): —
- [ ] **RECORD-004** · safe record reader · deps: RECORD-001-003 · Verify every member before use; reject bombs, traversal, symlinks, duplicates, malformed JSON, unknown required media, and unsupported versions. Commit(s): —
- [ ] **RECORD-005** · in-toto statement/predicate · deps: RECORD-003, TARGET-010 · Bind Release Decision and exact subjects in a versioned predicate interoperable with standard tooling. Commit(s): —
- [ ] **RECORD-006** · Sigstore/cosign adapter · deps: RECORD-005, ENGINE-style trust controls · Support explicit keyless/user identity flow, record issuer/identity/bundle, and never hold a universal Verglos customer key. Commit(s): —
- [ ] **RECORD-007** · user-supplied/offline signing adapter · deps: RECORD-005 · Keep basic local signing open, validate key material handling, and document trust-policy limitations. Commit(s): —
- [ ] **RECORD-008** · independent offline verifier · deps: RECORD-004/006/007 · Verify manifest, subjects, envelope, identity/issuer policy, timestamps/materials, redaction, and decision language without dashboard/network. Commit(s): —
- [ ] **RECORD-009** · `record create/sign/verify` commands · deps: RECORD-002-008, AGENT-002 · Add explicit signing approval, deterministic exits, JSON/quiet, no-upload default, and useful tamper reasons. Commit(s): —
- [ ] **RECORD-010** · legacy `attest` compatibility path · deps: RECORD-009, TRUTH-010 · Deprecate/migrate alpha shell and obsolete Ed25519-summary types without falsely treating old public summaries as signed records. Commit(s): —
- [ ] **RECORD-011** · public redaction projection builder · deps: RECORD-002/004 · Allowlist subject/decision/signature/coverage/limitations; prove source, paths, raw findings, secrets, tenant/client IDs cannot leak. Commit(s): —
- [ ] **RECORD-012** · provenance ingestion in records · deps: IMPORT-006/007, RECORD-002/005 · Preserve npm/GitHub/BuildKit provenance verification state and source/artifact mismatch. Commit(s): —
- [ ] **VERIFY-WEB-001** · `verglos-web` record ingestion/receipt API · deps: RECORD-011, HOSTED schema later · Accept authenticated, bounded, explicitly uploaded redacted/private record projections with digest/idempotency/tenant checks; no source upload. Commit(s): —
- [ ] **VERIFY-WEB-002** · `verglos-web` verification API/page core · deps: VERIFY-WEB-001 · Verify stored projection/record receipt, expose immutable public fields and honest signature/identity/limitation states; do not touch the homepage. Commit(s): —

## Epic 10 — Hosted tenant, project, subject, inventory, and evidence data model

Evidence/problem: current web storage is user/license/report centric, lacks tenant IDs, uses JSON dependency snapshots, and has no durable Release Record/evidence graph model or migrations.

- [ ] **HOSTED-001** · `verglos-web` migration tooling and policy · deps: TRUTH-009 · Add generated/reviewed SQL migrations, journal, check/apply scripts, rollback/forward-fix rules, and CI schema validation; replace production reliance on `db:push`. Commit(s): —
- [ ] **HOSTED-002** · tenant/organization/membership schema · deps: HOSTED-001, TRUTH-011 · Add tenant-owned identities, roles, lifecycle, composite constraints, indexes, and creator migration fields. Commit(s): —
- [ ] **HOSTED-003** · project/application schema · deps: HOSTED-002 · Add tenant-scoped projects, environments, repository references, status, ownership, and immutable external IDs. Commit(s): —
- [ ] **HOSTED-004** · subject/release schema · deps: HOSTED-003, CONTRACT-002/009 · Add exact source/artifact/OCI subject identities, releases, decisions, policy digests, and uniqueness constraints. Commit(s): —
- [ ] **HOSTED-005** · tool-run/observation index schema · deps: HOSTED-004, CONTRACT-003/004 · Store queryable normalized/redacted metadata and raw-object references without embedding vendor structs. Commit(s): —
- [ ] **HOSTED-006** · evidence manifest/object schema · deps: HOSTED-004/005, CONTRACT-010 · Add content-addressed object metadata, encryption/redaction/access class, retention, digest, size, and immutable links. Commit(s): —
- [ ] **HOSTED-007** · policy/evaluation/exception/approval schema · deps: HOSTED-002-004, CONTRACT-007-009 · Model versioned policies and accountable decision history per tenant/project/release. Commit(s): —
- [ ] **HOSTED-008** · component inventory/advisory match schema · deps: HOSTED-004 · Normalize ecosystem/PURL/version/digest, released state, advisory matches, freshness, and reverse indexes. Commit(s): —
- [ ] **HOSTED-009** · job/outbox/usage/audit schema · deps: HOSTED-002 · Add idempotency, lease, retry, dead-letter, event, usage dimensions, and immutable audit indexes. Commit(s): —
- [ ] **HOSTED-010** · encrypted credential/channel schema · deps: HOSTED-002/009 · Replace plaintext JSON webhook credentials with versioned envelope-encrypted secrets and rotation metadata. Commit(s): —
- [ ] **HOSTED-011** · tenant-scoped repository/data-access layer · deps: HOSTED-002-010 · Require tenant context in every query/mutation, centralize authorization, and prevent unscoped lookups by type/API. Commit(s): —
- [ ] **HOSTED-012** · negative tenant authorization suite · deps: HOSTED-011 · Cover every tenant resource and non-member/role combination; permission denial reveals neither existence nor evidence. Commit(s): —
- [ ] **HOSTED-013** · current-data dual-write/backfill migration · deps: HOSTED-002-012 · Backfill users/licenses/monitor registrations/reports/attest summaries into target entities with dry run, counts, reconciliation, rollback, and no deletion. Commit(s): —

## Epic 11 — Durable queues, monitoring, outbox delivery, retention, observability, and recovery

Evidence/problem: one hourly sequential function processes every registration, an OSV failure can look like no findings, delivery has no durable retry, and generic webhooks expose SSRF risk.

- [ ] **OPS-001** · queue/provider ADR and interface · deps: TRUTH-008/011, HOSTED-009 · Select the smallest durable queue compatible with deployed constraints; define enqueue/lease/ack/retry/DLQ/fairness without speculative services. Commit(s): —
- [ ] **OPS-002** · scheduler/due-job producer · deps: OPS-001, HOSTED-008/009 · Enqueue only due daily registrations with deterministic idempotency keys, tenant fairness, backpressure, and observable lag. Commit(s): —
- [ ] **OPS-003** · inventory/advisory worker · deps: OPS-002 · Process bounded jobs, persist freshness/errors, and classify source outage as incomplete rather than clean. Commit(s): —
- [ ] **OPS-004** · advisory normalization/cache · deps: OPS-003 · Cache source responses/version/ranges with TTL/freshness and avoid repeated project-centric requests. Commit(s): —
- [ ] **OPS-005** · reverse component index matcher · deps: OPS-004, HOSTED-008 · Queue only affected released inventories for new/changed advisories. Commit(s): —
- [ ] **OPS-006** · transactional match/outbox write · deps: OPS-003/005, HOSTED-009 · Persist match and delivery intent atomically; duplicate worker delivery cannot duplicate state. Commit(s): —
- [ ] **OPS-007** · email/Slack delivery workers · deps: OPS-006 · Add bounded retry with jitter, idempotency, status, sanitization, and terminal failure/DLQ. Commit(s): —
- [ ] **OPS-008** · hardened webhook delivery · deps: OPS-006, HOSTED-010 · Block loopback/private/link-local/metadata/IPv6/resolved-private targets, re-resolve DNS, disable redirects, sign payloads, cap response/time. Commit(s): —
- [ ] **OPS-009** · alert dedup/recovery semantics · deps: OPS-007/008 · Separate event creation from successful channel delivery; safely retry failed channels and never suppress unsent alerts. Commit(s): —
- [ ] **OPS-010** · dead-letter inspection/replay · deps: OPS-001/007/008 · Add authorized bounded replay, reason/history, duplicate protection, and audit event. Commit(s): —
- [ ] **OPS-011** · retention/deletion workers · deps: HOSTED-006/009, PLAN-WEB later · Enforce plan retention with legal/hold exceptions, warnings, object/database consistency, and verifiable deletion. Commit(s): —
- [ ] **OPS-012** · telemetry aggregation/retention · deps: TRUTH-007, HOSTED-009 · Aggregate consented coarse events, minimize raw retention, honor opt-out/deletion, and prove no source/path/finding/secret fields. Commit(s): —
- [ ] **OPS-013** · operational health/metrics/alerts · deps: OPS-002-012 · Measure queue lag, job outcomes, advisory freshness, outbox failures, delivery latency, storage, quota, and costs with owned alert thresholds. Commit(s): —
- [ ] **OPS-014** · backup/restore and object reconciliation · deps: HOSTED-006/009, OPS-011 · Add documented backup, restore, digest reconciliation, orphan handling, and tested recovery procedure. Commit(s): —
- [ ] **OPS-015** · monitoring migration/cutover · deps: OPS-002-014, HOSTED-013 · Dual-run without double alerts, reconcile results, switch daily promise, preserve registrations, and keep rollback to old route until verified. Commit(s): —

## Epic 12 — Canonical plan catalog, server-side authorization, usage, quotas, and billing

Evidence/problem: CLI and web plan models disagree; Team is absent; current limits are not consistently enforced; payment display and gateway amounts are separate.

- [ ] **PLAN-WEB-001** · server-side plan catalog schema/config · deps: TRUTH-004/008, HOSTED-001 · Define Free/Pro/Team/Studio/Enterprise prices, billing periods, seats, apps, records, clients, retention, traffic, managed execution, status, and effective dates. Commit(s): —
- [ ] **PLAN-WEB-002** · capability registry from catalog · deps: PLAN-WEB-001 · Generate normalized capabilities/limits and eliminate compliance/founder public drift while preserving internal override separately. Commit(s): —
- [ ] **PLAN-WEB-003** · signed entitlement token vNext · deps: PLAN-WEB-002, HOSTED-002/003 · Bind tenant/user/role/plan/capabilities/allowances/version/expiry; support key rotation, revocation, and backward compatibility. Commit(s): —
- [ ] **PLAN-CLI-001** · opaque vNext entitlement consumption · deps: PLAN-WEB-003 · Treat server capabilities/limits as opaque versioned data, fail safely offline, preserve Free, and remove duplicated target-plan constants. Commit(s): —
- [ ] **PLAN-CLI-002** · effective-capability UX · deps: PLAN-CLI-001 · Update whoami/help/errors to show current plan, maturity, allowance source, expiry/grace, and actionable upgrade without claiming unavailable features. Commit(s): —
- [ ] **PLAN-WEB-004** · server-side authorization service · deps: PLAN-WEB-002/003, HOSTED-011 · Centralize resource/action/role/capability checks; never trust CLI flags or local gates. Commit(s): —
- [ ] **PLAN-WEB-005** · usage ledger write API/service · deps: PLAN-WEB-001, HOSTED-009/011 · Record idempotent dimensions for hosted ingestion/storage/traffic/alerts/managed work and expose auditable reconciliation. Commit(s): —
- [ ] **PLAN-WEB-006** · quota reservation under concurrency · deps: PLAN-WEB-005 · Atomically reserve/commit/release usage and prove concurrent requests cannot exceed limits. Commit(s): —
- [ ] **PLAN-WEB-007** · 80% warning behavior · deps: PLAN-WEB-005/006, OPS-006 · Notify owner once per threshold/window with exact allowance and no fear copy. Commit(s): —
- [ ] **PLAN-WEB-008** · 100% enforcement/overage behavior · deps: PLAN-WEB-006 · Preserve records and local work; reject only new hosted ingestion unless explicit upgrade/overage is active; no surprise charges. Commit(s): —
- [ ] **PLAN-WEB-009** · seat/member enforcement · deps: HOSTED-002, PLAN-WEB-004/006 · Enforce included seats and explicit additional-seat terms server-side, including races/invitations/removals. Commit(s): —
- [ ] **PLAN-WEB-010** · application/client/record/retention enforcement · deps: HOSTED-003/006, PLAN-WEB-004/006 · Enforce each allowance by catalog and lifecycle, not UI counters. Commit(s): —
- [ ] **PLAN-WEB-011** · billing amount/catalog binding · deps: PLAN-WEB-001 · Create gateway orders/subscriptions only from server catalog; validate currency/period/plan, verify webhooks, and reconcile displayed/charged amounts. Commit(s): —
- [ ] **PLAN-WEB-012** · billing lifecycle/idempotency · deps: PLAN-WEB-011 · Handle success/failure/refund/cancel/renew/expiry/replay/out-of-order events without duplicate license or silent access loss. Commit(s): —
- [ ] **PLAN-CLI-003** · modified/untrusted CLI test client · deps: PLAN-WEB-004-012 · Attempt forged plan, capability, tenant, usage, and record requests; hosted access remains protected. Commit(s): —
- [ ] **PLAN-CLI-004** · plan/catalog contract fixtures · deps: PLAN-WEB-002/003, PLAN-CLI-001 · Freeze client/server compatibility and old-token migrations across supported CLI versions. Commit(s): —

## Epic 13 — Pro dashboard and current-customer migration

Evidence/problem: the current account UI centers score/history/activation and is not the final release-decision dashboard. Preserve working customer access while migrating.

- [ ] **PRO-001** · authenticated dashboard shell/navigation · deps: HOSTED-011/013, PLAN-WEB-004 · Implement Home, Releases, Applications, Findings, Monitoring, Alerts, Policy, Members, Billing without altering public landing routes. Commit(s): —
- [ ] **PRO-002** · decision-first Home · deps: PRO-001, HOSTED-004/007 · Show exact current decision, five-app health, recent release changes, expiring exceptions, and allowance usage; score is secondary. Commit(s): —
- [ ] **PRO-003** · Releases/application views · deps: PRO-001, HOSTED-003/004 · List exact subjects, decisions, coverage, changes, signer state, and incomplete evidence with tenant-scoped pagination. Commit(s): —
- [ ] **PRO-004** · findings list/detail panel · deps: PRO-003, HOSTED-005 · Group canonical observations, preserve producer lineage, show remediation/Hunt eligibility, and avoid vendor-first IA. Commit(s): —
- [ ] **PRO-005** · monitoring/inventory view · deps: OPS-015, HOSTED-008 · Show released components, freshness, advisory matches, last successful check, failures, and affected releases. Commit(s): —
- [ ] **PRO-006** · alert configuration/delivery state · deps: OPS-007-010, HOSTED-010 · Configure encrypted channels, send auditable canary, and display retries/failures without exposing credentials. Commit(s): —
- [ ] **PRO-007** · private record history/signing identity · deps: VERIFY-WEB-001, RECORD-006/009 · Show records, digests, retention, signature identity, and offline download; explicit upload/sign actions only. Commit(s): —
- [ ] **PRO-008** · Pro member and billing/usage view · deps: PLAN-WEB-007-012 · Support two seats, invitations, allowance bars, threshold warnings, invoices/subscription state, and no client-side-only enforcement. Commit(s): —
- [ ] **PRO-009** · 30-to-90-day history migration · deps: HOSTED-013, PLAN-WEB-001, OPS-011 · Enable 90 days only after storage migration/cost/retrieval gates; public truth stays 30 days until verified. Commit(s): —
- [ ] **PRO-010** · current-customer regression/migration suite · deps: PRO-001-009 · Prove existing auth/license/activation/monitor/history users retain access and data through dual-read/cutover/rollback. Commit(s): —

## Epic 14 — Team organizations, shared policy, approvals, RBAC, CI, and work tracking

Evidence/problem: Team is a target plan with no current implementation. It must add organizational workflow rather than only higher quotas.

- [ ] **TEAM-CLI-001** · organization policy fetch/cache · deps: PLAN-CLI-001, HOSTED policy APIs · Fetch signed versioned shared policy with tenant/repo binding, offline behavior, and visible digest. Commit(s): —
- [ ] **TEAM-CLI-002** · CI approval/check payload · deps: TEAM-CLI-001, POLICY-009, RECORD-009 · Emit exact subject/decision/policy/record link for SCM check integration without uploading source. Commit(s): —
- [ ] **TEAM-WEB-001** · organization creation/member lifecycle · deps: HOSTED-002, PLAN-WEB-009 · Invite/accept/remove/deactivate members with five-seat default, audited role changes, and secure token expiry. Commit(s): —
- [ ] **TEAM-WEB-002** · RBAC matrix/enforcement · deps: TEAM-WEB-001, PLAN-WEB-004 · Implement owner/admin/approver/member/viewer actions and complete negative tests. Commit(s): —
- [ ] **TEAM-WEB-003** · shared policy versioning UI/API · deps: HOSTED-007, TEAM-WEB-002 · Draft/review/publish/rollback policies with immutable versions, diff, effective date, and audit. Commit(s): —
- [ ] **TEAM-WEB-004** · shared baseline/exception register · deps: TEAM-WEB-003, POLICY-005-008 · Manage scoped baselines/exceptions with owner/expiry/control and no silent approval. Commit(s): —
- [ ] **TEAM-WEB-005** · approval queue/release decision · deps: TEAM-WEB-002-004, HOSTED-004/007 · Authorized approvers review exact subject/policy/evidence and record immutable decision. Commit(s): —
- [ ] **TEAM-WEB-006** · GitHub/GitLab check integration core · deps: TEAM-CLI-002, TEAM-WEB-005 · Verify webhooks/installations, post idempotent checks, handle retries, and bind commit/artifact identity. Commit(s): —
- [ ] **TEAM-WEB-007** · Jira/Linear work-item integration · deps: TEAM-WEB-002, HOSTED-005/009 · Explicitly connect, create/update owned tasks idempotently, redact evidence, and audit external links. Commit(s): —
- [ ] **TEAM-WEB-008** · Team portfolio/history views · deps: TEAM-WEB-001-007 · Group releases by application/owner/decision, show 12-month history and policy adoption, with accessible filters. Commit(s): —
- [ ] **TEAM-WEB-009** · organization signing workflow · deps: RECORD-006, TEAM-WEB-005 · Require organization identity/issuer policy and approved exact decision; keep producer and approver identities separate. Commit(s): —
- [ ] **TEAM-WEB-010** · Team end-to-end/authorization suite · deps: TEAM-WEB-001-009 · Prove invite -> shared policy -> CI -> exception -> approval -> organization record across roles and cross-tenant denial. Commit(s): —

## Epic 15 — Studio client workspaces, branding, public verification, receipts, and portfolio

Evidence/problem: current Studio is a hypothesis and current attest summaries are not portable signed evidence. Studio earns its price through safe client separation and handoff workflow.

- [ ] **STUDIO-CLI-001** · client projection/upload workflow · deps: RECORD-011, PLAN-CLI-001 · Create explicit redacted/private projections, preview exactly what leaves, require upload approval, and bind client/workspace/record digests. Commit(s): —
- [ ] **STUDIO-WEB-001** · client workspace model/API · deps: HOSTED-002-007, PLAN-WEB-010 · Create up to catalog limits with strict tenant/client isolation, roles, lifecycle, and audit. Commit(s): —
- [ ] **STUDIO-WEB-002** · client authorization/leakage suite · deps: STUDIO-WEB-001 · Test cross-client IDs, listings, search, exports, signed URLs, caches, errors, and public routes. Commit(s): —
- [ ] **STUDIO-WEB-003** · canonical branding projection · deps: STUDIO-WEB-001, RECORD-011 · Apply agency/client logo/colors/domain only to presentation; canonical evidence, signer, policy, and limitations remain immutable. Commit(s): —
- [ ] **STUDIO-WEB-004** · public verification publication controls · deps: VERIFY-WEB-002, STUDIO-WEB-002/003 · Explicit publish/unpublish, redaction preview, stable digest, rate limits, abuse controls, cache policy, and audit. Commit(s): —
- [ ] **STUDIO-WEB-005** · custom-domain verification · deps: STUDIO-WEB-004 · Verify domain ownership, TLS/routing state, safe host handling, canonical record identity, revocation, and fallback URL. Commit(s): —
- [ ] **STUDIO-WEB-006** · handoff receipt model/workflow · deps: STUDIO-WEB-001/004 · Record exact delivered artifact, recipient acknowledgement, timestamp, privacy-safe identity, status, and immutable audit without implying acceptance of security perfection. Commit(s): —
- [ ] **STUDIO-WEB-007** · client portfolio dashboard · deps: STUDIO-WEB-001-006 · Show decisions, coverage gaps, expiring exceptions, handoffs, allowance, and owners across clients with safe aggregation. Commit(s): —
- [ ] **STUDIO-WEB-008** · three-year retention/export · deps: OPS-011/014, PLAN-WEB-010 · Enforce retention, legal/contract holds, bulk export, deletion, and customer-held independent verification. Commit(s): —
- [ ] **STUDIO-WEB-009** · Studio billing/allowance flows · deps: PLAN-WEB-006-012, STUDIO-WEB-001 · Enforce 10 seats/20 clients/100 apps/2,000 records/3 years from catalog with explicit overage/upgrade. Commit(s): —
- [ ] **STUDIO-WEB-010** · Studio end-to-end acceptance suite · deps: STUDIO-WEB-001-009 · Prove two isolated clients, branded redacted public verification, private evidence denial, handoff receipt, account deletion, and offline record validity. Commit(s): —

## Epic 16 — Enterprise contract surfaces

Evidence/problem: Enterprise features are hypotheses and must remain contract-led. Build reusable safe contract surfaces; do not invent customer-specific integrations or deploy private infrastructure without authorization.

- [ ] **ENT-CLI-001** · private runner protocol/client · deps: ENGINE/HUNT/RECORD, PLAN-CLI-001 · Outbound poll only, signed short-lived jobs, target allowlist, replay protection, least-evidence result projection, and no general remote shell. Commit(s): —
- [ ] **ENT-CLI-002** · KMS/HSM signing adapter contract · deps: RECORD-006-009 · Provider-neutral interface, explicit key/issuer policy, non-exportable key assumptions, rotation/revocation, and fixture adapter. Commit(s): —
- [ ] **ENT-WEB-001** · SSO organization contract · deps: TEAM-WEB-001/002 · Add provider-neutral domain/connection/session policy model behind contract status; actual provider activation requires buyer/credentials. Commit(s): —
- [ ] **ENT-WEB-002** · SCIM lifecycle contract/API · deps: ENT-WEB-001 · Idempotent provision/update/deactivate, bearer-secret rotation, group/role mapping, audit, and negative tests. Commit(s): —
- [ ] **ENT-WEB-003** · private runner enrollment/job API · deps: ENT-CLI-001, HOSTED-009/010 · One-time enrollment, local keys, signed leases, outbound polling, expiry/cancel, scoped result upload, and audit. Commit(s): —
- [ ] **ENT-WEB-004** · enterprise trust/KMS policy · deps: ENT-CLI-002, TEAM-WEB-009 · Store only references/policy, validate signer roots/issuers, rotate/revoke, and separate producer/approver/witness identities. Commit(s): —
- [ ] **ENT-WEB-005** · private verifier deployment contract · deps: VERIFY-WEB-002 · Package/configure verifier for customer boundary with offline trust materials and no dependency on public verification. Commit(s): —
- [ ] **ENT-WEB-006** · complete audit export · deps: HOSTED-009, TEAM/Studio events · Stream signed/hashed tenant events with cursor, retention, redaction, SIEM-friendly format, and authorization tests. Commit(s): —
- [ ] **ENT-WEB-007** · residency/retention/egress controls · deps: HOSTED-006/010, OPS-011 · Enforce configured data region/projection/retention at ingestion and runner return; do not claim unsupported regions. Commit(s): —
- [ ] **ENT-WEB-008** · enterprise readiness suite · deps: ENT-WEB-001-007 · Test lifecycle, runner replay/isolation, key revocation, offboarding, audit completeness, export, disaster recovery hooks, and contract feature flags. Commit(s): —

## Epic 17 — Cross-platform packaging, trusted publishing, provenance, licenses, notices, and release automation

Evidence/problem: security tooling must ship through a trustworthy, reproducible, legally compliant path. Existing repo has Apache license but no complete SBOM/notices/release qualification system.

- [ ] **LIC-001** · dependency license classifier · deps: TRUTH-006 · Generate direct/transitive package inventory with declared/detected license, source, redistribution class, notice obligation, and review blockers. Commit(s): —
- [ ] **LIC-002** · external engine/content license records · deps: TRUTH-005/006, ENGINE-002 · Record Trivy/detect-secrets/fixtures/standards tooling and separately delivered premium rule/recipe licenses, provenance, modification, and trademark language. Commit(s): —
- [ ] **LIC-003** · generated `THIRD_PARTY_NOTICES` · deps: LIC-001/002 · Produce deterministic human-readable notices retaining applicable LICENSE/NOTICE text and upstream identity without implying endorsement. Commit(s): —
- [ ] **LIC-004** · dependency SBOM · deps: LIC-001 · Generate CycloneDX/SPDX SBOMs for released npm package/workspace with reproducible metadata and CI drift check. Commit(s): —
- [ ] **LIC-005** · contributor ownership policy · deps: TRUTH-005 · Record copyright owner, contribution terms/DCO-or-CLA decision, inbound license, and future entity-assignment path before material outside contributions. Commit(s): —
- [ ] **DIST-001** · package contents/front-door audit · deps: LOCAL/HUNT/RECORD · Verify one `verglos` bin, package exports, no private keys/source fixtures/unintended files, and explicit optional-engine behavior. Commit(s): —
- [ ] **DIST-002** · trusted npm publishing workflow · deps: LIC-003/004, DIST-001 · Use GitHub OIDC trusted publishing/provenance, protected environment, least permissions, immutable version/tag, and no long-lived npm token. Commit(s): —
- [ ] **DIST-003** · release artifact attestations/checksums · deps: DIST-002 · Generate checksums/SBOM/provenance/notes and verify them in a clean consumer job; describe origin, not security certification. Commit(s): —
- [ ] **DIST-004** · macOS/Linux/Windows install matrix · deps: ENGINE-008, DIST-001 · Test Node versions and supported amd64/arm64 platforms, path/permission/cache behavior, system/offline engines, and no postinstall binary fetch. Commit(s): —
- [ ] **DIST-005** · upgrade/backward-compatibility matrix · deps: CONTRACT-012, DIST-004 · Test supported old CLI/report/token/config/record paths, database compatibility, deprecation warnings, and preserved local data. Commit(s): —
- [ ] **DIST-006** · rollback/revocation workflow · deps: DIST-002-005 · Document/test bad npm release, engine manifest, recipe feed, signing identity, and web deployment rollback/revocation without invalidating old records. Commit(s): —
- [ ] **DIST-WEB-001** · web CI quality workflow · deps: test harness, HOSTED/PLAN · Run typecheck, tests, migration checks, build, dependency/license/SBOM checks, and secret scan on protected changes. Commit(s): —
- [ ] **DIST-WEB-002** · production configuration validation · deps: DIST-WEB-001 · Fail deployment safely for missing/unsafe auth, DB, signing, encryption, billing, queue, object storage, cron, and public URL values; no secrets in logs. Commit(s): —
- [ ] **DIST-WEB-003** · deployment/rollback/health runbook · deps: OPS-013/014, DIST-WEB-001/002 · Define preview, migration ordering, health checks, smoke tests, rollback/forward-fix, ownership, and incident triggers. Commit(s): —

## Epic 18 — Integrated security, privacy, performance, load, migration, recovery, accessibility, and documentation qualification

Evidence/problem: compilation cannot qualify a release-security product. The integrated release candidate needs risk-based full-system evidence.

- [ ] **QUAL-CLI-001** · frozen detector/adapter determinism corpus · deps: all CLI data-plane epics · Repeat native/adapters/imports across frozen fixtures and platforms; record expected deltas only through reviewed fixture updates. Commit(s): —
- [ ] **QUAL-CLI-002** · ordinary-scan no-execution/no-upload proof · deps: LOCAL-003, telemetry controls · Instrument child processes/network/files and prove target code, install scripts, source, secrets, paths, and finding text do not leave. Commit(s): —
- [ ] **QUAL-CLI-003** · malformed/resource adversarial corpus · deps: TARGET/ENGINE/IMPORT/RECORD · Cover archives, manifests, symlinks, traversal, bombs, huge JSON, parser depth, process output, time, memory, disk, and cancellation. Commit(s): —
- [ ] **QUAL-CLI-004** · Hunt independent isolation evidence pack · deps: HUNT-011 · Produce repeatable attack fixtures/results for Docker boundary, network denial, process cleanup, secrets, and failure classification; independent review remains a gate. Commit(s): —
- [ ] **QUAL-CLI-005** · engine-exit and historical verification drill · deps: ENGINE-015, RECORD-008 · Remove/replace Trivy, replay/import alternate evidence, keep policy/viewer/records functional, mark reduced coverage incomplete, and verify old records. Commit(s): —
- [ ] **QUAL-CLI-006** · standard validation/cross-platform release test · deps: IMPORT exports, RECORD, DIST-004 · Validate SARIF/CycloneDX/SPDX/in-toto/Sigstore with official tools and install/upgrade/rollback on supported systems. Commit(s): —
- [ ] **QUAL-WEB-001** · full negative authorization suite · deps: HOSTED/PLAN/TEAM/STUDIO/ENT · Cover every resource/action/role, guessed IDs, list/search/export/cache/public/private boundaries, and modified CLI. Commit(s): —
- [ ] **QUAL-WEB-002** · SSRF/webhook/input security suite · deps: OPS-008 · Cover redirects, DNS rebinding, IPv4/IPv6/private/link-local/metadata, malformed payloads, signature replay, response caps, and egress failure. Commit(s): —
- [ ] **QUAL-WEB-003** · concurrency/idempotency/load suite · deps: OPS/PLAN · Test duplicate deliveries, quota races, billing/webhook replay, worker crashes, tenant fairness, alert dedup, and 10x forecast freshness SLO. Commit(s): —
- [ ] **QUAL-WEB-004** · migration/restore/disaster-recovery drill · deps: HOSTED-013, OPS-014/015, DIST-WEB-003 · Rehearse snapshot, migration, failure, restore, object reconciliation, rollback/forward-fix, RPO/RTO evidence, and no data loss. Commit(s): —
- [ ] **QUAL-WEB-005** · privacy/deletion/retention qualification · deps: OPS-011/012, Studio/Enterprise · Trace collection/consent/storage/export/delete/account-delete; customer-held signed records remain valid while hosted private data is removed. Commit(s): —
- [ ] **QUAL-WEB-006** · accessibility/performance qualification · deps: dashboards/viewer · Test keyboard, screen reader, landmarks, focus, contrast, reduced motion, responsive states, loading/errors, Core Web Vitals budgets, and large datasets. Commit(s): —

## Epic 19 — Post-release-candidate acceptance and GA truth lock

Evidence/problem: external validation is deliberately last. It validates the complete release candidate and claims; it cannot redefine unfinished functionality as shipped or expand frozen V1 scope.

- [ ] **ACCEPT-001** · freeze 10–20 repository/artifact corpus · deps: Gate 0–5 pass · Record exact commits/digests, licenses/notices, configuration, expected coverage, responsible-disclosure rules, and non-public vulnerable fixtures. Commit(s): —
- [ ] **ACCEPT-002** · automate 11 acceptance stories · deps: ACCEPT-001 · Run Free, CI, Trivy import, multi-tool dedup, mismatch/incomplete, exception, Hunt, offline record, modified CLI, Studio recipient, Enterprise runner, and account deletion stories. Commit(s): —
- [ ] **ACCEPT-003** · acceptance evidence bundle · deps: ACCEPT-002 · Store commands, configurations, versions, digests, results, failures, limitations, and reviewer sign-off in a reproducible internal package. Commit(s): —
- [ ] **ACCEPT-004** · external authorized workflow protocol · deps: ACCEPT-003 · Freeze recruitment/questions/consent/data handling/success criteria for qualified teams without scraping or bulk outreach. No external contact without authorization. Commit(s): —
- [ ] **ACCEPT-005** · run authorized external repository workflows · deps: ACCEPT-004 + founder authorization · Validate real release reconciliation without publishing findings; record product failures separately from requested scope. Commit(s): —
- [ ] **ACCEPT-006** · report comprehension test · deps: ACCEPT-003/005 · Developers/leads/recipients answer exact artifact, decision, change, remaining risk, authenticity, and limitations within the defined gate. Commit(s): —
- [ ] **ACCEPT-007** · Hunt adjudication study · deps: ACCEPT-001/003 · Evaluate at least 100 independently adjudicated findings with preregistered methodology; separate false confirmation, not reproduced, and environment failure. Commit(s): —
- [ ] **ACCEPT-008** · commercial acceptance/COGS evidence · deps: technical acceptance + founder authorization · Test actual plan agreements/checkout, repeat use, support minutes, hosted cost, recipient value, and explicit allowances; hypotheses remain hypotheses otherwise. Commit(s): —
- [ ] **ACCEPT-009** · truth registry/release-gate reconciliation · deps: ACCEPT-002-008 · Update shipped/partial/planned labels strictly from evidence, list failed gates and rollback/correction work, and make a documented go/no-go. Commit(s): —
- [ ] **ACCEPT-010** · GA release candidate freeze · deps: ACCEPT-009 + all critical gates · Freeze versions, schemas, migrations, manifests, plan catalog, compatibility, docs, runbooks, notices, SBOM, provenance, and rollback. Commit(s): —

## Epic 20 — Held final landing/marketing pass

HOLD: do not start these tasks until the founder explicitly says the product truth is frozen and authorizes the final web pass. No blog work is included.

- [ ] **FINAL-WEB-001** · capability-driven public copy map · deps: ACCEPT-009/010 + founder command · Map homepage/docs/pricing/meta claims to truth registry and server plan catalog; remove stale alpha language only for verified capabilities. Commit(s): —
- [ ] **FINAL-WEB-002** · homepage product promise/flow · deps: FINAL-WEB-001 · Update landing content to Inspect -> Decide -> Prove -> Monitor using real product evidence and no unsupported benchmarks/customers. Commit(s): —
- [ ] **FINAL-WEB-003** · plan/pricing presentation · deps: FINAL-WEB-001 · Render Free/Pro/Team/Studio/Enterprise from canonical catalog with exact allowances, status, billing terms, and explicit overages. Commit(s): —
- [ ] **FINAL-WEB-004** · public product/docs truth pass · deps: FINAL-WEB-001 · Align command docs, language coverage, engine attribution, signing limitations, Hunt assurance, and dashboard capabilities with shipped behavior. Commit(s): —
- [ ] **FINAL-WEB-005** · metadata/structured data/llms truth pass · deps: FINAL-WEB-001 · Update only factual metadata and machine-readable surfaces; no invented GEO/SEO claims. Commit(s): —
- [ ] **FINAL-WEB-006** · public proof assets · deps: ACCEPT-003/009 · Use sanitized real records/screenshots/flows with date, version, demo/real label, alt text, and no private evidence. Commit(s): —
- [ ] **FINAL-WEB-007** · landing accessibility/performance/responsive verification · deps: FINAL-WEB-002-006 · Test primary journey, mobile, keyboard, screen reader, contrast, reduced motion, metadata, crawlability, and real-user performance budgets. Commit(s): —
- [ ] **FINAL-WEB-008** · final public claim sweep and release smoke · deps: FINAL-WEB-001-007 · Search all public web surfaces for stale prices, plans, alpha shells, unsupported capabilities, and contradictory status; run production-like smoke without deploying. Commit(s): —

## Non-commit founder/external gates

- [ ] Confirm final plan hypotheses after evidence: Team $99 vs bounded founding cohort; Studio $249 vs bounded founding cohort.
- [ ] Select/approve queue and object-storage provider only after the Phase 0 cost/constraint decision.
- [ ] Obtain legal review for premium content license, contributor terms, trademarks, privacy, terms, and enterprise obligations.
- [ ] Approve any external engine/fixture redistribution with unresolved license or NOTICE status.
- [ ] Approve networked Hunt recipe exceptions individually; default remains no network.
- [ ] Arrange independent Hunt isolation/security review.
- [ ] Supply authorized customer fixtures/repositories and consent for external acceptance.
- [ ] Authorize external conversations, paid pilots, checkout tests, campaign, publish, deploy, npm release, tags, pushes, and production migrations separately.
- [ ] Do not claim Team/Studio/Enterprise generally available until their end-to-end gates pass.

## First ten dependency-ready tasks

1. `TRUTH-001` — current CLI capability inventory.
2. `TRUTH-002` — current hosted capability inventory.
3. `TRUTH-003` — evidence-linked truth registry.
4. `TRUTH-004` — plan/capability contradiction map.
5. `TRUTH-005` — open-core/commercial/content/brand boundary.
6. `TRUTH-006` — license/NOTICE inventory.
7. `TRUTH-007` — telemetry/privacy boundary inventory.
8. `TRUTH-008` — cost/usage ledger design.
9. `TRUTH-009` — schema/data migration inventory.
10. `TRUTH-010` — command compatibility inventory.

The first implementation task after the founder's command is `TRUTH-001`. It is the correct start because every later schema, plan, migration, public claim, and compatibility decision depends on knowing precisely what is already shipped and must be retained.
