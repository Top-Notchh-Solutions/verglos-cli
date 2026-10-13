
# Verglos V1 Final Execution Goal — Paying Product to Point-5 Qualification

**Owner:** Top Notchh Solutions  
**Date:** 2026-10-13  
**Status:** replacement active goal for execution  
**Backlog authority:** VERGLOS_V1_BACKLOG.md  
**Contract authority:** FINAL_V1_PRODUCT_CONTRACT_APPROVAL_DRAFT_2026-10-12.md  
**Value authority:** FINAL_V1_PAYING_VALUE_BLUEPRINT_2026-10-13.md  
**Coverage authority:** FINAL_V1_FEATURE_COVERAGE_MATRIX_2026-10-13.md

## 0.1 Current shipping checkpoint — 2026-10-13

PR #117 merged normally as `cd59d5633088934d01b6087966b6795a840ac21d` after
self-scan, in-toto, and all nine Ubuntu/macOS/Windows Node 20/22/24 checks
passed. It preserves source commits
`19b4ece56aaaa2fe21bde6bf6619eee2b3b8dead` and
`ca2cffdbe696da939d6e2ba3d6b85070d46001d0` and extends the public Hunt proof
path to fixed positive/negative cases of the registered A2 first-party target
harness through the same signed execution binding. The direct public
`verglos hunt proof` A2 test passed.

This contribution advances HUNT-008/HUNT-009 implementation only; their
counted rows remain open until every row-specific acceptance criterion passes.
The A2 result is bounded reference-harness evidence, not independent review,
customer-target proof, or an approved remediation retest. Trusted/licensed
provenance, hosted entitlement/provider confirmation, required isolation
qualification, remediation/retest, `.vgl` binding, and final release
acceptance remain open. HUNT-010/011 are unchanged. Score remains **228
checked / 52 unchecked / 280 total (81.4%)**. Evidence:
`evidence/hunt-a2-proof-controls-pr117-2026-10-13.md`.

## 0.2 Prior shipping checkpoint — 2026-10-13

PR #116 merged normally as `870ffb52421abb3bf045ad224043cdc5e2605975` after
self-scan, in-toto, and all nine Ubuntu/macOS/Windows Node 20/22/24 checks
passed. It preserves source commits
`77693919bf8c44a9a35f2ff2cd8dcfa05fa11cc6` and
`6a88e715a320819088e890d9ed1a0dc6e8f015ab` and adds bounded A1
Proof/Counterexample replay plus the public `verglos hunt proof` command.
The primary and fixed safe negative control use the same signed binding;
container-backed proof is explicitly `not-attemptable`.

This contribution advances HUNT-008/HUNT-009 implementation only; their
counted rows remain open until every row-specific acceptance criterion passes.
The A1 result is synthetic, not target-code proof or an OS/security boundary;
remediation/retest, `.vgl` Record binding, trusted/licensed provenance,
hosted entitlement, independent adjudication, and final release acceptance
remain open. HUNT-010/011 are unchanged. Score remains **228 checked / 52
unchecked / 280 total (81.4%)**. Evidence:
`evidence/hunt-proof-counterexample-pr116-2026-10-13.md`.

PR #115 merged normally as `e726dacce46fda46024f38e0c68005dcadcd5eb5` after
self-scan, in-toto, and all nine Ubuntu/macOS/Windows Node 20/22/24 checks
passed. It preserves source commits
`c24f3555c7533139cf2a050aa38760fa30d961b4` and
`8ac34aa7baf9d0376731612de98339e296759826` and adds the bounded worker over
the PR #114 Attack-Hypothesis output. The worker verifies canonical hypothesis
integrity, exact finding/subject/rule/playbook identity, signed trust,
entitlement, approval, observation, and bounded adapter selection; the CLI
exposes `verglos hunt worker <hypothesisPath>` with privacy-limited structured
output.

This contribution advances HUNT-008/HUNT-009 implementation only; their
counted rows remain open until every row-specific acceptance criterion passes.
The worker result is candidate-only: independent proof/counterexample,
remediation/retest, trusted/licensed provenance, hosted entitlement, required
isolation, independent review, and final release acceptance remain open. Score
remains **228 checked / 52 unchecked / 280 total (81.4%)**. Evidence:
`evidence/hunt-attack-worker-pr115-2026-10-13.md`.

## 1. Objective

Finish the approved Verglos Final V1 product implementation and qualification
up to the Point-5 boundary:

1. freeze the product and commercial contract;
2. implement the promised customer value across the CLI, scanner, Hunt, MCP,
   Attest, Web, SCM, plans, billing, Studio, Enterprise, and release surfaces;
3. qualify the packed npm product on authorized public and TopNotchh-owned
   TypeScript/JavaScript repositories;
4. reconcile every eligible backlog checkbox from complete evidence; and
5. stop after the complete Point-5 evidence bundle.

This goal is execution-led. Documentation is updated only when it records a
real implementation, decision, limitation, evidence result, or required
traceability correction. A document, deployment, browser click, green fixture,
or owner permission alone never closes a backlog row.

## 2. Product promise

Verglos is a local-first, not local-only, security decision layer between a
code change and a release:

    Inspect -> Understand -> Prove -> Fix -> Retest -> Approve or block -> Remember

The customer must be able to see what was checked, understand the finding,
safely verify supported risk against an authorized target, apply or approve a
fix, retest the same behavior, and carry a signed release decision into CLI,
MCP, Web, SCM, and audit workflows.

The product is for TypeScript and JavaScript in V1. Other languages may be
imported as evidence only where implemented; native support must not be
claimed before it is built and qualified.

## 3. Required customer value by plan

All plans use the same public npm/CLI front door.

### Free

Free delivers useful work locally:

- ten-domain TS/JS coverage manifest where engines support it;
- native scanner findings, dependency/lockfile checks, secret checks, local
  provenance, and local Trivy/image/artifact evidence;
- JSON/HTML and CI/pre-commit output;
- safe MCP inspect, explain, package, and before-write tools;
- starter bounded Hunt against the developer's own test target;
- local evidence and offline .vgl verification;
- explicit unsupported, stale, failed, and incomplete states.

Free has no required account, hosted history, shared organization, managed
runner, hosted model allowance, or client handoff.

### Pro

Pro delivers the complete supported local code-to-proof loop:

- everything in Free;
- Scout target map, bounded attack hypothesis, approved playbook, worker,
  proof, negative control, limitation, remediation guidance, and retest;
- all qualified local/private TS/JS Hunt families;
- full MCP Hunt path under the same authority controls;
- signed local/private .vgl Release Records;
- personal hosted history and declared monitoring allowances;
- Cards-only prepaid fixed term with manual renewal.

### Team

Team turns personal results into shared release control:

- Verglos organization, members, roles, projects, policies, baselines,
  exceptions, approvals, and audit events;
- shared records and findings history;
- GitHub/GitLab installation, immutable organization/repository binding,
  source-free PR checks, webhook replay/retry/removal/recovery;
- authorized private runner for shared targets where configured.

### Studio

Studio adds safe multi-client delivery:

- isolated client workspaces and tenant separation;
- multi-client Hunt campaigns with target, scope, time, and cost controls;
- redacted evidence projections and custody approval;
- client reports, public verification of permitted fields, white-label views,
  campaign comparison, retest history, export, deletion, and handoff receipts.

### Enterprise

Enterprise adds governed private operations:

- private runners and registry/image workflows;
- customer trust roots and KMS/HSM options;
- SSO/SCIM, organization-wide agent policies, least privilege, audit export;
- retention, residency, legal hold, deletion, and recovery;
- custom authorized target adapters/playbooks, capacity, support, and SLA.

The launch catalog remains a hypothesis: Free $0, Pro $29/month, Team
$99/month, Studio $249/month, Enterprise custom. Paid terms are prepaid and
manual-renewal in V1. Local work is not metered like hosted work. Hosted
storage, model calls, public verification, retention, managed runners, and
campaigns require explicit allowances or contracted terms.

## 4. Full feature scope that must not be missed

The implementation queue covers all of these surfaces together:

1. local CLI/npm/package boundary;
2. native TypeScript/JavaScript SAST across ten customer domains;
3. dependency graph, SCA, advisory correlation, reachability where supported;
4. secrets detection, redaction, and validity/rotation guidance;
5. supply-chain posture, repository/build signals, and provenance;
6. SBOM, SARIF, SPDX, CycloneDX, VEX, and external evidence imports;
7. Trivy image/artifact/misconfiguration/secret/license evidence;
8. IaC and secure-configuration checks where supported;
9. scanner-to-Hunt mapping and real authorized target discovery;
10. five controlled Hunt responsibilities: Scout/Context,
    Attack-Hypothesis, Attack Worker Fleet, Proof/Counterexample, and Release
    Auditor;
11. ten Hunt families: injection; command/code execution; path/file boundary;
    SSRF; authentication/authorization/IDOR/tenancy; XSS/template sinks;
    prototype pollution/deserialization/parsers; secret/credential use;
    dependency/supply-chain/malicious package behavior; and AI-agent/MCP
    boundary/approval bypass;
12. bounded execution with network, process, filesystem, device, namespace,
    resource, timeout, output, and cleanup controls;
13. positive, negative, timeout, infrastructure-failure, and unsupported
    outcomes for every supported family;
14. remediation proposal, approval-bound patch path, and same-proof retest;
15. MCP inspect, explain, before-write, Hunt, and record tools with per-tool
    authorization and explicit user approval;
16. signed portable .vgl Release Records and offline verification;
17. Web account, history, monitoring, alerts, privacy, deletion, retention,
    export, accessibility, performance, and failure states;
18. Verglos organizations, roles, policy, baselines, exceptions, approvals,
    audit, and tenant isolation;
19. GitHub/GitLab installation, immutable binding, PR checks, webhook
    authentication, replay/retry/removal/recovery;
20. Studio client workspaces, redaction, custody, handoff, and verification;
21. Enterprise private runners, identity, trust roots, KMS/HSM, residency,
    retention, audit export, and custom adapters;
22. server-owned plan catalog, Cards-only prepaid payment, signed provider
    reconciliation, refund, expiry, manual renewal, and entitlements;
23. public-safe npm distribution, SBOM/checksums/provenance, protected publish,
    rollback, and revocation; and
24. final acceptance, comprehension, cost/COGS, performance, privacy, and
    authorized public TypeScript/JavaScript repository qualification.

## 5. One evidence graph

All surfaces must use one stable evidence chain:

    source/artifact subject
      -> coverage manifest
      -> native/SCA/secrets/provenance/Trivy/import engine run
      -> normalized finding or observation
      -> target capability and rule-to-playbook mapping
      -> entitlement + exact approval
      -> Scout target manifest
      -> bounded attack hypothesis and worker
      -> proof + counterexample + limitation
      -> remediation + approved retest
      -> signed .vgl Release Record
      -> CLI / MCP / Web / SCM / policy decision

No AI model may invent a recipe, severity, approval, source upload, shell
command, signing action, payment state, or release decision. Unsupported or
unavailable behavior must be explicit and fail closed.

## 6. Hunt implementation contract

The current eight A1 deterministic probes and ten A2 target-harness
descriptors are safety/regression foundations. They are not yet ten complete
autonomous attacking agents or proof of complete customer-code coverage.

The Hunt implementation must:

- start from a scanner/SCA/secrets/provenance/Trivy finding or an explicitly
  scoped authorized route;
- build a target manifest without silently widening scope or uploading source;
- select only an approved, versioned, provenance-bound playbook;
- execute only declared adapters and commands inside the bounded runtime;
- run positive proof and a safe negative control;
- classify confirmed, not reproduced, inconclusive, unsupported, timeout, and
  environment failure separately;
- produce remediation guidance and repeat the same proof after an approved fix;
- attach Hunt evidence to the original finding and subject identity;
- enforce plan entitlement, policy, approval, and audit at every surface; and
- expose the same result through public CLI and MCP, then Web/SCM projections.

Every recipe must declare source/version, license/provenance, target type, input
schema, fixture set, network policy, process/filesystem/resource limits,
redaction, cleanup, proof method, counterexample, remediation hint, retest
method, and plan entitlement.

## 7. Execution order

### Phase 1 — Contract and traceability

Read and synchronize:

- product contract;
- paying-value blueprint;
- feature coverage matrix;
- company feature map and architecture blueprint;
- backlog;
- execution ledger;
- traceability;
- decisions;
- risks;
- status;
- release gates;
- founder deliverable/blocker guides;
- CLI/Web/MCP plan registries and public-safe copy.

Historical evidence packets remain immutable. New evidence receives a new
dated packet and exact commit/deployment identity.

### Phase 2 — Scanner, engines, and records

Implement and qualify the trustworthy finding substrate:

- ten-domain coverage manifest and honest skips;
- native TS/JS scanner rules and stable finding identity;
- dependency/SCA graph and advisory correlation;
- secret redaction and validity boundaries;
- provenance, SBOM, SARIF, SPDX, CycloneDX, VEX, and import validation;
- pinned, verified Trivy adapter with digest binding;
- stale/missing/incompatible engine handling;
- policy, baseline, exception, approval, and release decision semantics;
- signed .vgl creation, verification, tamper rejection, and offline use.

A missing or unverifiable engine result is incomplete, never clean.

### Phase 3 — Hunt and MCP

Implement scanner-to-Hunt mappings, target adapters, bounded workers,
proof/counterexample, remediation/retest, and all-family MCP parity.

Run Docker/Linux adversarial qualification where required. Record network,
socket, device, namespace, symlink, fork/resource, signal, cleanup, secret,
output, timeout, and failure behavior. Do not call a self-review independent.
Do not mark external review, legal, provider, or customer gates from generated
text.

### Phase 4 — Web, plans, billing, organizations, and SCM

Implement and qualify:

- server-owned plan catalog and entitlement checks;
- Cards-only prepaid order/capture/refund/expiry/manual-renewal lifecycle;
- signed webhook authentication, replay/idempotency, ledger, and no-grant
  failure behavior;
- Web history, monitoring, privacy, deletion, retention, export, accessibility,
  performance, and tenant boundaries;
- Verglos organization policy, roles, baselines, approvals, audit;
- GitHub/GitLab installation, immutable identities, PR checks, webhook retries,
  replay protection, uninstall, and recovery;
- Studio redacted handoff and client isolation;
- Enterprise private runner protocol, identity, replay, redaction, retention,
  and audit export.

Use isolated Preview/Test Mode or Docker for test writes. Production is not a
test database. Production work is limited to authorized code rollout and
read-only/safe smoke checks unless a separately documented production action is
required and reversible.

### Phase 5 — Distribution and Point-5 qualification

Qualify the packed npm artifact, not only the source tree:

- exact package boundary and public/private audit;
- clean consumer install and CLI execution;
- supported OS/Node matrix;
- upgrade/rollback and package provenance;
- scanner and all available engine paths;
- MCP path;
- Hunt path and limitations;
- records and offline verification;
- Free/Pro/Team/Studio/Enterprise capability behavior;
- no-source-upload and egress audit;
- accessibility, performance, privacy, failure, and report comprehension;
- public TypeScript/JavaScript repositories and TopNotchh-owned forks with
  exact URL, commit, license, scope, configuration, and private retention;
- clean, vulnerable, dependency, secret, container/artifact, MCP, API,
  multi-user, multi-tenant, and enterprise-shaped corpus cases.

Do not use customer source without exact authorization. Public open-source code
may be cloned under its license; record the exact commit and scope privately.

## 8. Backlog operating loop

For each next dependency-ready row:

1. Read the row, its dependencies, evidence references, and acceptance text.
2. Inspect the current code and exact branch/commit.
3. Implement the smallest complete slice; do not create placeholder checkboxes.
4. Run focused tests, package/build/typecheck, security/boundary checks, and
   relevant hosted or Docker qualification.
5. Write private evidence containing command, version, exact commit, output
   hash/result, limitations, privacy boundary, and acceptance mapping.
6. Update the appropriate ledger, status, traceability, decision, or risk entry.
7. Recompute the score from the live backlog checklist.
8. Check the row only when every acceptance condition is met.
9. Commit substantive work in logical commits, push a reviewable branch/PR,
   preserve commit history, merge with a regular merge commit, and verify the
   merged head. Do not squash or fabricate empty contribution commits.
10. Reconcile the next row only after the current one is genuinely complete or
    explicitly parked with owner, missing artifact, safe next action, and date.

If a row depends on a real provider, repository owner, legal approver,
independent reviewer, customer, or field observation, record the blocker
honestly and move to the next dependency-ready implementation row. Do not
rewrite the requirement to make the checkbox closable.

## 9. Public/private and security boundary

The public verglos-cli repository may receive only public-safe code, tests,
sanitized docs, non-sensitive schemas, and truthful customer instructions.

Never push private backlog state, execution ledgers, consent, legal packets,
raw findings, raw provider payloads, credentials, private keys, database URLs,
browser cookies, deployment bypasses, customer source, or internal deployment
URLs to the public repository.

Hunt must remain bounded. Docker is a required local qualification tool when
the test requires it, but Docker alone is not a claim of universal host/OS
isolation. Keep cleanup, limits, egress denial, and explicit skip/failure
states in evidence.

## 10. Commit and publication discipline

- Make substantive, reviewable commits.
- Preserve separate logical commits and regular merge commits.
- Never squash or force-rewrite existing work merely to alter contribution
  counts.
- Never make empty commits for graph activity.
- Public changes must be based on clean public main and pass the public boundary
  audit before push.
- Private tracker evidence stays private and must never be pushed to the public
  CLI remote.
- Do not publish npm, alter public registry state, or claim final release in
  this goal.

## 11. Evidence and truth rules

A checkbox requires all of the following:

- implementation reference;
- exact source commit, deployment, or immutable artifact;
- real test command/output or provider/browser evidence;
- scope, privacy boundary, and configuration;
- limitations, skips, and failure behavior;
- applicable approval or external artifact;
- acceptance condition mapping; and
- updated private evidence and score.

A generated Markdown file is not a signature. Founder permission is not an
independent AppSec review, customer consent, provider event, or legal opinion.
A green local test is not hosted/field/customer evidence. A payment page is not
an entitlement lifecycle. A named AI role is not an implemented autonomous
agent.

## 12. Backlog score and reporting

The authoritative score must be recomputed from the live checklist after every
accepted batch. At replacement time it is:

    228 checked / 52 open / 280 total / 81.4 percent

Every progress update must state:

- rows implemented in this batch;
- rows actually checked;
- rows still open and why;
- exact commits/PRs/deployments;
- tests and evidence;
- public/private boundary;
- next dependency-ready row; and
- updated score.

Documentation-only work records no checkbox change.

## 13. Definition of complete for this goal

This goal is complete only when:

1. every eligible Point-1 through Point-5 backlog row has its full evidence;
2. scanner, engine, Trivy, provenance, records, Hunt, MCP, Web, SCM, plans,
   billing, Studio, Enterprise, distribution, privacy, accessibility,
   performance, and acceptance surfaces are reconciled against the blueprint;
3. every remaining external gate has a truthful owner, missing artifact,
   next action, and release-decision treatment;
4. the packed npm package passes the authorized public/TopNotchh TS/JS corpus;
5. the same decision identity is consistent across CLI, MCP, Web, SCM, and
   .vgl records;
6. the final Point-5 evidence bundle is reproducible and private-safe; and
7. the live score and residual risks are reported.

Stop at Point 5. Do not publish npm, run the held-out POC/experiments,
execute campaigns, or record the final release decision in this goal. Those
belong to the next explicit goal.

## 14. Canonical files to read before every continuation

Private authority:

- docs/shipping/FINAL_V1_PRODUCT_CONTRACT_APPROVAL_DRAFT_2026-10-12.md
- docs/shipping/FINAL_V1_PAYING_VALUE_BLUEPRINT_2026-10-13.md
- docs/shipping/FINAL_V1_FEATURE_COVERAGE_MATRIX_2026-10-13.md
- docs/shipping/VERGLOS_V1_BACKLOG.md
- docs/shipping/EXECUTION_LEDGER.md
- docs/shipping/TRACEABILITY.md
- docs/shipping/DECISIONS.md
- docs/shipping/RISKS.md
- docs/shipping/STATUS.md
- docs/shipping/RELEASE_GATES.md
- docs/shipping/FOUNDER_DELIVERABLES_GUIDE_2026-10-12.md
- docs/shipping/deliverables/11-BLOCKER-REGISTER-2026-10-12.md

Implementation workspaces:

- verglos-cli
- verglos-cli-shipping-worktree
- verglos-web

Use the public repository only for public-safe implementation and sanitized
customer documentation. Use the private tracker for restricted evidence,
backlog state, operational records, and release truth.
