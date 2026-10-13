# Verglos Final V1 Product Contract — Approved

**Draft date:** 2026-10-12; competitive-product amendment requested 2026-10-13
**Owner:** Top Notchh Solutions
**Product:** Verglos
**Native V1 languages:** TypeScript and JavaScript
**Status:** approved product contract; canonical implementation target; does not close backlog items
**Competitive amendment status:** requested by the owner on 2026-10-13; it
becomes the synchronized implementation contract after the owner confirms the
expanded agentic/real-target scope below.

**Coverage authority:**
`FINAL_V1_FEATURE_COVERAGE_MATRIX_2026-10-13.md` maps every feature in this
contract to the existing backlog families, plan surfaces, current
implementation truth, and acceptance evidence. It is an index only; this
contract remains the product decision and the backlog remains the checkbox
authority.

This document is the approved product contract for Verglos Final V1. It
replaces conflicting informal descriptions. It is a contract for what we will
build and test, not proof that every capability is already implemented.

## 0. Competitive-product amendment — 2026-10-13

The original contract described the safety substrate for Hunt, but it did not
describe enough customer-visible capability to compete with autonomous
security-testing products. This amendment is part of the implementation target.
It does not claim that the new capability is already shipped.

Verglos Final V1 must be a real security decision and attack-verification
product for TypeScript/JavaScript teams, not a collection of static rules or
fixture demonstrations. Its competitive outcome is:

```text
Scan the real project
  -> understand the finding and reachable application surface
  -> form a bounded attack hypothesis
  -> execute an approved attack playbook against an authorized local/private target
  -> independently reproduce or reject the behavior
  -> bind proof, limitations, policy, and provenance into a Release Record
  -> block or approve the release
```

Verglos must not claim to be better than a competitor merely because it has
more named agents. The competitive claim is earned only by a held-out
TypeScript/JavaScript benchmark that measures verified-finding recall, false
positive rate, attack-surface coverage, proof reproducibility, time to proof,
source-privacy behavior, cost, and containment. The benchmark must compare the
same authorized targets and disclose unsupported cases and failures.

### 0.1 Required final product surfaces

The implementation target covers all of the following surfaces together:

1. **Scanner and coverage layer:** native TypeScript/JavaScript analysis across
   the ten customer domains, dependency and secret analysis, provenance,
   SBOM/import support, Trivy image/artifact evidence, and explicit coverage
   manifests.
2. **Autonomous Hunt layer:** finding-guided reconnaissance, attack planning,
   bounded execution, independent proof, and release auditing against a real
   authorized local or private TypeScript/JavaScript application—not only
   synthetic fixtures.
3. **MCP/AI layer:** the same scanner, Hunt, policy, entitlement, and record
   contracts are available to coding agents without giving an AI model
   arbitrary shell, network, signing, approval, billing, or source-mutation
   authority.
4. **Evidence layer:** portable signed `.vgl` Release Records bind the exact
   source/artifact subject, engine runs, Hunt attempts, proofs, policy,
   approvals, provenance, limitations, and final decision.
5. **Web and organization layer:** personal and shared history, policies,
   approvals, audit events, SCM checks, client handoffs, public verification,
   private runners, and enterprise governance are real plan-controlled
   workflows, not decorative dashboard pages.
6. **Commercial layer:** Free, Pro, Team, Studio, and Enterprise each provide
   a coherent customer outcome, with cards-only prepaid fixed terms and manual
   renewal; no plan may advertise a capability that its supported path cannot
   execute and evidence.

### 0.2 Hunt is an agentic workflow, not a plain rule runner

The final Hunt workflow has five controlled roles. They may be implemented as
one local orchestrator with bounded workers or as separately scheduled agents;
the contract does not require a meaningless swarm count.

1. **Scout/Context Agent** builds a target manifest from the authorized local
   project: framework, routes, APIs, test entry points, dependency boundaries,
   agent/MCP tools, and reachable sinks. It may use models for reasoning, but
   it may not upload source or expand the target scope silently.
2. **Attack-Hypothesis Agent** maps a scanner finding and target context to an
   approved attack family and emits a declarative, signed execution plan. It
   may propose inputs and sequences only within the recipe schema; it may not
   emit arbitrary shell or approve itself.
3. **Attack-Worker Fleet** runs the approved family playbooks against the
   authorized target. Workers may exercise a packaged app, test server,
   OpenAPI-described endpoint, or approved fixture inside the declared
   boundary. Each worker has explicit network, process, filesystem, resource,
   timeout, and cleanup limits.
4. **Proof/Counterexample Agent** independently replays the candidate behavior,
   runs negative controls, and classifies confirmed, not reproduced,
   inconclusive, unsupported, or environment failure. A model suggestion is
   never proof by itself.
5. **Release Auditor Agent** checks subject identity, evidence completeness,
   policy, approvals, provenance, limitations, and plan entitlement before
   producing a Release Record decision. It cannot waive a failed control.

### 0.3 Minimum V1 attack-verification catalogue

The V1 catalogue must contain real target adapters and positive, negative,
timeout, infrastructure-failure, and unsupported fixtures for these families:

- SQL/NoSQL and other injection paths;
- command and code-execution boundaries;
- path traversal and file-boundary access;
- SSRF and unsafe outbound requests;
- authentication, authorization, IDOR, mass assignment, and tenant isolation;
- XSS and unsafe HTML/template sinks;
- prototype pollution, unsafe deserialization, and parser boundaries;
- secrets and credential-use paths;
- dependency/supply-chain and malicious-package behavior;
- AI-agent/MCP tool boundaries, prompt-to-tool escalation, and approval bypass.

The existing A1 probes and A2 harnesses remain safety and regression fixtures.
They are not counted as full real-application coverage until the corresponding
target adapter, attack plan, proof, and held-out application evidence exist.

### 0.3.1 Scanner-to-Hunt decision chain

Hunt is downstream of the complete Verglos evidence graph. It must never be a
separate collection of unrelated attack demos:

```text
Native scanner / SCA / secrets / provenance / Trivy / imports
  -> immutable subject + coverage manifest + normalized finding
  -> rule-to-playbook mapping and target capability check
  -> Scout target manifest and attack hypothesis
  -> exact approval + entitlement + signed playbook
  -> bounded attack worker and counterexample
  -> Hunt evidence attached to the same finding/observation
  -> policy evaluation and Release Record
  -> CLI, MCP, Web, SCM, monitoring, and release decision
```

Every normalized finding that can be hunted must carry a stable rule ID,
domain, subject ID, observation ID, location or target reference, confidence,
severity, evidence class, and limitation. The playbook registry maps that rule
ID and target type to the exact supported adapter, required inputs, attack
sequence, safe control, proof method, and plan entitlement.

The planner may select only a playbook whose rule mapping, target capability,
subject identity, and coverage state are all valid. If a mapping or target
adapter is absent, Hunt returns `unsupported` or `not_attemptable`; it may not
invent a new recipe from model output. Hunt proof enriches the original
finding/observation and never creates a second uncorrelated severity model.

The same chain applies to every plan. Free uses the local scanner and local
starter playbooks; Pro adds the full local target and proof workflow; Team and
above add shared policy, SCM context, private runners, organization approvals,
and hosted record/audit projections. No hosted feature may bypass the local
finding, target, approval, or evidence contract.

### 0.4 Plan value for the competitive product

The plan boundary is capability and operating scope, not an artificial split
between a useful product and a demo:

- **Free:** unlimited local scanner, ten-domain coverage where the local
  engines support it, local dependency/secret/Trivy checks, safe MCP tools,
  local evidence verification, and a starter set of bounded Hunt playbooks
  against the developer's own local test targets.
- **Pro:** everything in Free plus the complete supported local TS/JS Hunt
  workflow: Scout, hypothesis planning, all qualified playbook families,
  proof/counterexamples, local/private app targets, full MCP Hunt path, signed
  local `.vgl` records, and personal hosted history.
- **Team:** everything in Pro plus shared Verglos organization policies,
  approvals, baselines, shared records, GitHub/GitLab PR checks, repository
  bindings, team audit history, and an authorized private runner for shared
  targets where configured.
- **Studio:** everything in Team plus isolated client workspaces, multi-client
  Hunt campaigns, redacted handoff/public verification, client-facing release
  evidence, and managed workflow allowances with explicit retention and cost
  limits.
- **Enterprise:** everything in Studio plus private runners, organization-wide
  policy and agent controls, private registry/image workflows, customer trust
  roots/KMS/HSM options, SSO/SCIM, retention/residency, audit export, custom
  adapters, and contracted support.

No plan promises unrestricted internet exploitation, arbitrary customer-code
execution, unlimited managed model calls, or silent source upload. The value
comes from verified security decisions and evidence, not from exposing a
dangerous shell to an AI agent.

The approved execution boundary for this goal is Points 1–5 in Section 14:
freeze and synchronize the contract, implement the real Hunt/public CLI path,
connect Web entitlements/Attest/Release Records, and test the npm package on
public TypeScript/JavaScript repositories. The goal stops after Point 5. npm
publication, held-out POC/experiments, and the final release decision are
deferred to the next goal and must not be represented as complete here.

No backlog checkbox, release claim, entitlement, payment state, or legal state
is changed by creating or approving this document. A capability becomes shipped
only after code, tests, runtime evidence, and the applicable acceptance record
are present in the private shipping tracker.

## 1. The product promise

Verglos is a security decision layer between code being changed and software
being released:

```text
Inspect -> Decide -> Prove -> Approve or block -> Monitor
```

Verglos is not only a pattern scanner. Final V1 combines:

- a terminal-first local CLI;
- native TypeScript/JavaScript security analysis;
- software-supply-chain and artifact evidence;
- MCP tools for AI-assisted development;
- agentic, finding-guided Hunt verification for selected findings;
- portable `.vgl` Release Records;
- optional Web collaboration and organizational memory;
- GitHub/GitLab release checks for Team and above;
- plan entitlements and fixed-term prepaid billing.

Verglos is local-first, not local-only. Security work can remain on the
customer's machine, while Web adds collaboration, history, approvals,
monitoring, recipients, and governance.

Native scanners for languages other than TypeScript and JavaScript are a later
version. V1 may import evidence from other ecosystems, but must not claim
native support before it is implemented and qualified.

## 2. Customer value by plan

All plans use the same supported npm/CLI front door. Plans unlock capability;
they do not create separate Free, Pro, Team, Studio, and Enterprise binaries.

| Plan | Customer | What the customer receives in V1 |
| --- | --- | --- |
| **Free** | Individual developer or open-source maintainer | Unlimited local JS/TS scanning across the supported ten-domain coverage manifest, secrets, dependencies, provenance context, local Trivy/artifact checks, local HTML/JSON reports, pre-commit/CI use, safe MCP scanning, a starter Scout/Planner plus bounded Hunt pack against the developer's own test target, local evidence creation, and free record verification. No required account or hosted history. |
| **Pro** | Professional developer, consultant, or small product team | Everything in Free, the complete supported local Hunt workflow against real authorized TS/JS applications, all qualified playbook families, proof/counterexample runs, full MCP Hunt path, advanced rule packs, remediation workflow, signed local `.vgl` Release Records, private hosted records, personal dashboard, monitoring allowances, and manual prepaid renewal. |
| **Team** | Product engineering or security team | Everything in Pro, plus a Verglos organization, members and roles, shared policy and baseline, shared history, approvals, audit events, GitHub/GitLab pull-request checks, repository bindings, and configured private-runner execution for shared targets. |
| **Studio** | Agency or multi-client security team | Everything in Team, plus isolated client workspaces, multi-client Hunt campaigns, client separation, redacted handoff receipts, public verification workflows, white-label evidence, managed workflow allowances, and client-facing reporting. |
| **Enterprise** | Larger or regulated organization | Everything in Studio, plus contracted governance, private runners, private registry/image workflows, customer-controlled KMS/HSM options, retention and residency controls, SSO/SCIM, audit export, custom Hunt target adapters/playbooks, organization-wide agent policy, and support obligations. |

### 2.1 Launch pricing

The launch catalog is:

| Plan | Launch price | Billing behavior |
| --- | ---: | --- |
| Free | `$0` | No payment required. |
| Pro | `$29/month` | One-time prepaid fixed term; customer manually renews. |
| Team | `$99/month` | One-time prepaid fixed term; customer manually renews. |
| Studio | `$249/month` | One-time prepaid fixed term; customer manually renews. |
| Enterprise | Custom | Contracted fixed term and scope. |

Annual offers may be prepaid at ten months of the monthly price. No plan
promises automatic recurring card renewal in V1.

These prices are launch prices, not a promise that future versions cannot
change price. Any price change must use a new catalog version and must not
silently change an existing paid entitlement.

### 2.2 Margin and usage principle

Verglos does not charge for ordinary work performed on the customer's machine.
That includes local scanning, local reports, local supported Hunt, local Trivy,
and local record verification.

Verglos charges for hosted value and managed cost:

- hosted history and retention;
- seats, organizations, and shared policy;
- monitoring and alert delivery;
- approvals and audit workflows;
- public verification traffic;
- client workspaces and white-label delivery;
- managed Hunt, managed image scanning, or hosted AI compute;
- private runners and enterprise support.

Hosted allowances must be explicit. Cheap plans must not promise unlimited
server-side scanning, unlimited artifact storage, unlimited public verification
traffic, or unlimited managed Hunt.

## 3. Local data plane and Web control plane

The same CLI workflow is available from a terminal, CI runner, pre-commit hook,
or compatible MCP client:

```text
Inspect project or artifact
  -> run native and imported engines
  -> apply local policy
  -> run bounded Hunt when entitled
  -> create or verify local evidence
  -> optionally sync approved/redacted evidence to Web
```

### 3.1 Customer-controlled local data plane

The local data plane may perform:

- TypeScript/JavaScript source analysis;
- secrets and dependency analysis;
- Git and provenance inspection;
- Docker/OCI and SBOM analysis through supported engines;
- policy evaluation;
- supported local Hunt recipes;
- Release Record creation and verification;
- local HTML, JSON, and `.vgl` output;
- CI and pre-commit enforcement;
- MCP pre-write, scan, explanation, and supported workflow checks.

Source code does not need to be uploaded for ordinary local work.

### 3.2 Optional hosted control plane

Web provides:

- account and entitlement management;
- billing and fixed-term renewal;
- Verglos organizations and roles;
- versioned shared policies and baselines;
- hosted private records;
- monitoring and alerts;
- approvals and audit events;
- GitHub/GitLab repository bindings;
- PR checks and release decisions;
- recipient and client views;
- public verification where the plan permits it.

The Web plane must never silently grant paid capabilities because a user edited a
local plan string, cached file, request body, or browser state. The entitlement
service signs the plan, scope, catalog version, and expiry; the CLI verifies it.

## 4. Security coverage contract

### 4.1 SAST

SAST means static application security testing: analyzing source and
configuration without running the customer's application. Verglos-native V1
analysis covers TypeScript/JavaScript patterns such as:

- SQL, NoSQL, and command injection;
- XSS and unsafe HTML sinks;
- path traversal and unsafe file access;
- SSRF;
- authentication and session mistakes;
- authorization, IDOR, tenant isolation, and mass assignment patterns;
- secrets and sensitive data leakage;
- weak cryptography and insecure token generation;
- insecure API defaults and security headers;
- AI-generated insecure coding patterns;
- agent and MCP configuration risks.

The rule catalogue must report rule ID, domain, severity, confidence,
location, explanation, fix guidance, evidence class, and limitations.

### 4.2 The V1 customer-facing domain map

The final V1 coverage map has ten customer-facing security domains. Agent/MCP
security is a cross-cutting overlay and is separately visible in reports.

| Domain | V1 meaning |
| --- | --- |
| D1 Input and injection | SQL, NoSQL, command, XSS, unsafe parsing, and related injection sinks. |
| D2 Authentication and sessions | JWT, cookies, sessions, password handling, token generation, and authentication flow mistakes. |
| D3 Authorization and tenancy | IDOR, missing ownership checks, mass assignment, cross-tenant access, and authorization gaps. |
| D4 Secrets, cryptography, and leakage | Hardcoded credentials, exposed secrets, weak hashing, unsafe randomness, and sensitive error/log output. |
| D5 Configuration and secure defaults | CORS, framework defaults, permissive generated configuration, and security-header gaps. |
| D6 Dependencies and software supply chain | Vulnerable packages, typosquats, hallucinated packages, vendored CVEs, package provenance, and SBOM relationships. |
| D7 API and service hardening | Rate limits, request controls, authentication-adjacent route hardening, and API exposure. |
| D8 Source and release provenance | Git history, dirty state, build evidence, artifact identity, and release lineage. |
| D9 Network and file-boundary risks | SSRF, path/file boundary risks, unsafe outbound access, and related local-to-network transitions. |
| D10 Containers, IaC, and shipped artifacts | Docker/OCI image, OS package, IaC, image configuration, license, SBOM, and artifact evidence. |

The implementation must not claim that every rule in every domain is complete.
Reports must show domain coverage, unsupported areas, skipped engines, stale
databases, and failures. Internal rule identifiers may evolve, but the
customer-facing coverage manifest must remain versioned.

### 4.3 Software supply-chain coverage

Supply-chain coverage includes:

- npm dependency and lockfile analysis;
- known vulnerability and advisory evidence;
- malicious, typosquatted, or hallucinated package signals;
- vendored dependency and CVE evidence;
- package and build provenance;
- CycloneDX and SPDX SBOM import and verification;
- VEX and in-toto/SLSA evidence where supported;
- Docker/OCI image and OS-package evidence;
- license and NOTICE evidence;
- exact artifact digest binding.

### 4.4 No false DAST promise

Verglos V1 is not an unrestricted internet pentesting service and it does not
silently attack customer production systems. It does include authorized
dynamic attack-verification against a real local or private TypeScript/JavaScript
application through the Hunt target adapters defined in Section 0.3. This is
the dynamic capability that differentiates the final product from SAST-only
tooling.

Verglos may:

- perform bounded local verification through approved Hunt playbooks;
- run customer-authorized tests inside an explicit local or private runner;
- start or connect to a customer-provided test target with an exact health,
  route, process, and teardown contract;
- send only playbook-authorized requests to the target and record the exact
  target scope, request class, response evidence, and negative control;
- import external DAST/SARIF evidence and correlate it with native evidence;
- preserve the source, artifact, policy, and release decision in one record.

Unscoped remote assessment, production exploitation, and unrestricted internet
attack campaigns remain separately scoped capabilities. Enterprise or managed
private runners may support remote targets only when the customer contract
contains an explicit target, authorization, network, retention, and teardown
scope.

## 5. Trivy and external engines

Trivy is an open-source Apache-licensed scanner maintained by Aqua. It scans
targets such as container images, filesystems, repositories, virtual-machine
images, and Kubernetes, and can identify vulnerabilities, package data,
misconfigurations, secrets, licenses, and SBOM relationships.

Verglos uses Trivy as a replaceable evidence engine, not as the Verglos product
or policy model.

### 5.1 Trivy workflow

For an image or artifact, Verglos must:

1. Resolve a tag to an immutable digest.
2. Run the pinned, verified Trivy version against that subject.
3. Preserve raw output and engine metadata.
4. Normalize observations into the Verglos evidence schema.
5. Correlate Trivy findings with native rules and imported evidence.
6. Apply Verglos policy and release thresholds.
7. Run supported Hunt verification only where a recipe exists.
8. Create a Release Record bound to the exact subject digest.

Every engine run records source, version, executable or image digest, database
or check-bundle version, configuration digest, timestamp, coverage, and errors.

If Trivy is unavailable, incompatible, stale beyond policy, or missing required
data, the affected coverage is `INCOMPLETE`; it is never treated as zero
findings or a PASS.

The engine manager must support verified system binaries, explicit Verglos
managed caches, customer mirrors, and offline sources. It must reject checksum
or signature mismatch, path traversal, unexpected archive members, and partial
updates. It must not silently download or execute an arbitrary same-named
binary from PATH.

Verglos must also support imported SARIF, CycloneDX, SPDX, VEX, in-toto, SLSA,
and approved attestation evidence. Removing or replacing Trivy must not corrupt
existing evidence or break native scanning, policy, records, verification, or
monitoring.

## 6. Hunt: bounded attack-verification

Hunt adds evidence to selected findings. It is not an unrestricted autonomous
pentester and never runs arbitrary model-generated shell.

### 6.1 Hunt roles

The final architecture has five controlled roles:

1. **Scout/Context Agent:** maps the authorized local/private target and the
   finding context.
2. **Attack-Hypothesis Agent:** selects an approved playbook and produces a
   signed declarative plan; it never produces arbitrary shell.
3. **Attack Worker Fleet:** runs family-specific signed adapters against the
   exact target boundary.
4. **Proof/Counterexample Agent:** independently replays the behavior and
   classifies the result.
5. **Release Auditor Agent:** checks evidence, entitlement, provenance,
   policy, approvals, and limitations before the release decision.

These are controlled product roles. They are not permission for an AI model to
invent shell commands, access arbitrary systems, or approve its own result.
The product may run the roles in one local orchestrator, but every boundary,
playbook, worker, and decision remains separately observable and auditable.

### 6.2 Plan availability

- Free receives a small, safe local Hunt starter pack and local target support.
- Pro receives the complete supported local Hunt workflow, all qualified
  playbook families, and MCP Hunt workflows.
- Team receives Pro Hunt plus shared policy, approvals, organization records,
  SCM checks, and configured private-runner execution.
- Studio receives Team Hunt plus isolated client campaigns, redaction, and
  recipient/handoff workflows.
- Enterprise may receive private runners, customer recipes, custom target
  adapters, and contracted managed execution.

### 6.3 Recipe requirements

Each recipe is signed, declarative, digest-pinned, versioned, and license
recorded. It declares:

- supported detector and finding IDs;
- target type and required fixture;
- exact input and expected vulnerable behavior;
- expected safe behavior;
- command or adapter identity;
- network policy;
- CPU, memory, process, file, output, and wall-clock limits;
- cleanup and teardown behavior;
- evidence fields and redaction rules;
- positive, negative, timeout, and failure fixtures.

The first V1 playbook catalogue is:

- SQL/NoSQL injection verification;
- command injection verification;
- path traversal verification;
- SSRF verification;
- agent/MCP surface verification;
- XSS verification where a safe local fixture exists;
- authorization, tenant-isolation, and mass-assignment verification;
- prototype-pollution, unsafe-deserialization, and parser-boundary verification;
- secret and credential-use verification;
- dependency/supply-chain and malicious-package verification;
- AI-agent/MCP tool-boundary and approval-bypass verification.

Each playbook must include a real target adapter or a documented reason why
the family is limited to a fixture in the current release. Recipes are added
only when their safety boundary, fixtures, provenance, license, target
contract, proof method, and failure behavior are documented. A playbook
catalogue is not a claim that every possible vulnerability can be exploited or
proven.

### 6.4 Required isolation behavior

Default Hunt behavior is:

- read-only project input;
- an explicit target manifest and target authorization;
- no host Docker socket;
- no host secrets, personal files, or unrestricted device access;
- network disabled by default; target traffic may use only loopback or an
  explicitly approved private destination declared in the target contract;
- bounded CPU, memory, processes, files, output, and time;
- deterministic cleanup;
- structured result and visible limitations;
- fail-closed behavior when the declared boundary is unavailable.

Hunt must be reachable through the supported public CLI distribution. A private
workspace package, undocumented binary, or implicit executable download is not
shipped customer functionality.

## 7. Attest and portable Release Records

Attest is the customer-facing proof workflow. It is not a Studio-only feature.

### 7.1 Evidence types

Verglos distinguishes:

1. **Release provenance:** npm, in-toto, Sigstore, build, and artifact evidence
   showing how something was produced.
2. **Imported attestations:** GitHub, Docker, CycloneDX, SPDX, SARIF, VEX,
   in-toto, SLSA, and other approved evidence.
3. **Customer Release Record:** a portable signed `.vgl` record containing the
   immutable subject, coverage, observations, engine metadata, policy, Hunt
   results, exceptions, approvals, limitations, and final decision.

### 7.2 Attest by plan

- **Free:** create local evidence and verify received records. No hosted history,
  organization signing, or public verification service.
- **Pro:** create and sign local `.vgl` records, verify them offline, and store
  approved private records in the personal dashboard.
- **Team:** sign against organization policy, collect approvals, and maintain
  shared records and audit events.
- **Studio:** publish approved verification views, create client handoff
  receipts, and use white-label evidence.
- **Enterprise:** use customer-controlled signing roots, KMS/HSM, private
  verification, retention, residency, and complete audit export.

Record verification must remain possible offline and must not require trusting
the Web server. Public verification must expose only approved/redacted data.
Source code is not uploaded merely to create or verify a local record.

## 8. MCP and AI-assisted development

The MCP server is an interface to the same scanner, policy, entitlement, Hunt,
and record contracts. It is not a second security implementation. It exposes
the agentic Hunt workflow as controlled tools: inspect target, select or plan a
supported playbook, request approval, execute inside the declared boundary,
inspect proof, and project the Release Record decision.

Free MCP capabilities include safe scan, package, pre-write, and explanation
tools, plus the Free Hunt starter workflow. Pro and above may invoke the full
supported Hunt, remediation, and Release Record workflows according to the same
authorization as the CLI. Team and above add shared policy, organization
approvals, SCM context, private-runner targeting, and audit projection.

MCP Hunt must support the same target manifest, playbook digest, plan digest,
approval receipt, entitlement, observation, proof, and redaction bindings as
the CLI. An MCP client must be able to tell whether a result was actually
executed, merely planned, unsupported, denied, or unavailable.

An MCP or AI agent must never silently:

- approve an exception;
- sign a release;
- publish evidence;
- install an engine;
- enable networked Hunt;
- change policy;
- modify source code;
- change billing or entitlements.

The invoking user must authorize those actions through the corresponding CLI or
Web control.

## 9. Verglos organizations and GitHub/GitLab

### 9.1 Verglos organization

A Verglos organization is a Web workspace containing members, roles, projects,
policies, baselines, records, approvals, audit events, entitlements, and
repository bindings.

### 9.2 GitHub/GitLab organization

A GitHub or GitLab organization is an external SCM container containing
repositories, members, pull requests, installations, and webhooks.

They are not the same organization. A binding connects them using stable
provider organization, installation, and repository identifiers. A normal
GitHub login authenticates a person; it does not by itself install the Verglos
integration or authorize repository webhooks.

### 9.3 Plan behavior

- Free: no Verglos organization is required.
- Pro: personal dashboard and records; SCM integration is optional.
- Team: Verglos organization, shared controls, and GitHub/GitLab PR checks.
- Studio: Team integration plus separated client workspaces.
- Enterprise: organization hierarchy, private runners, enterprise identity,
  residency, and audit controls.

The TopNotchh GitHub organization is the authorized company test organization.
Public TypeScript/JavaScript repositories may be forked there for testing. A
test fork must retain its license and NOTICE obligations. Customer repositories
require a separate private consent record.

## 10. Billing and entitlement contract

Paid plans use one-time prepaid card payments for a fixed term:

```text
Card payment
  -> provider webhook
  -> payment ledger
  -> signed entitlement
  -> expiry
  -> customer chooses Renew and pays again
```

Required behavior:

- Free requires no payment.
- A captured payment binds to the exact user or organization, plan, catalog
  version, amount, currency, and entitlement term.
- Webhook processing is authenticated, idempotent, ordered where required, and
  fail closed on ambiguity.
- Duplicate, retry, timeout, failure, refund, and expiry paths are tested.
- Expiry removes paid capability but does not delete evidence.
- Renewal is a new one-time purchase.
- Production never uses Test Mode keys, guessed prices, synthetic provider
  events, or manual payment/entitlement row edits.

Existing recurring-subscription code may remain only as a compatibility boundary
until the fixed-term prepaid path is implemented and the old promise is removed
from customer-facing surfaces.

## 11. Web, CLI, and release truth

The public Web surface, CLI help, MCP descriptions, plan catalog, README,
pricing pages, and shipping documents must describe the same contract.

The following claims are distinct and must not be mixed:

- designed;
- implemented;
- tested;
- evidenced;
- shipped;
- generally available.

The public product must not claim full Hunt, Attest, organization SCM, image
scanning, or multi-language support until those paths are actually available in
the supported distribution and have acceptance evidence.

## 12. Approval-gated execution scope

After this contract is approved, the shipping goal will execute these stages in
order:

### Point 1 — Freeze the final contract

Approve this document as the only V1 product direction. Record any decision
change explicitly rather than maintaining conflicting informal promises.

### Point 2 — Synchronize the product documents

Update together:

- company feature map;
- architecture blueprint;
- product contract;
- backlog;
- execution ledger;
- status and score summary;
- active shipping goal;
- CLI, Web, and MCP plan capability registries;
- pricing and customer-facing product copy.

The synchronization batch must preserve the backlog score and must not check a
feature merely because the contract now mentions it.

### Point 3 — Implement the real Hunt and public CLI path

Implement and test the scanner-to-Hunt chain: normalized scanner/SCA/secrets/
provenance/Trivy findings, rule-to-playbook mappings, target manifests, Scout
and hypothesis planning, real local/private TS/JS target adapters, bounded
worker execution, proof/counterexample runs, structured verdicts, plan gating,
MCP parity, recipe provenance, and failure behavior. The public CLI path must
reach this workflow from a clean supported npm consumer.

### Point 4 — Connect Web entitlements, plans, Attest, and Release Records

Implement and test:

- Free/Pro/Team/Studio/Enterprise capability alignment;
- scanner finding, target, playbook, proof, policy, and Release Record
  continuity across every plan;
- Free local evidence and verification;
- Pro signed `.vgl` creation and private records;
- Team organization policy and approvals;
- Studio public verification and client handoffs;
- Enterprise contracted controls;
- CLI/Web/MCP entitlement consistency;
- fixed-term prepaid payment and expiry behavior;
- record creation, signing, offline verification, and redacted hosted views.
- agentic Hunt planning, execution, proof, and audit projections with the same
  entitlement and approval contract.

### Point 5 — Test the npm package on public TypeScript/JavaScript repositories

Install the supported npm package from a clean environment and run it against
an authorized corpus of public TypeScript/JavaScript repositories and
TopNotchh-owned forks. Test:

- clean installation and CLI help;
- scan correctness and expected findings;
- clean-project behavior;
- dependency and secret checks;
- native and imported evidence;
- Docker/Trivy paths where the repository contains those targets;
- MCP scan path;
- scanner-to-Hunt playbook selection and limitations;
- real authorized TS/JS target execution, positive/negative controls, proof
  reproducibility, and unsupported-target behavior;
- Release Record creation and verification;
- Free, Pro, Team, Studio, and Enterprise behavior where applicable;
- repeatability, performance, failure handling, and no-source-upload claims.
- competitive benchmark metrics defined in Section 0, with no superiority claim
  unless the held-out comparison supports it.

The active shipping goal stops after Point 5. It does not publish the npm
release, run the held-out POC campaign, or issue the final release decision in
this phase.

## 13. Deferred after Point 5

These are explicitly outside the stopping boundary of the current goal:

6. Publish the npm release.
7. Run experiments and the held-out POC corpus.
8. Record the final release decision and campaign readiness.

Publishing, experiments, POC, and final release approval require a new goal or
an explicit continuation after Point 5 evidence is reviewed.

## 14. Acceptance and evidence rules

For every implementation batch:

1. Select the first dependency-ready unchecked item from
   `docs/shipping/VERGLOS_V1_BACKLOG.md`.
2. Identify the repository, acceptance condition, and product contract section.
3. Implement the smallest complete change.
4. Run focused tests and the relevant build, schema, hosted, or browser matrix.
5. Record commands, commit SHA, results, limitations, and external dependencies
   in private evidence.
6. Update `EXECUTION_LEDGER.md`, `STATUS.md`, and the score summary.
7. Check the backlog box only when its complete acceptance condition is met.
8. Recompute the score from the checkbox file.
9. Report the score, checkbox changed, implementation summary, evidence, and
   next dependency-ready item.

External provider limitations, customer consent, legal review, or independent
security review must be recorded honestly. AI may draft documents and analyze
results, but may not fabricate signatures, approvals, consent, or evidence.

## 15. Current implementation truth

This draft does not claim that Final V1 is complete. Before approval, the
current code contains partial foundations and legacy shells in several areas,
including the public Hunt path, Attest command, plan registries, hosted
organization workflows, and full engine/image integration.

Those gaps become implementation work under Points 2–5. The contract does not
hide them and does not close their backlog items automatically.

**Approval decision:** APPROVED for implementation and Point-5 qualification

**Approved by:** Anurag Yadav, Top Notchh Solutions
**Approval date:** 2026-10-12
