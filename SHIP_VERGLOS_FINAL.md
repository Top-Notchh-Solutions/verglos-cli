# Ship Final Verglos — Codex Execution Contract

Use this file as the entry point for a long-running, multi-repository implementation program.

## Prompt to Codex

You are responsible for taking Verglos from its current shipped state to the complete V1 defined by the canonical product blueprint. First create a traceable, dependency-ordered implementation backlog; then begin executing the first safe, unblocked task. Do not stop after producing a plan.

This is expected to require many reviewable commits and multiple sessions. The estimated 100–300 commits is context, not a target: do not manufacture commit count, combine unrelated changes, or trade correctness for speed.

## 1. Read before planning or editing

Read these sources completely, in this order:

1. Every document under `../brain/`. These documents define product philosophy and override implementation assumptions.
2. `AGENTS.md` in this repository and the applicable nested instructions for every file you touch.
3. `../verglos-web/AGENTS.md` before inspecting or changing the web repository.
4. `docs/VERGLOS_PRODUCT_ARCHITECTURE_BLUEPRINT.md`. This is the canonical final-product specification.
5. `docs/VERGLOS_COMPANY_USAGE_AND_FEATURE_MAP.md`. This maps target capabilities to users, workflows, plans, rationale, and end-to-end acceptance stories.
6. `README.md`. This and the code define current CLI truth.
7. `../verglos-web/README.md` and `../verglos-web/src/lib/entitlement/capabilities.ts`. These and the code define current hosted/entitlement truth.
8. `../VERGLOS_2_0_0_SHIP_PLAN.md`. Treat it as historical planning input where it conflicts with newer truth.
9. `packages/hunt/README.md` and `packages/attest/README.md`.
10. `docs/VERGLOS_FINAL_VISUAL_SYSTEM.pdf` only as the executive visualization. It does not override the Markdown blueprint or code truth.
11. `docs/shipping/VERGLOS_TRUTH_REGISTRY.md` for shipped/partial/planned/hypothesis labels.
12. `docs/shipping/VERGLOS_COMMAND_AND_UI_CONTRACT.md` for the command surface, local viewer, dashboard IA, and UX states.
13. `docs/shipping/VERGLOS_AGENT_AND_MCP_CONTRACT.md` for agent authority, Hunt isolation, and approval rules.
14. `docs/shipping/VERGLOS_FINAL_ACCEPTANCE_AND_POC.md` for the post-build repository/artifact acceptance program.

Do not begin implementation until this reading and a codebase inventory are complete.

## 2. Truth precedence

When sources disagree, apply this order:

1. `/brain` philosophy and explicit founder decisions;
2. verified current code, tests, schema, billing behavior, and deployment configuration for what exists today;
3. `docs/VERGLOS_PRODUCT_ARCHITECTURE_BLUEPRINT.md` for the desired V1 destination;
4. current README and capability registry for public shipped/partial/planned labels;
5. older ship plans and visual summaries.

Do not silently resolve a material contradiction. Record it in the decision log with evidence and choose the narrowest reversible implementation consistent with the hierarchy.

## 3. Founder sequencing decision

Build the complete V1 before the final-product campaign, public comparative benchmark, or paid pilot program.

This does **not** postpone engineering verification. Unit, integration, contract, fixture, migration, adversarial, cross-platform, isolation, tenancy, recovery, billing, and load tests are part of implementation and must run continuously.

The sequence is:

```text
read and inventory
  -> freeze V1 implementation contract
  -> create dependency-ordered backlog
  -> build and internally verify vertical slices
  -> integrate a feature-complete release candidate
  -> complete security/reliability qualification
  -> external benchmark and acceptance
  -> correct failures without scope expansion
  -> general availability and campaign
```

Do not publicly describe planned capabilities as shipped while building.

## 4. Product contract that must survive implementation

- One signed npm front door: `npm install verglos` / `npx verglos`.
- One versioned evidence model and independently usable verifier across all plans.
- Customer-controlled compute for ordinary inspection, policy, report generation, signing, and supported local Hunt.
- Native source analysis is JavaScript/TypeScript. Other languages receive clearly labeled adapter or imported-evidence coverage; never call that native polyglot SAST.
- Trivy is an attributed, pinned, verified external engine—not renamed Verglos technology and not an opaque `postinstall` download.
- Trivy is a replaceable sensor, not a domain dependency. Trivy structs and presentation text must never enter policy, billing, dashboard or Release Record contracts; use a versioned adapter and canonical Verglos observations.
- Preserve raw engine output plus binary, database/check-bundle, configuration and capability digests. Engine absence, staleness or incompatibility produces explicit `incomplete` coverage—never an empty successful scan.
- Verglos-native and Trivy secret detection remain the default. V1 must import/export compatible `detect-secrets` baseline evidence and may invoke an explicitly configured local `detect-secrets` installation, but the npm package must not silently install Python or require `detect-secrets`.
- The product loop is Inspect -> Decide -> Prove -> Monitor.
- The `.vgl` Release Record is canonical structured evidence. HTML/PDF/local views are presentations of it.
- A signature establishes identity and integrity, not security perfection or trademark ownership.
- Free stays useful forever without signup, source upload, or local scan metering.
- Pro includes supported local Hunt and guided signing; basic record creation and verification are not Studio-exclusive.
- Hosted seats, applications, records, retention, public traffic, managed execution, client workspaces, and private runners are bounded and enforced server-side.
- The current CLI is Apache-2.0. Assume users may legally inspect, modify, fork and redistribute compliant copies, including removing local entitlement checks. Never design paid-plan viability or a security boundary around hidden or client-only gating.
- Preserve an explicit open-core boundary: Apache CLI/evidence/verifier; commercial hosted operations and collaboration; separately licensed maintained rule/recipe content; separately protected Verglos brand and official signing identities.
- Every redistributed third-party component needs verified licence classification, applicable `LICENSE`/`NOTICE` retention, modification notices, engine attribution and trademark-safe language. Generate a dependency SBOM and `THIRD_PARTY_NOTICES` before GA.
- Prefer a modular monolith plus durable workers. Do not create speculative microservices.
- Do not build a CNAPP, production DAST platform, runtime/endpoint security product, general autonomous pentester, or proprietary vulnerability database as part of V1.

## 5. Plan contract

Treat the following as configurable V1 launch defaults in one server-side plan catalog, not constants duplicated through the CLI and web app:

| Plan | Price | Included people | Hosted allowance |
|---|---:|---:|---|
| Free | $0 forever | Individual local use; no account required | No hosted storage required; local viewer and verifier |
| Pro | $29/month or $290/year | 2 seats | 5 monitored applications, 100 hosted records/month, 90-day history |
| Team | $99/month or $990/year | 5 seats | 25 monitored applications, 500 hosted records/month, 12-month history |
| Studio | $249/month or $2,490/year | 10 seats | 20 client workspaces, 100 monitored applications, 2,000 hosted records/month, 3-year history |
| Enterprise | Contract; $12k–$30k ARR entry hypothesis | Contracted | Contracted runners, regions, retention, traffic, governance, and support |

At 80% of a hosted allowance, warn. At 100%, preserve existing records and all local operation; require an explicit upgrade or overage for additional hosted ingestion. Never create surprise charges.

Current public truth remains authoritative until each target capability ships. In particular, current Pro history is 30 days until the 90-day implementation and migration pass their gates.

## 6. Create the execution control files

Create and maintain these files under `docs/shipping/`:

- `VERGLOS_V1_BACKLOG.md` — dependency-ordered epics and atomic tasks.
- `STATUS.md` — current phase, active task, last verified commit, test status, blockers, and next task.
- `TRACEABILITY.md` — blueprint capability -> task IDs -> code -> tests -> documentation.
- `DECISIONS.md` — dated architectural/product decisions and evidence.
- `RISKS.md` — security, privacy, correctness, cost, migration, licensing, and operational risks with owners and mitigations.
- `RELEASE_GATES.md` — objective internal release-candidate and external GA checks.

The product/UX/agent/acceptance contracts that these control files track are:

- `VERGLOS_TRUTH_REGISTRY.md`
- `VERGLOS_COMMAND_AND_UI_CONTRACT.md`
- `VERGLOS_AGENT_AND_MCP_CONTRACT.md`
- `VERGLOS_FINAL_ACCEPTANCE_AND_POC.md`

Every backlog task must include:

- stable task ID and parent epic;
- target repository and likely modules;
- dependency IDs;
- current evidence/problem;
- expected behavior and explicit non-goals;
- acceptance criteria;
- required tests and threat cases;
- schema/migration/API/documentation impact;
- plan/entitlement impact;
- status: `not-started`, `ready`, `in-progress`, `blocked`, `verified`, or `shipped`;
- implementing commit IDs after completion.

Tasks should normally fit in one to three atomic commits. Split work by deployable behavior, not by arbitrary file counts.

## 7. Backlog structure

At minimum, decompose and dependency-order these epics:

1. Truth registry, plan catalog, open-core/commercial boundary, copyright/contributor ownership, third-party licence inventory, cost ledger, telemetry boundaries, and migration inventory.
2. Versioned subject, observation, policy-decision, verification, and Release Record contracts.
3. Target resolution for repositories, build configuration, SBOMs, generic artifacts, and OCI images/indexes.
4. Versioned engine-adapter contract, verified engine manager, Trivy adapter, raw-evidence retention, customer mirrors/air-gap mode, compatibility fixtures, rollback, and engine-exit drill.
5. SARIF, CycloneDX, SPDX, VEX, provenance, `detect-secrets` baseline compatibility, and external-evidence import/export.
6. Normalization, deduplication, stable fingerprints, source-to-artifact lineage, and release diff.
7. Policy evaluation, baselines, exceptions, expiry, CI pass/review/block/incomplete behavior.
8. Packaged local viewer and developer/lead/client projections.
9. MCP/AI-tool guardrails using the same scanner/policy contracts and user authority; safe Hunt recipe model, local sandboxing, structured verdicts, redaction, and failure taxonomy.
10. `.vgl` assembly, in-toto predicate, Sigstore signing, offline verification, and public redaction.
11. Hosted tenant/project/subject/inventory data model and migrations.
12. Queue, workers, idempotency, cache, outbox, scheduler, monitoring, alerts, retention, and recovery.
13. Authentication, authorization, server-side entitlements, usage accounting, billing, quotas, and overage behavior.
14. Pro dashboard and current-customer migration.
15. Team workspaces, shared policy, approvals, organization records, CI integrations, Jira/Linear.
16. Studio client workspaces, branding, public verification, custom domains, receipts, and portfolio view.
17. Enterprise contract surfaces: SSO/SCIM, audit, KMS/HSM, private runner/verifier, residency, exports, SLA hooks.
18. Cross-platform packaging, trusted publishing, npm provenance, dependency SBOM, `THIRD_PARTY_NOTICES`, licence/NOTICE validation, update path, rollback, and release automation.
19. End-to-end security, privacy, performance, load, migration, disaster-recovery, accessibility, and documentation qualification.
20. Post-release-candidate benchmark and acceptance program defined in the blueprint.

For each epic, identify what already exists and should be retained, repaired, migrated, replaced, or deleted. Do not rewrite functioning code merely to match a new naming preference.

## 8. Execution rules

- Work from dependencies and risk, not from the most visible UI.
- Start with schemas, trust boundaries, compatibility, and migration strategy before broad feature implementation.
- Preserve user changes and unrelated dirty-worktree content.
- Never use destructive git commands or rewrite published history.
- Do not push, deploy, publish npm packages, change production data, contact leads, purchase infrastructure, or modify external systems without separate explicit authorization.
- You may edit and create local commits in `verglos-cli` and `verglos-web` for this shipping program.
- Keep commits repository-local; never pretend one commit spans two independent Git repositories.
- Each commit must be narrowly reviewable, pass the relevant tests, and update execution control files when status or traceability changes.
- Use explicit schema migrations. Prove backward compatibility or document and test the migration path.
- Never weaken a security boundary to make a test pass.
- Never mark a task verified from compilation alone when behavior, isolation, billing, migration, or tenant boundaries are involved.
- Do not add hidden hosted computation to an “unlimited local” feature.
- Do not expose source, secrets, paths, private findings, signing material, or customer identifiers through telemetry, logs, public verification, or support tooling.

Recommended commit subjects:

```text
docs(ship): inventory current capability and gaps
feat(evidence): add versioned subject contract
feat(engine): verify pinned trivy installation
test(hunt): reject network-enabled unsigned recipe
fix(tenant): enforce project ownership on record lookup
```

## 9. Verification expectations

Use the blueprint's shipment gates as minimum requirements. The final release candidate must additionally demonstrate:

- clean installation and upgrade on supported macOS, Linux, and Windows architectures;
- deterministic and stable results on frozen fixtures;
- official validation of standard output formats;
- fail-closed signature and engine verification;
- engine failure/staleness is recorded as incomplete coverage and cannot yield a false PASS;
- policy, records, viewer, dashboard and monitoring pass an engine-exit test using fixture/alternate or imported standard evidence without Trivy-specific domain fields;
- existing signed records remain independently verifiable after a supported engine is removed or upgraded;
- no target-code execution during ordinary scanning;
- Hunt isolation and failure classification reviewed independently;
- negative authorization coverage for every tenant resource;
- SSRF, webhook, path traversal, archive bomb, symlink, malformed input, and resource-exhaustion defenses;
- idempotent jobs, safe retry, dead-letter replay, restore drill, and rollback path;
- real server-side quota and entitlement enforcement under concurrency;
- paid hosted value and authorization remain intact when tested against a modified/untrusted CLI;
- complete dependency-licence inventory, generated SBOM, `THIRD_PARTY_NOTICES`, upstream attribution, modification notices, and trademark review;
- documented licences and provenance for separately delivered premium policies and Hunt recipes;
- contributor ownership/CLA-or-DCO policy suitable for the chosen open-core model before accepting material outside contributions;
- truthful plan copy generated from the canonical capability/plan source;
- measured hosted cost per plan and no unbounded managed execution;
- accessible local and hosted views;
- updated threat model, operations runbooks, privacy documentation, and incident procedures.

## 10. First response and immediate action

In the first response:

1. Summarize the verified current architecture and the largest contradictions against the target.
2. Report dirty-worktree risks without deleting or reverting anything.
3. Create the six execution control files.
4. Show epic ordering, critical path, and the first ten ready tasks.
5. Identify the first implementation task and why it is the correct dependency/risk starting point.
6. Begin that task in the same turn, verify it proportionately, and create the first atomic commit if the repository state permits a safe commit.

The external POC and Reddit/campaign validation are deliberately last. Build the complete V1, qualify it against the release gates, and only then execute the acceptance program in `VERGLOS_FINAL_ACCEPTANCE_AND_POC.md`.

Do not respond only with a proposal to make a proposal. Continue implementing while safe, in-scope work remains.

## 11. Resume protocol for later Codex sessions

Use this message:

> Read `SHIP_VERGLOS_FINAL.md`, then read every required source it names. Resume from `docs/shipping/STATUS.md`. Verify the recorded commit and working tree before changing anything. Continue the next dependency-ready task, run its required tests, update backlog/traceability/status, and make atomic local commits. Do not push or deploy.

Before implementing a user-facing command, dashboard, or agent capability, also read the applicable contract in `docs/shipping/` and update its traceability row and acceptance criteria in the same change.

If the status file is stale or contradicts Git/code, trust verified repository evidence, repair the status file, and record the discrepancy in `DECISIONS.md` or `RISKS.md` as appropriate.
