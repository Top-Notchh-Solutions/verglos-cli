
# Verglos Final V1 — Paying-Value Blueprint

**Owner:** Top Notchh Solutions  
**Date:** 2026-10-13  
**Status:** private product and implementation authority  
**Canonical contract:** FINAL_V1_PRODUCT_CONTRACT_APPROVAL_DRAFT_2026-10-12.md  
**Coverage matrix:** FINAL_V1_FEATURE_COVERAGE_MATRIX_2026-10-13.md  
**Active goal:** VERGLOS_V1_ACTIVE_GOAL_FINAL_EXECUTION_2026-10-13.md

This document answers a commercial question for every Final V1 surface:

> Why would a real TypeScript/JavaScript developer, team, agency, or
> enterprise pay for Verglos, and what evidence proves that the value exists?

It is a requirements and acceptance blueprint. It is not a claim that every
capability below is already implemented. The private backlog remains the only
source of checkbox state. At this revision the live score remains **228
checked / 52 unchecked / 280 total (81.4%)**.

## 0.1 Owner authorization and independent-review boundary — 2026-10-14

Top Notchh Solutions owner Anurag Yadav authorized the bounded Preview,
disposable-runner, protected-dry-run, legal/company-packet, and acceptance-
preparation operations recorded in
`evidence/owner-authorization-2026-10-14.md`. This is execution authorization,
not proof that the corresponding customer, provider, legal, field, or release
acceptance artifacts exist.

The remaining independent human input for the Hunt is a separate AppSec
reviewer. That reviewer will inspect the exact public CLI source commit and
run the Hunt/Docker review packet before HUNT-011 and QUAL-CLI-004, and their
dependent Hunt/release claims, can be accepted. The reviewer does not need a
published npm version. This blueprint must not describe AppSec as the only
remaining acceptance condition for the entire product; unrelated rows retain
their own evidence requirements.

## 1. Product thesis

Verglos is a security decision layer between a code change and a release:

    Inspect -> Understand -> Prove -> Fix -> Retest -> Approve or block -> Remember

The paid outcome is not “a dashboard” and not “a number of AI agents.” It is a
reproducible answer to four release questions:

1. What changed and what security-relevant behavior or dependency does it
   affect?
2. Is the finding reachable or important in this specific application?
3. Can the behavior be safely reproduced and then disproved after a fix?
4. Can a teammate, CI job, customer, or auditor verify the exact decision
   without trusting a screenshot or a model explanation?

Verglos V1 is terminal-first and local-first, but not local-only. The local
data plane is the privacy and cost advantage. Web, MCP, SCM, private runners,
and hosted records add collaboration and governance without creating a second
security truth.

## 2. Market baseline and the Verglos wedge

The following is a product baseline, not a promise that competitor marketing
claims have been independently audited.

| Market baseline | What customers now expect | Verglos must provide | Deliberate boundary |
| --- | --- | --- | --- |
| Semgrep/GitHub-style developer security | SAST, SCA, secrets, PR/CI findings, triage, remediation | Visible TS/JS coverage, finding identity, dependency/secret/provenance context, PR decisions, and remediation/retest continuity | Do not claim language breadth that V1 does not implement. |
| Snyk-style platform security | Dependency, code, IaC, container, API and CLI coverage with plan/usage controls | One evidence graph joining native rules, imported evidence, Trivy, Hunt, records, and plan policy | Do not promise unlimited hosted compute at entry prices. |
| XBOW/Aikido-style autonomous testing | Target mapping, focused attack workers, validation, impact, retesting, and reports | Scanner-guided real-target Hunt with bounded playbooks, counterexamples, safe impact levels, and a Release Record | No arbitrary internet exploitation, uncontrolled shell, or model-only proof. |
| StackHawk-style API/runtime testing | Route/API discovery, CI execution, coverage, and code-to-runtime correlation | Authorized local/private target adapters and route-to-finding-to-proof linkage | No general remote DAST promise in V1. |
| Supply-chain standards | SBOM, provenance, signatures, dependency risk, and policy verification | Portable .vgl records with subject, engines, provenance, policy, Hunt, limitations, and decision | A record is evidence; it is not a certification or a guarantee of safety. |

The defensible V1 wedge is **high-confidence TS/JS code-to-proof with portable
evidence and local privacy**. “Better than competitors” is permitted only for
metrics demonstrated on the held-out benchmark in Section 15.

## 3. Product architecture and customer journey

### 3.1 One evidence graph

Every supported surface must use the same stable identities:

    source/artifact subject
      -> coverage manifest
      -> engine run (native, SCA, secrets, provenance, Trivy, import)
      -> normalized observation/finding
      -> target capability and rule-to-playbook mapping
      -> approval + entitlement
      -> Scout target manifest
      -> bounded attack hypothesis and worker run
      -> proof + negative control + limitation
      -> remediation proposal and approved retest
      -> signed .vgl Release Record
      -> CLI / MCP / Web / SCM / policy decision

No model may create a new finding, recipe, severity, approval, or release
decision outside this graph. If a capability is unavailable, the product must
say unsupported, not_attemptable, incomplete, or environment_failure. Silence
is never a pass.

### 3.2 Customer journey

1. Install the public npm package and run a scan locally.
2. See exact supported domains, skipped targets, engine versions, and findings.
3. Select a finding or explicitly scoped test route for Hunt.
4. Let Scout describe the authorized local/private target.
5. Let the hypothesis role choose an approved playbook; the user approves it.
6. Execute in the declared boundary with network, process, filesystem, device,
   resource, timeout, output, and cleanup limits.
7. Receive proof, counterexample, limitation, remediation guidance, and retest
   status—not a confidence-only answer.
8. Create or verify a signed .vgl Release Record.
9. Use the same result in an AI/MCP workflow, Web history, policy engine, and
   GitHub/GitLab check when the plan supports those surfaces.

## 4. Plan-by-plan paying value

All plans use the same public verglos npm/CLI front door. Plans unlock
operating scope, collaboration, governance, retention, and managed cost; they
do not create five incompatible products.

### 4.1 Free — useful security on the developer's machine

**Customer:** individual developer, student, open-source maintainer, or a team
trying Verglos before purchasing.

**Problem solved:** security checks are too expensive, too slow, or too
detached from the terminal and code change.

**Delivered value:**

- unlimited local TypeScript/JavaScript scanning within the published V1
  coverage manifest;
- native findings for the supported ten security domains;
- dependency/lockfile and local secret checks;
- local provenance and release-context inspection;
- local Trivy/image/artifact checks when the customer has Trivy and the target;
- JSON/HTML and machine-readable output suitable for pre-commit and CI;
- safe MCP scan, explain, package, and before-write tools;
- a starter bounded Hunt pack against the user's own test target;
- local evidence and offline .vgl verification;
- explicit unsupported, stale, failed, and skipped results.

**Free boundary:** no hosted history, shared organization, managed runner,
hosted model allowance, client handoff, or enterprise identity requirement.

**Why it can be free:** the default work runs on the user's machine. Free must
not quietly call paid hosted services or upload source.

**Acceptance proof:** a clean install can scan representative TS/JS projects,
produce a coverage manifest and deterministic results, run the starter Hunt
fixtures safely, and verify a local record without an account.

### 4.2 Pro — complete local code-to-proof loop

**Customer:** professional developer, consultant, security-minded founder, or
small product team.

**Problem solved:** a scanner produces alerts but the developer still has to
manually decide whether the issue is reachable, exploitable, fixed, and safe to
release.

**Delivered value:**

- everything in Free;
- complete supported local/private TS/JS Hunt workflow;
- Scout target map, attack hypothesis, qualified playbook, worker, proof,
  counterexample, and limitation in one run;
- all qualified V1 playbook families, with the coverage manifest showing what
  is unsupported;
- remediation guidance or an explicitly approved patch proposal;
- repeatable retest against the same subject/finding;
- signed local .vgl Release Records and offline verification;
- full MCP Hunt path with the same approvals and authority limits;
- personal hosted history and monitoring within declared allowances;
- cards-only prepaid fixed term with manual renewal.

**Pro boundary:** no shared organization policy, PR repository binding,
multi-client data separation, enterprise SSO/SCIM, or contracted private
runner SLA.

**Why it is paid:** it saves triage and retest time while producing evidence a
developer can attach to a release, without forcing source into a hosted system.

**Acceptance proof:** on held-out authorized TS/JS applications, a finding can
travel from scan to proof to retest to signed record, with repeatability and
cost measured.

### 4.3 Team — shared release control

**Customer:** engineering/security team with several contributors and shared
repositories.

**Problem solved:** security decisions live in individual terminals and are
not consistently enforced on pull requests or across an organization.

**Delivered value:**

- everything in Pro;
- a Verglos organization with members, roles, tenant-scoped projects, and
  shared history;
- organization policy, baseline, exception, approval, and audit event model;
- GitHub/GitLab installation and immutable repository/organization binding;
- source-free PR checks with exact commit, subject digest, decision, policy,
  and record identity;
- replay-safe webhook delivery, removal, recovery, and cross-tenant refusal;
- authorized private-runner execution for shared targets where configured;
- team-level monitoring, findings ownership, and release comparison.

**Team boundary:** the repository owner must authorize installation and the
organization must control repository scope. An existing personal GitHub login
does not automatically prove a Verglos organization binding.

**Why it is paid:** it converts individual security work into a repeatable team
gate with accountability and evidence, without uploading source by default.

**Acceptance proof:** an authorized company test repository receives an
idempotent check for a known commit, rejects an unbound repository or replay,
survives retry/removal, and shows the same decision in CLI, Web, and SCM.

### 4.4 Studio — multi-client security delivery

**Customer:** agency, consultancy, internal platform team, or security service
that handles multiple clients or products.

**Problem solved:** client evidence must be useful and verifiable without
mixing tenants, exposing raw source, or rebuilding a report manually for every
engagement.

**Delivered value:**

- everything in Team;
- isolated client workspaces and strict client/project separation;
- multi-client Hunt campaigns with target, scope, time, and cost controls;
- redacted projections and safe upload preview before custody transfer;
- client-facing reports and public verification of permitted record fields;
- white-label evidence while preserving Verglos authenticity and limitations;
- campaign comparison, retest history, and handoff receipts;
- explicit retention, deletion, export, and recipient controls.

**Studio boundary:** a client handoff is never an implicit source upload. The
operator must preview the exact allowlisted projection and approve custody.

**Why it is paid:** it turns repeatable security work into a defensible,
auditable service deliverable and lowers the cost of producing trustworthy
client evidence.

**Acceptance proof:** two isolated test clients cannot read or mutate each
other's records; a redacted handoff contains only allowlisted fields; the
recipient verifies the record and sees limitations.

### 4.5 Enterprise — controlled private security operations

**Customer:** regulated, large, or security-sensitive organization.

**Problem solved:** the organization needs security evidence and attack
verification inside its governance, identity, data-residency, retention, and
operational controls.

**Delivered value:**

- everything in Studio;
- private runners and private registry/image workflows;
- customer-controlled trust roots and KMS/HSM options;
- SSO/SCIM, organization-wide agent policy, least-privilege roles, and audit
  export;
- retention, residency, legal hold, deletion, and recovery controls;
- custom authorized target adapters and Hunt playbooks with provenance;
- contracted support, incident process, capacity and SLA terms;
- release and evidence integrations that can be verified offline.

**Enterprise boundary:** custom adapters, playbooks, residency, support, and SLA
are contracted capabilities. They are not implied by the Team dashboard or by a
green local fixture test.

**Why it is paid:** it reduces operational and audit risk while fitting into
existing identity, deployment, and compliance controls.

**Acceptance proof:** a customer-shaped private runner executes a signed job with
outbound polling only, target allowlists, replay protection, redacted results,
identity checks, retention policy, audit export, and recovery evidence.

## 5. Full V1 feature value map

Each surface below must have a customer outcome, an explicit plan boundary, an
implementation path, a measurable acceptance result, and a limitation when
the capability is not available. The named backlog family is the place where
implementation is tracked; this blueprint does not create a second checkbox.

| Surface | Paying customer outcome | Required V1 behavior | Plan boundary | Main backlog families | Acceptance metric |
| --- | --- | --- | --- | --- | --- |
| Local CLI/npm | Run security in the existing terminal/CI workflow | One safe front door, stable commands, machine-readable output, exit decisions, clear errors | All | LOCAL-*, DIST-*, QUAL-CLI-* | clean install, supported OS/Node matrix, no private files, deterministic contract |
| TS/JS scanner/SAST | Find risky behavior before release | Ten-domain manifest, rule identity, locations, severity, confidence, coverage/skips, suppression/exception semantics | Free baseline; Pro depth; shared policy Team+ | ENGINE-*, TARGET-*, GRAPH-* | per-domain fixture recall, false-positive rate, unsupported visibility |
| SCA/dependency graph | Know which dependency risk affects this application | lockfile/package graph, direct/transitive identity, reachability/context where supported, advisory/source, fix guidance | Free local; Pro workflow; Team policy | ENGINE-*, GRAPH-*, IMPORT-* | exact package/version/path, stable correlation, remediation/retest |
| Secrets | Prevent credential leakage and prioritize real exposure | entropy/pattern/semantic evidence, redaction, history scope, opt-in validity checks, never store raw secret | Free local; paid policy/history | ENGINE-*, IMPORT-*, QUAL-* | seeded secret detection, raw-secret absence, rotation guidance |
| Supply-chain posture | Assess dependency and repository trust | provenance, maintainer/release signals, OpenSSF-style posture inputs, policy explanation | Free local; Team shared; Enterprise custom | DIST-*, LIC-*, POLICY-* | identity/digest, evidence freshness, visible limits |
| Trivy/image/artifact | See OS/package/config/secret/license risk in shipped artifacts | pinned Trivy invocation, JSON/SARIF/SBOM normalization, digest binding, stale/missing/incompatible state | Free local; Pro records; Team+ policy/private images | ENGINE-*, IMPORT-*, DIST-* | clean/fixture image matrix, digest and engine version, incomplete fail-closed |
| IaC/configuration | Catch insecure deployment defaults | supported IaC/config targets, versioned rules, context and policy, no claim for unsupported providers | Free supported local; Team policy; Enterprise custom | ENGINE-*, TARGET-* | representative config fixtures and unsupported cases |
| Attest/.vgl records | Prove what was checked and what decision was made | signed portable record with subject, coverage, engines, findings, Hunt, policy, approvals, provenance, limitations | Free local verify; Pro signed local; Team+ shared/public/enterprise | RECORD-*, DIST-* | offline verification, tamper rejection, cross-surface same digest |
| MCP/AI workflow | Use security in coding agents without giving them unsafe power | scan/explain/before-write/Hunt/record tools, per-tool authorization, explicit approval, no arbitrary shell/network/signing | Free safe tools; Pro Hunt; Team+ policy | AGENT-*, HUNT-010 | unauthorized tool refusal, same CLI result, consent/audit |
| Hunt/code-to-proof | Reduce false alarms and prove reachability | scanner finding to target map to approved playbook to bounded proof/counterexample to retest | Free starter; Pro full local; Team+ shared/private; Enterprise custom | HUNT-*, TARGET-*, GRAPH-* | verified-proof recall, reproducibility, route coverage, P50/P95 |
| Web history/monitoring | Remember decisions and spot regressions | tenant-scoped records, findings, comparison, alerts, limits, privacy/deletion | Pro personal; Team shared; Studio/Enterprise governed | PLAN-WEB-*, PRO-*, OPS-*, QUAL-WEB-* | data isolation, deletion/export, alert correctness, performance |
| Verglos organizations | Coordinate people and policies | roles, projects, baselines, exceptions, approvals, audit, tenant checks | Team+ | TEAM-*, POLICY-*, FINAL-WEB-* | cross-tenant refusal, immutable audit, policy digest consistency |
| GitHub/GitLab SCM | Block risky changes where code is reviewed | install scope, immutable IDs, commit binding, PR checks, webhook replay/retry, uninstall | Team+ | TEAM-WEB-*, GITHUB-WEB-* | authorized test repo end-to-end delivery and removal |
| Studio custody/handoff | Deliver client evidence safely | allowlisted redaction, custody approval, workspace isolation, recipient verification | Studio+ | STUDIO-* | two-client isolation, exact projection digest, recipient verification |
| Enterprise private ops | Fit security into regulated operations | private runner, outbound polling, trust root, KMS/HSM option, SSO/SCIM, residency, audit export | Enterprise | ENT-*, QUAL-*, ACCEPT-* | signed private job, replay/refusal/recovery, policy export |
| Billing/entitlements | Pay for a predictable fixed-term capability | server-owned catalog, Cards-only prepaid term, manual renewal, entitlement derived from verified payment state | Pro+ | PLAN-CLI-*, PLAN-WEB-*, PRO-*, ENT-* | order/capture/refund/expiry/renewal evidence; no client-side grants |
| Distribution/release | Install an authentic package safely | public-safe package boundary, protected publish, SBOM/checksums/provenance, rollback/revocation | All consume; release owner controls publish | DIST-*, LIC-*, QUAL-CLI-* | clean consumer, package audit, provenance verification, rollback rehearsal |
| Support/quality | Trust the product in daily use | accessibility, performance, privacy, failure handling, docs, support boundaries | All appropriate to plan | QUAL-WEB-*, ACCEPT-*, FINAL-WEB-* | stated budgets, screen-reader/field evidence, failure matrix, comprehension |

## 6. Scanner-to-Hunt product contract

Hunt becomes valuable only when the scanner supplies useful context. The
implementation must connect these fields, not merely place two commands next
to each other:

| Scanner output | Hunt use | Proof returned |
| --- | --- | --- |
| stable rule/domain ID | choose a permitted playbook family | playbook ID and version |
| subject and commit/artifact digest | bind the run to exact code | subject identity and unchanged-input check |
| location/sink/route | build target scope and attack input | target reference and route coverage |
| dependency/secret/provenance context | prioritize impact and required controls | evidence links and limitations |
| confidence/severity | determine whether Hunt is useful and permitted | decision rationale, never automatic severity inflation |
| target capability | decide supported/not-attemptable | explicit unsupported reason |
| remediation result | run the same proof after change | before/after record with retest status |

The scanner remains the source of observations. Hunt can confirm, reject, or
qualify an observation; it cannot silently create a new severity model.

## 7. Hunt capability required for a credible paid product

### 7.1 Controlled roles

The five roles are responsibilities in one governed workflow, not a marketing
claim that five independent AI services already exist:

1. **Scout/Context:** target manifest, framework/routes/APIs, test entrypoints,
   dependency boundaries, agent tools, and reachable sinks.
2. **Attack-Hypothesis:** maps finding/context to an approved declarative
   playbook and proposes bounded inputs/sequences.
3. **Attack Worker Fleet:** executes family adapters with limits and cleanup.
4. **Proof/Counterexample:** replay and negative controls; classify confirmed,
   not reproduced, inconclusive, unsupported, or environment failure.
5. **Release Auditor:** checks subject, evidence, policy, approval, entitlement,
   provenance, and limitations before a decision.

### 7.2 Ten required V1 families

SQL/NoSQL injection; command/code execution; path/file boundaries; SSRF;
authentication/authorization/IDOR/tenancy; XSS/template sinks; prototype
pollution/deserialization/parsers; secrets and credential use;
dependency/supply-chain/malicious package behavior; and AI-agent/MCP
boundaries/approval bypass.

For every supported family, the recipe contract includes source/version,
license/provenance, target type, input schema, positive/negative/timeout/
infrastructure-failure/unsupported fixtures, network policy, process and
filesystem limits, output redaction, cleanup, proof method, counterexample,
remediation hint, retest method, and plan entitlement.

The current A1/A2 catalog is a safety and regression foundation. It is not
itself proof of full autonomous real-application coverage.

## 8. Evidence, Attest, and release value

The .vgl Release Record is the durable product artifact. It must answer:

- what subject or artifact was checked;
- which exact commit, package, image, and digest were used;
- which engines and versions ran;
- which domains were covered, skipped, stale, or failed;
- which findings and observations existed;
- which Hunt playbook, target, approval, proof, and counterexample ran;
- which policy, entitlement, and organization applied;
- which remediation and retest happened;
- what was not checked and why;
- who/what signed it; and
- whether the final decision was pass, fail, conditional, or incomplete.

Attest is therefore not a decorative Studio feature. Local record creation and
verification are part of Free/Pro value; shared approvals and hosted custody
are Team/Studio value; customer-controlled roots, KMS/HSM, residency, and
audit export are Enterprise value.

Verglos should align the record/provenance design with the ideas in
[SLSA provenance](https://slsa.dev/spec/v1.2/provenance),
[SLSA artifact verification](https://slsa.dev/spec/v1.2/verifying-artifacts),
[Sigstore attestations](https://docs.sigstore.dev/cosign/verifying/attestation/),
and [CycloneDX SBOM guidance](https://cyclonedx.org/guides/sbom/), while
keeping .vgl as the Verglos customer-facing decision record rather than
claiming to replace those standards.

## 9. Trivy and external engines

Trivy is an open-source scanner maintained by Aqua. Its official reporting
documentation lists vulnerability, misconfiguration, secret, and license
scanning plus table, JSON, SARIF, and SBOM output:
[Trivy reporting](https://trivy.dev/docs/v0.56/guide/configuration/reporting/).

Verglos is not Trivy with a new logo. Verglos owns:

- target and subject identity;
- scanner coverage and native TS/JS findings;
- normalization and correlation across engines;
- policy, plan entitlement, and release decision;
- Hunt selection and bounded proof;
- signed .vgl records and cross-surface projections.

Trivy supplies replaceable artifact/image evidence. The adapter must pin and
verify the engine, bind the image/artifact digest, preserve raw evidence only
where permitted, normalize findings, and fail closed when the engine is
missing, stale, incompatible, or unverifiable. The product must never turn a
missing Trivy run into a clean result.

OSV-Scanner and OpenSSF Scorecard are useful complementary references for
dependency and open-source posture. OSV-Scanner documents package extraction,
vulnerability matching, SBOM/image scanning, license checks, and source-free
JSON output at [OSV-Scanner](https://google.github.io/osv-scanner/) and
[usage](https://google.github.io/osv-scanner/usage/). Scorecard documents
repository/build-risk checks, remediation prompts, and CI/CLI use at
[scorecard.dev](https://scorecard.dev/). Any import must retain source,
version, timestamp, digest, and limitation metadata.

## 10. MCP and AI-agent value

MCP is the standard interface used by AI hosts to expose resources, prompts,
and tools. The official specification says tool calls can create arbitrary
data-access or code-execution paths and requires user consent, control, and
clear authorization boundaries:
[MCP specification](https://modelcontextprotocol.io/specification/latest).

Verglos's paid value is a security control surface for AI-assisted development:

- inspect gives the model normalized findings and scope;
- explain gives evidence-backed reasoning and limitations;
- before-write checks a proposed change without silently editing source;
- hunt requires supported mapping, entitlement, approval, and bounded target;
- record creates or verifies a signed artifact, not a model assertion;
- protected tools return authorization failures at the correct boundary;
- every result carries plan, policy, subject, and evidence identity.

The MCP server must never grant an agent arbitrary shell, unbounded network,
secret access, signing authority, billing authority, source upload, or release
approval. Free gets safe inspection; Pro gets local Hunt; Team and above add
shared policy and organizational approvals.

## 11. Web, organization, SCM, and billing value

### Verglos organization vs GitHub/GitLab organization

A Verglos organization is the tenant boundary for people, projects, policies,
records, approvals, billing, and audit. A GitHub/GitLab organization is the
external code-hosting boundary. Team and above bind the two through an
authorized installation with immutable provider account, organization,
repository, installation, commit, and delivery identities.

Having a GitHub account or belonging to Top Notchh's GitHub organization is
not, by itself, evidence that a Verglos SCM installation has been authorized.
The live gate requires an authorized test installation, scoped permissions,
delivery/replay/retry handling, check publication, uninstall, and recovery.

GitHub's official documentation describes code scanning, SARIF interoperability,
secret scanning, and dependency review; GitLab's application-security
documentation describes source/dependency/container scanning, simulated
runtime testing, merge-request results, and the detect-triage-analyze-remediate
cycle. These are the baseline Team customers already understand:

- [GitHub code scanning](https://docs.github.com/en/code-security/concepts/code-scanning/code-scanning)
- [GitHub secret scanning](https://docs.github.com/en/code-security/concepts/secret-security/secret-scanning)
- [GitHub dependency review](https://docs.github.com/en/code-security/concepts/supply-chain-security/dependency-review)
- [GitLab application security testing](https://docs.gitlab.com/user/application_security/)

### Cards-only prepaid commercial model

V1 sells a fixed paid term, not an automatic recurring subscription:

- provider creates the order;
- server validates amount, catalog version, currency, and plan;
- signed provider event is authenticated, replay-safe, and reconciled;
- entitlement is derived server-side from the verified terminal state;
- refunds, expiry, cancellation, and manual renewal are explicit;
- client input never grants a plan;
- payment provider failure or missing evidence remains incomplete.

Local scanning is not metered. Hosted history, seats, retention, public
verification, managed runners, model calls, and campaigns require explicit
allowances or contracted limits.

## 12. Pricing and margin guardrails

The current launch catalog remains the working hypothesis: Free $0, Pro
$29/month, Team $99/month, Studio $249/month, and Enterprise custom, using
one-time prepaid fixed terms and manual renewal. This is not proof that the
prices are market-fit; ACCEPT-008 must test actual usage, support time, hosted
cost, repeat use, and willingness to pay.

Guardrails:

1. Do not meter ordinary local scan/Hunt work that runs on the customer's
   machine.
2. Put hard allowances on hosted storage, public verification, alerts, model
   calls, managed runners, and multi-client campaigns.
3. Attribute cost per hosted run, model call, runner minute, retained record,
   and delivery; alert when a plan approaches its allowance.
4. Never hide an overage, downgrade, or paid capability behind a client-only
   flag; the server catalog is authoritative.
5. Reprice only through a versioned catalog and never silently alter an active
   entitlement.
6. Keep Enterprise custom because private execution, residency, identity,
   support, and custom adapters have materially different cost and liability.

## 13. Acceptance metrics that create credible value

The final product must report these metrics by domain, plan, and target type
where applicable:

| Metric | Why a customer cares | Required treatment |
| --- | --- | --- |
| finding recall | Are important issues detected? | held-out corpus, by domain and severity |
| verified-proof recall | Are findings actually validated? | positive/negative adjudication, not model confidence |
| false-positive rate | How much triage is wasted? | independent labels and explicit inconclusive cases |
| target/route coverage | What application surface was exercised? | discovered vs tested vs unsupported |
| proof reproducibility | Can a team trust the result? | repeated runs and cross-environment comparison |
| remediation/retest success | Does the product help close risk? | before/after same proof, no silent source mutation |
| time to first useful result | Does it fit development flow? | P50/P95 by plan and target size |
| resource and hosted cost | Does it preserve margin? | CPU/memory/disk/network/model/runner accounting |
| privacy/egress | Is customer source protected? | network audit, upload inventory, redaction test |
| release decision consistency | Do CLI/Web/MCP/SCM agree? | identical subject/policy/record digests |
| comprehension | Can a developer act on the result? | structured report comprehension test |
| availability/failure behavior | Does failure fail safely? | timeout, stale engine, provider, DB, runner, retry cases |

The benchmark must disclose unsupported targets, failures, limitations, and
baseline configuration. No broad superiority statement is permitted without
these measurements.

## 14. Implementation order for the current shipping goal

The current goal stops at Point 5. The order below keeps paying value coherent
without letting a dashboard or fixture test hide a missing core path:

1. Freeze this paying-value blueprint with the contract and plan catalog.
2. Synchronize the feature map, architecture blueprint, backlog cross-links,
   ledger, traceability, risks, decisions, goal, and safe CLI/Web/MCP copy.
3. Finish the scanner coverage/manifest, engine/import, Trivy, provenance, and
   record foundations needed for a trustworthy finding.
4. Finish scanner-to-Hunt mappings, real authorized TS/JS target adapters,
   bounded worker controls, proof/counterexample, remediation/retest, and MCP
   parity.
5. Connect Web entitlements, organizations, SCM, Attest, .vgl records,
   billing, monitoring, privacy, and plan-bound behavior.
6. Run package, Web, and authorized public/TopNotchh-owned TS/JS qualification
   with clean, vulnerable, dependency, secret, artifact, MCP, Hunt, record,
   failure, performance, and no-upload cases.
7. Reconcile each eligible backlog checkbox only when its complete acceptance
   evidence exists; recompute the score from the live checklist.

Point 5 is the stopping boundary of this goal. Npm publication, held-out
experiments/POC, campaign execution, and the final release decision belong to
the next goal and must not be represented as shipped here.

## 15. Held-out benchmark and claims gate

The held-out corpus must contain real or authorized public TS/JS applications
and intentionally vulnerable fixtures covering small projects, APIs, auth and
multi-tenant flows, dependency risk, containers, MCP tools, clean projects,
and failure environments. Record exact repository URL, commit digest, license,
scope, configuration, and retention privately.

The benchmark must compare a declared baseline and Verglos on the same target
set. It must report recall, verified-proof recall, false positives,
inconclusive/environment-failure rates, route coverage, reproducibility,
time-to-proof, remediation/retest, privacy/egress, resource use, and hosted
cost. Unsupported cases count as unsupported; they do not become passes.

The release may say “better” only for measured dimensions where Verglos wins
or provides a clearly documented trade-off. The product may say “local-first,
scanner-connected, proof-oriented, and evidence-portable” as a design
position, but those words do not replace benchmark evidence.

## 16. Current truth at this revision

- Product contract and private matrix now define a competitive scanner-to-proof
  product rather than a fixture-only Hunt.
- The public catalog currently contains eight A1 deterministic probes and
  ten A2 target-harness descriptors. They are foundations, not ten complete
  autonomous attacking agents or full customer-code coverage.
- Public A2 bounded CLI execution and reference harness evidence exists; real
  target discovery, scanner mappings, full proof/retest, hosted plan behavior,
  Linux/Docker qualification where required, and final acceptance remain
  backlog work unless their evidence says otherwise.
- The current launch price is a hypothesis with guardrails, not validated
  market fit.
- The live backlog score is unchanged at **228/52/280 (81.4%)**.
- This blueprint changes product clarity and traceability only. It does not
  close a checkbox, grant an entitlement, publish npm, alter Production, or
  fabricate customer, legal, provider, or independent-review evidence.

## 17. Research sources

### Product and competitor baselines

- [XBOW platform](https://xbow.com/platform)
- [XBOW console introduction](https://docs.xbow.com/console/get-started/introduction/)
- [XBOW trust and safety](https://docs.xbow.com/console/get-started/trust-and-safety/)
- [XBOW impact demonstration](https://docs.xbow.com/console/reference/impact-demonstration/)
- [Aikido AI Pentest](https://www.aikido.dev/attack/aipentest)
- [Aikido Infinite](https://www.aikido.dev/blog/introducing-aikido-infinite)
- [Semgrep pricing](https://semgrep.dev/pricing/)
- [Semgrep Workflows](https://semgrep.dev/docs/workflows/overview)
- [Snyk plans](https://snyk.io/plans/)
- [GitHub code scanning](https://docs.github.com/en/code-security/concepts/code-scanning/code-scanning)
- [StackHawk product/pricing](https://www.stackhawk.com/pricing-old/)

### Standards and open tooling

- [OWASP developer guide: secure development and integration](https://devguide.owasp.org/en/02-foundations/02-secure-development/)
- [OWASP Top 10: establishing a modern AppSec program](https://top10.owasp.org/2025/0x03_2025-Establishing_a_Modern_Application_Security_Program/)
- [SLSA specification v1.2](https://slsa.dev/spec/v1.2/)
- [SLSA provenance](https://slsa.dev/spec/v1.2/provenance)
- [SLSA artifact verification](https://slsa.dev/spec/v1.2/verifying-artifacts)
- [Sigstore in-toto attestations](https://docs.sigstore.dev/cosign/verifying/attestation/)
- [CycloneDX SBOM guide](https://cyclonedx.org/guides/sbom/)
- [Trivy reporting](https://trivy.dev/docs/v0.56/guide/configuration/reporting/)
- [OSV-Scanner](https://google.github.io/osv-scanner/)
- [OpenSSF Scorecard](https://scorecard.dev/)
- [MCP specification](https://modelcontextprotocol.io/specification/latest)
- [GitHub secret scanning](https://docs.github.com/en/code-security/concepts/secret-security/secret-scanning)
- [GitHub dependency review](https://docs.github.com/en/code-security/concepts/supply-chain-security/dependency-review)
- [GitLab application security testing](https://docs.gitlab.com/user/application_security/)
