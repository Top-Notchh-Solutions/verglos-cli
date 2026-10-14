
# Verglos V1 Final Execution Goal — Paying Product to Point-5 Qualification

**Owner:** Top Notchh Solutions  
**Date:** 2026-10-13  
**Status:** replacement active goal for execution  
**Backlog authority:** VERGLOS_V1_BACKLOG.md  
**Contract authority:** FINAL_V1_PRODUCT_CONTRACT_APPROVAL_DRAFT_2026-10-12.md  
**Value authority:** FINAL_V1_PAYING_VALUE_BLUEPRINT_2026-10-13.md  
**Coverage authority:** FINAL_V1_FEATURE_COVERAGE_MATRIX_2026-10-13.md

## 0.0 Owner authorization checkpoint — 2026-10-14

Anurag Yadav, Owner of Top Notchh Solutions and Verglos
(`anuragyadav.work@gmail.com`), authorized Codex to continue the bounded
shipping workflow using the existing public-safe repositories, Preview
deployment, Preview policy signer, Preview SCM test scope, disposable runner,
synthetic Studio recipient, protected dry-runs, legal/company packets, and
acceptance preparation. The authorization is recorded in
`evidence/owner-authorization-2026-10-14.md`; no secret values are stored.

This removes additional setup questions from the owner. It does not close a
backlog row or convert owner permission into independent AppSec review, legal
opinion, provider event, customer/recipient observation, field-performance
observation, or acceptance evidence. The independent AppSec reviewer remains
the only additional human identity to supply for the Hunt review. The review
must be scheduled against the exact review-ready Hunt commit; it is scoped to
the Hunt execution/Docker/Linux boundary, not the whole product, and does not
require an npm publication. Unrelated rows may continue when their own
acceptance conditions are met; Hunt rows depending on the review remain open.

## 0.0a Standing authority and AppSec-last execution rule — 2026-10-14

Anurag Yadav, Owner of Top Notchh Solutions and Verglos
(`anuragyadav.work@gmail.com`), is the standing company decision-maker and
designated legal/company reviewer for this goal. Treat owner-provided company
decisions and authorizations for company-controlled Preview, fixtures,
runners, recipients, acceptance preparation, redistribution choices, and
release operations as authoritative. Do not ask for another reviewer,
operator, provider, customer, or approval identity merely to continue.

The only separate human identity is the independent AppSec reviewer for Hunt.
The planned roommate review may use a separate laptop and the exact
unreleased public CLI commit, provided the reviewer is suitably
security-competent and did not implement the reviewed Hunt boundary. Schedule
AppSec last, after all dependency-ready rows that do not depend on it. Close
non-AppSec rows whenever their complete row-specific evidence passes; do not
hold them for AppSec.

Owner authority does not auto-check a row and does not replace an actual
provider, customer, field, or independent-review observation. The active
score is **229 checked / 51 unchecked / 280 total (81.8%)** after recording
one explicit owner decision: no networked Hunt recipe exception is approved;
default deny remains in force. Each implementation row still requires its
complete acceptance criteria.

Evidence: `evidence/owner-authorization-2026-10-14.md`.

## 0.1 Current qualification checkpoint — 2026-10-14

The next dependency-ready queue item after parked `LIC-002` was
`QUAL-CLI-006`. The exact merged CLI head
`ba6c75b4e1d11b59f1e6e7bf13edc3c4be02b13a` passed typecheck **14/14**, build
**8/8**, package tests **13/13** with zero failures, release-contract tests
**26/26**, seven-archive package/manifest qualification, clean-consumer
install/import, upgrade/rollback `1.8.3 -> 2.0.0-alpha.1 -> 1.8.3`, official
`in-toto==3.0.0` exact-archive binding, and public-boundary/diff checks.
Mechanical license inventory passed after the temporary CI platform-entry
setup, but the current inventory still reports seven redistribution/legal
review blockers. Docker/Linux environment-gated cases remain explicit skips
on the macOS host.

This is implementation and artifact qualification progress only;
`QUAL-CLI-006` remains unchecked for trusted keyless Sigstore/Fulcio/Rekor
identity, protected publication, legal clearance, independent review, hosted
supported-platform evidence for the final release candidate, and final
acceptance. No npm/registry publication, tag, deployment, provider, database,
entitlement, account, customer, or release-approval state changed. Score
remains **228 checked / 52 unchecked / 280 total (81.4%)**. Evidence:
`evidence/qual-cli-006-current-head-2026-10-14.md`.

## 0.2 Current Hunt fixture-contract checkpoint — 2026-10-14

CLI PR #125 merged normally as `ba6c75b4e1d11b59f1e6e7bf13edc3c4be02b13a`,
preserving contribution commits `677233e57e514390afc44a5dd17222f156ca1b41`
and `b01f1a9d50063fe545cef11f46163033e2eb434b`. Hunt recipes now require
explicit positive, negative, timeout, infrastructure-failure, and unsupported
fixture references with unique IDs and fixed expected verdict mappings. The
public release-verification and clean-consumer scripts use this same contract.

The local CLI/shared/Hunt checks, 8/8 workspace build, fixture verifier,
public-boundary audit, protected run `38545037960`, and self-scan
`38545037969` passed. This advances HUNT-008 implementation and qualification
only; HUNT-008 remains open for supported-rule approval, trusted/licensed
provenance, authorized target/corpus and host evidence, independent AppSec
review, dependent acceptance, `.vgl` binding, and final release criteria.
No checkbox changed; score remains **228 checked / 52 unchecked / 280 total
(81.4%)**. Evidence:
`evidence/hunt-recipe-fixture-contract-pr125-2026-10-14.md`.

All shipping contributions in this goal use regular merge commits. Squash,
rebase, force-push, empty, duplicate, documentation-only, and artificial
contribution commits are prohibited. Public repositories receive only
public-safe code/tests and minimal authoritative public documentation; private
shipping evidence stays in this tracker.

## 0.3 Current Web qualification checkpoint — 2026-10-14

The next dependency-ready assessment after the CLI qualification checkpoint
was `QUAL-WEB-006`. The exact Web merge head
`a54d70dfacfaf9506b1336b788d9cd86c9ca74d7` passed frozen install, typecheck,
focused qualification tests **20/20**, the configured Web suite (**876 passed
/ 24 explicit skips / 0 failed**), and the Next build with **47/47** generated
pages. The local Chrome accessibility snapshot exposed named navigation and
main content, headings, controls, lists, tables, and FAQ content. The current
Web source includes reduced-motion CSS and fail-closed accessibility/CWV
threshold evaluation. The existing protected Vercel Preview returned HTTP 200
for `/`, `/detectors`, `/docs`, and `/checkout` through read-only CLI checks.

This is implementation and read-only qualification progress only.
`QUAL-WEB-006` remains unchecked: the existing Verglos Chrome tab closed before
the continuation Lighthouse/performance run, and human screen-reader,
complete authenticated dashboard, paid/organization large-data,
supported-environment browser, and field-CWV evidence remain open. The
unrelated browser tabs were not touched. No checkbox changed; score remains
**228 checked / 52 unchecked / 280 total (81.4%)**. Evidence:
`evidence/qual-web-006-current-head-2026-10-14.md`.

## 0.4 Current HUNT-008 Docker qualification checkpoint — 2026-10-14

The exact CLI merge head `ba6c75b4e1d11b59f1e6e7bf13edc3c4be02b13a` passed
direct pinned Docker runtime qualification with **18 checks passed and one
explicit macOS namespace skip**, plus the ten-family target-harness groups
**4/4 passed**. The baseline Hunt package test passed **78** with 19 explicit
environment-gated skips and zero failures. The image was pinned to
`docker.io/library/node@sha256:0a7108bf6c7bf5de370ffb1a3ed6be93d405b43ff159f681a8d18c0e2bc2e402`.

This is local technical qualification only. `HUNT-008` remains unchecked for
supported-rule approval, trusted/licensed provenance, authorized targets,
hosted entitlement, independent AppSec review, `.vgl` binding, and final
acceptance. No checkbox changed; score remains **228 checked / 52 unchecked /
280 total (81.4%)**. Evidence:
`evidence/hunt-008-current-head-docker-qualification-2026-10-14.md`.

## 0.5 Current ACCEPT-002 substrate checkpoint — 2026-10-14

The next dependency-ready row after the open Web qualification boundary was
`ACCEPT-002`. The private twelve-story verifier passed against CLI
`ba6c75b4e1d11b59f1e6e7bf13edc3c4be02b13a` and Web
`a54d70dfacfaf9506b1336b788d9cd86c9ca74d7`: CLI **291/293** with two
environment-gated skips, Web **920/950** with 30 environment-gated skips, and
composed Team/Studio/Enterprise/quality substrates **74/74**. All commands
exited 0 and exact output hashes are retained in the machine-readable result.

This is repository-owned substrate/regression evidence only. `ACCEPT-002` and
`ACCEPT-003` remain unchecked for hosted/provider lifecycle,
customer/recipient, independent-review, human browser/field-CWV, and
account-deletion evidence. No external or Production operation occurred; no
checkbox changed and score remains **228 checked / 52 unchecked / 280 total
(81.4%)**. Evidence:
`evidence/accept-002-current-head-substrate-2026-10-14.md`.

## 0.6 Current TEAM-CLI-001 Preview provider-readiness checkpoint — 2026-10-14

The read-only Vercel/GitHub audit against Web merge
`a54d70dfacfaf9506b1336b788d9cd86c9ca74d7` confirms that Preview has the
organization-policy signer and bounded test-auth key names, but no
`VERGLOS_GITHUB_APP_ID`, `VERGLOS_GITHUB_APP_PRIVATE_KEY`, or
`VERGLOS_GITHUB_WEBHOOK_SECRET`. The Top Notchh Solutions GitHub organization
has only the Vercel and Neon installations; no dedicated Verglos SCM App is
installed. No values were printed and no state changed.

`TEAM-CLI-001` remains unchecked for a least-privilege GitHub App
installation, repository/project binding, published canonical Preview policy,
and authenticated signed CLI fetch/cache/offline/cross-tenant evidence. The
next safe action is to install one authorized non-Production repository with a
dedicated App, configure its three server-held Preview secrets, and run the
bounded hosted qualification. This is an external provider prerequisite, not
a reason to fabricate a row pass. No checkbox changed; score remains **228
checked / 52 unchecked / 280 total (81.4%)**. Evidence:
`evidence/team-cli-001-preview-provider-readiness-2026-10-14.md`.

The independent AppSec reviewer remains a separate Hunt-only gate. Owner
authorization does not substitute for that review, and the review is not
needed to create the GitHub App or qualify the unrelated SCM contract.

## 0.7 Current STUDIO-CLI-001 code-side checkpoint — 2026-10-14

The exact CLI/Web merged heads passed shared client projection **4/4**, CLI
projection/record-project **5/5**, the full CLI package test command (exit 0),
Web client/tenant/receipt/Studio contracts **62 pass / 1 explicit database
skip / 0 fail**, and Web typecheck. This confirms the local allowlist,
tenant/workspace/record/digest/approval binding and fail-closed refusal paths.

`STUDIO-CLI-001` remains unchecked because hosted recipient-side redaction and
authorized Studio customer acceptance have not been observed. `LIC-002` is the
next dependency-ready assessment. No checkbox changed; score remains **228
checked / 52 unchecked / 280 total (81.4%)**. Evidence:
`evidence/studio-cli-001-current-head-recheck-2026-10-14.md`.

## 0.8 Current LIC-002 technical checkpoint — 2026-10-14

The exact CLI merged head has a mechanical inventory of **250 package entries
and 254 versions**, one nested component, and **7 unresolved review blockers**.
License/notice/release-verifier tests passed **14/14**, and generated notices
are 379,981 bytes with digest
`sha256:f2b37e1d74dc6d7927c357daf1705a1a8ae0cd0dc3837e072710d123914b6e51`.

`LIC-002` remains unchecked because the designated owner/company reviewer has
not yet recorded the exact package-scope decision, conditions,
signature/reference, and date in the legal addendum. `QUAL-CLI-006` is the
next dependency-ready assessment. No checkbox changed; score remains
**228 checked / 52 unchecked / 280 total (81.4%)**. Evidence:
`evidence/lic-002-current-head-technical-recheck-2026-10-14.md`.

## 0.9 Previous shipping checkpoint — 2026-10-13

PR #122 merged normally as `4d91c616b8744676220a48930034f20a7a64ee6a` after
all eleven protected checks passed, preserving contribution commit
`00fc6b29c29d054579985953acc824dd3fc741e1` as the second merge parent; no
squash, rebase, or force-push was used. The public Hunt Docker qualification
now asserts deny-by-default invocation flags and pinned-runtime controls for
kernel devices, Linux capabilities, restrictive writable `/tmp`, PID/CPU
cgroups, and PID/IPC/mount/network/UTS namespaces where supported. The
post-commit local report recorded 94 passed, 3 skipped, and 0 failed, with 18
passed, 1 skipped, and 0 failed in the adversarial group.

This advances HUNT-011 implementation/qualification only; its counted row
remains open for independent review, trusted/licensed recipe provenance, and
dependent acceptance. HUNT-008 through HUNT-010 remain open, no `.vgl` record
was produced, and the score remains **228 checked / 52 unchecked / 280 total
(81.4%)**. Evidence:
`evidence/hunt-docker-adversarial-hardening-pr122-2026-10-13.md`.

PR #121 merged normally as `95ecf1bad7ff1cee69cf49eee2d0a4946c15bb0b` after
self-scan, in-toto, and all Ubuntu/macOS/Windows Node 20/22/24 checks passed.
It preserves contribution commits
`3eb4defecd8e76601619b276e0509c42a8e6299d` and
`d1b189e2458b10394fe956dc2cc84073d429fe1c` through a two-parent merge; no
squash, rebase, or force-push was used. The public CLI/MCP Hunt path now
shares exact subject, observation, rule, recipe, trust-policy, and approval
bindings, emits schema-validated record-native verification-attempt
projections, and fails closed when a report finding rule would widen the
approved recipe. The packed consumer fixture now carries the exact rule.

This advances HUNT-008/HUNT-009 execution-contract implementation and HUNT-010
MCP parity substrate only; their counted rows remain open until every
row-specific acceptance criterion passes. Complete per-family target
acceptance, supported-rule approval, trusted/licensed treatment, hosted
entitlement/provider confirmation, required host qualification, independent
review, `.vgl` binding, and final release acceptance remain open. No `.vgl`
record was produced and the score remains **228 checked / 52 unchecked / 280
total (81.4%)**. Evidence:
`evidence/hunt-mcp-contract-pr121-2026-10-13.md`.

PR #120 merged normally as `fb3d35af0187d852d6bae5dd0795b9fb0d9a7cf7` after
self-scan, in-toto, and all Ubuntu/macOS/Windows Node 20/22/24 checks passed.
It preserves contribution commit
`5b0f1bacee00d4c5f72e22fa0eeedef782c939be` and adds a schema-validated,
record-native verification-attempt producer to the Hunt proof path. The
attempt binds exact subject, observation, finding, rule, recipe, trust,
approval, runtime, bounded usage, verdict, and output-evidence identities;
the Release Auditor requires that attempt and exact ID presence in the
complete Release Record.

This advances HUNT-008/HUNT-009 producer and Release Record-binding
implementation only; their counted rows remain open until every row-specific
acceptance criterion passes. A2 resource-counter limitations remain explicit.
Complete per-family target acceptance, supported-rule approval,
trusted/licensed treatment, hosted entitlement/provider confirmation, required
host qualification, independent review, `.vgl` binding, and final release
acceptance remain open. HUNT-010/011 are unchanged. No `.vgl` record was
produced and the score remains **228 checked / 52 unchecked / 280 total
(81.4%)**. Evidence: `evidence/hunt-verification-attempt-pr120-2026-10-13.md`.

PR #119 merged normally as `88e95586e2e04a5d981e7dd928778d3c01468d3b` after
the protected self-scan, in-toto, and Ubuntu/macOS/Windows Node 20/22/24
checks passed. It preserves contribution commit
`bd4d9071d71776fda1e590b5a7e950cee0241fb5` and adds the versioned Hunt
release-evidence contract plus the read-only `verglos hunt audit` boundary.
The auditor binds exact subject, observation, finding, rule, recipe,
trust-policy, approval, and verification-attempt identities in a complete
Release Record and fails closed without changing the release decision.

This advances HUNT-008/HUNT-009 Release Auditor implementation only; their
counted rows remain open until every row-specific acceptance criterion passes.
Complete per-family target acceptance, supported-rule approval,
trusted/licensed treatment, hosted entitlement/provider confirmation,
required host qualification, independent review, `.vgl` binding, and final
release acceptance remain open. HUNT-010/011 are unchanged. No `.vgl` record
was produced and the score remains **228 checked / 52 unchecked / 280 total
(81.4%)**. Evidence: `evidence/hunt-release-audit-pr119-2026-10-13.md`.

PR #118 merged normally as `646bd9748910ebb16079ba8461ff7af6e2500799` after
self-scan, in-toto, and all nine Ubuntu/macOS/Windows Node 20/22/24 checks
passed. It preserves source commits
`83560121f678bfe40a555a729994a4bb05e3c518` and
`7c3f0203a069972fb65b7e3ce5949c5b1f954f1e` and adds exact remediation-scope
approval plus the bounded `hunt retest` path. Retest binds a non-mutating
proposal to the before subject/finding/file/policy/no-network scope, requires
separate execute approval for a distinct after subject, reruns the same proof
and counterexample, and explicitly reports `applied:false`.

This contribution advances HUNT-008/HUNT-009 remediation/retest
implementation only; their counted rows remain open until every row-specific
acceptance criterion passes. No `.vgl` Release Record was produced. Complete
trusted/licensed provenance, hosted entitlement/provider confirmation,
required isolation qualification, independent review, `.vgl` binding, and
final release acceptance remain open. HUNT-010/011 are unchanged. Score
remains **228 checked / 52 unchecked / 280 total (81.4%)**. Evidence:
`evidence/hunt-retest-pr118-2026-10-13.md`.

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
   preserve every contributor's commit, merge with a regular non-squash merge
   commit, and verify the merged head. Do not squash, rebase away, force-push,
   or fabricate empty contribution commits.
10. Reconcile the next row only after the current one is genuinely complete or
    explicitly parked with owner, missing artifact, safe next action, and date.

If a row depends on a real provider, repository owner, legal approver,
independent reviewer, customer, or field observation, record the blocker
honestly and move to the next dependency-ready implementation row. Do not
rewrite the requirement to make the checkbox closable.

For this goal, do not request another human identity when the row is
company-controlled: use the standing owner/company authority and proceed with
the row's actual evidence. The only deliberately deferred human identity is
the independent Hunt AppSec reviewer, which is scheduled last. AppSec must not
be treated as a master dependency for unrelated Web, SCM, Studio, Enterprise,
commercial, distribution, or other rows whose own criteria can be evidenced.

## 9. Public/private, contribution, and documentation boundary

The public verglos-cli repository may receive only public-safe code, tests,
sanitized docs, non-sensitive schemas, and truthful customer instructions.

Do not add irrelevant Markdown, planning copies, private shipping checklists,
founder/owner records, blocker registers, execution ledgers, internal review
packets, or generated evidence artifacts to the public repository. Add a public
document only when it is required for the shipped product, developer use,
public contract, or public-safe troubleshooting. Keep private goal, backlog,
evidence, legal, consent, and release-governance material in the private
shipping tracker. Before every public push, run the public-boundary audit and
remove unrelated documentation or generated files.

## 9.1 Browser and tooling boundary

Do not open new Chrome windows or tabs. If the existing Verglos Chrome tab is
available, use only that tab and do not navigate unrelated tabs. If it is not
available, use the CLI/API or local test evidence; do not open a replacement
browser session and do not touch unrelated browser pages. Use Vercel CLI for
read-only Preview/deployment checks where possible, without exposing secrets
or bypassing Preview protection.

Never push private backlog state, execution ledgers, consent, legal packets,
raw findings, raw provider payloads, credentials, private keys, database URLs,
browser cookies, deployment bypasses, customer source, or internal deployment
URLs to the public repository.

Hunt must remain bounded. Docker is a required local qualification tool when
the test requires it, but Docker alone is not a claim of universal host/OS
isolation. Keep cleanup, limits, egress denial, and explicit skip/failure
states in evidence.

## 10. Commit, contribution, and publication discipline

- Make substantive, reviewable commits that advance the actual shipping goal;
  green CI must come from real implementation, tests, or evidence.
- Preserve separate logical commits and every genuine contributor's history;
  use regular non-squash merge commits.
- Never squash, rebase away, force-rewrite, or delete existing contribution
  commits merely to simplify history or alter contribution counts.
- Never make empty, duplicate, documentation-only, or artificial commits for
  graph activity. Avoid work that spends tokens or time without advancing a
  dependency-ready acceptance slice.
- Keep documentation changes minimal and authoritative: update the canonical
  file when evidence or contract truth changes, do not create parallel or
  irrelevant Markdown files.
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

    229 checked / 51 open / 280 total / 81.8 percent

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
