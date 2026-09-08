# Verglos V1 dependency-ordered backlog

Status values: `not-started`, `ready`, `in-progress`, `verified`, `shipped`, `blocked`.

## Critical path epics

1. **TRUTH / commercial boundary** — inventory current code, capability registry, plan catalog, licenses, third-party notices, telemetry, costs, migrations. `TRUTH-001` is first and ready.
2. **CONTRACTS** — version subject, observation, policy decision, verification, Release Record, compatibility and error schemas.
3. **TARGET** — resolve commit/tree, package, SBOM, artifact, OCI image/index/digest and build metadata.
4. **ENGINES** — versioned EngineAdapter, verified pinned Trivy, mirrors/air-gap, exit drill, raw evidence retention.
5. **IMPORTS** — SARIF, CycloneDX, SPDX, VEX, provenance, detect-secrets baseline, adapter fixtures.
6. **GRAPH** — normalization, stable fingerprints, deduplication, source-to-artifact lineage, release diff.
7. **POLICY** — baselines, exceptions/expiry, freshness, PASS/REVIEW/BLOCK/INCOMPLETE, CI behavior.
8. **LOCAL PRODUCT** — local viewer, report projections, exports, command UX and cross-platform packaging.
9. **AGENTS / HUNT** — shared MCP contracts, pre-write guardrails, signed recipes, isolation, verdicts, redaction.
10. **PROVE** — `.vgl`, in-toto predicate, Sigstore/guided signing, offline verifier, public redaction.
11. **HOSTED DATA** — tenant/project/subject/inventory schema, migrations, retention, indexes.
12. **OPERATIONS** — queues, idempotent workers, monitoring, alerts, outbox, retries, dead letters, recovery.
13. **ENTITLEMENT / BILLING** — server-side catalog, seats, quotas, usage, overages, modified-CLI tests, payment migration.
14. **PRO DASHBOARD** — release home, applications, findings, monitoring, alerts, policy, migration.
15. **TEAM** — shared policies, RBAC, approvals, organization records, CI/Jira/Linear.
16. **STUDIO** — client workspaces, branding, public verify, handoff receipt, portfolio.
17. **ENTERPRISE** — SSO/SCIM, audit, KMS/HSM, private runner/verifier, residency, support hooks.
18. **DISTRIBUTION** — trusted npm publishing, provenance, SBOM, notices, license validation, rollback.
19. **QUALIFICATION** — threat, isolation, tenancy, load, accessibility, migration, disaster recovery, docs.
20. **POST-RC ACCEPTANCE** — frozen corpus, authorized POC, acceptance evidence, truth update, campaign gate.

## First ten ready tasks

| ID | Dependency | Deliverable | Acceptance |
|---|---|---|---|
| TRUTH-001 | none | Current CLI/web capability inventory | Every claim links to code/test/evidence |
| TRUTH-002 | TRUTH-001 | Canonical shipped/partial/planned registry | Web/docs labels generated or mapped |
| COMM-001 | TRUTH-001 | Plan catalog and open-core boundary | One server-side catalog; no duplicated constants |
| LIC-001 | TRUTH-001 | Dependency/license/NOTICE inventory | Apache/third-party/premium content classes recorded |
| CONTRACT-001 | TRUTH-001 | Subject and observation schema | Versioned fixtures validate and reject malformed identity |
| CONTRACT-002 | CONTRACT-001 | Policy decision/error schema | PASS/REVIEW/BLOCK/INCOMPLETE semantics tested |
| TARGET-001 | CONTRACT-001 | Deterministic target resolver | Commit/artifact/image identity and mismatch tests pass |
| IMPORT-001 | CONTRACT-001 | SARIF importer | Source attribution and malformed-input tests pass |
| IMPORT-002 | CONTRACT-001 | SBOM/VEX/provenance importer | CycloneDX/SPDX/VEX fixtures preserve digests |
| GRAPH-001 | CONTRACT-002, IMPORT-001 | Canonical fingerprint/correlation | Duplicate multi-tool fixture becomes one observation |

## Task requirements

Every implementation task must record repository/modules, dependencies, current evidence, non-goals, acceptance tests, security cases, schema/API/docs impact, plan impact, status, and commit IDs. A task is not verified by compilation alone.

## Session rule

Codex resumes from `STATUS.md`, verifies the working tree and last commit, executes the next dependency-ready task, updates traceability/decisions/risks, and makes one reviewable local commit.
