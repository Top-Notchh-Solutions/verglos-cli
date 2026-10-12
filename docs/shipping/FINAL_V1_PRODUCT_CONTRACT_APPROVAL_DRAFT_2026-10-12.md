# Verglos Final V1 Product Contract — Approved

**Draft date:** 2026-10-12
**Owner:** Top Notchh Solutions
**Product:** Verglos
**Native V1 languages:** TypeScript and JavaScript
**Status:** approved product contract; canonical implementation target; does not close backlog items

**Coverage authority:**
`FINAL_V1_FEATURE_COVERAGE_MATRIX_2026-10-13.md` maps every feature in this
contract to the existing backlog families, plan surfaces, current
implementation truth, and acceptance evidence. It is an index only; this
contract remains the product decision and the backlog remains the checkbox
authority.

This document is the approved product contract for Verglos Final V1. It
replaces conflicting informal descriptions. It is a contract for what we will
build and test, not proof that every capability is already implemented.

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
- bounded Hunt verification for selected findings;
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
| **Free** | Individual developer or open-source maintainer | Unlimited local JS/TS scanning, secrets, dependencies, provenance context, basic supply-chain checks, local HTML/JSON reports, pre-commit/CI use, basic MCP scanning, a bounded Hunt starter pack, local evidence creation, and free record verification. No required account or hosted history. |
| **Pro** | Professional developer, consultant, or small product team | Everything in Free, the full supported Hunt catalogue, advanced rule packs, remediation workflow, signed local `.vgl` Release Records, private hosted records, personal dashboard, monitoring allowances, and manual prepaid renewal. |
| **Team** | Product engineering or security team | Everything in Pro, plus a Verglos organization, members and roles, shared policy and baseline, shared history, approvals, audit events, and GitHub/GitLab pull-request checks. |
| **Studio** | Agency or multi-client security team | Everything in Team, plus client workspaces, client separation, handoff receipts, public verification workflows, white-label evidence, and client-facing reporting. |
| **Enterprise** | Larger or regulated organization | Everything in Studio, plus contracted governance, private runners, customer-controlled KMS/HSM options, retention and residency controls, SSO/SCIM, audit export, custom adapters, and support obligations. |

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

Verglos V1 is not a general remote DAST or unrestricted internet pentesting
service. It does not silently attack customer production systems.

Verglos may:

- perform bounded local verification through approved Hunt recipes;
- run customer-authorized tests inside an explicit local or private runner;
- import external DAST/SARIF evidence and correlate it with native evidence;
- preserve the source, artifact, policy, and release decision in one record.

Dynamic remote assessment is a later separately scoped product capability.

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

The final architecture has four controlled roles:

1. **Planner/Scout:** selects an approved recipe based on a supported finding.
2. **Attack Worker:** executes only the signed recipe inside the declared
   boundary.
3. **Proof Adjudicator:** classifies output as confirmed, not reproduced,
   inconclusive, unsupported, or environment failure.
4. **Release Auditor:** binds the result, limitations, and coverage to policy
   and the Release Record.

These are controlled product roles. They are not permission for an AI model to
invent shell commands, access arbitrary systems, or approve its own result.

### 6.2 Plan availability

- Free receives a small, safe local Hunt starter pack.
- Pro receives the full supported local Hunt catalogue and MCP Hunt workflows.
- Team receives Pro Hunt plus shared policy, approvals, and organization records.
- Studio receives Team Hunt plus client and recipient workflows.
- Enterprise may receive private runners, customer recipes, and contracted
  managed execution.

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

The first V1 recipe catalogue is:

- SQL/NoSQL injection verification;
- command injection verification;
- path traversal verification;
- SSRF verification;
- agent/MCP surface verification;
- XSS verification where a safe local fixture exists;
- authorization, tenant-isolation, and mass-assignment verification where a
  deterministic fixture and safe adapter exist.

Recipes are added only when their safety boundary, fixtures, provenance,
license, and failure behavior are documented. A recipe catalogue is not a
claim that every possible vulnerability can be exploited or proven.

### 6.4 Required isolation behavior

Default Hunt behavior is:

- read-only project input;
- no host Docker socket;
- no host secrets, personal files, or unrestricted device access;
- network disabled unless an explicitly approved recipe requires it;
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
and record contracts. It is not a second security implementation.

Free MCP capabilities include safe scan, package, pre-write, and explanation
tools. Pro and above may invoke supported Hunt, remediation, and Release Record
workflows according to the same authorization as the CLI.

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

Implement and test the approved recipe catalogue, supported public CLI command
path, bounded runtime, structured verdicts, plan gating, MCP parity, recipe
provenance, and failure behavior.

### Point 4 — Connect Web entitlements, plans, Attest, and Release Records

Implement and test:

- Free/Pro/Team/Studio/Enterprise capability alignment;
- Free local evidence and verification;
- Pro signed `.vgl` creation and private records;
- Team organization policy and approvals;
- Studio public verification and client handoffs;
- Enterprise contracted controls;
- CLI/Web/MCP entitlement consistency;
- fixed-term prepaid payment and expiry behavior;
- record creation, signing, offline verification, and redacted hosted views.

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
- Hunt recipes and limitations;
- Release Record creation and verification;
- Free, Pro, Team, Studio, and Enterprise behavior where applicable;
- repeatability, performance, failure handling, and no-source-upload claims.

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
