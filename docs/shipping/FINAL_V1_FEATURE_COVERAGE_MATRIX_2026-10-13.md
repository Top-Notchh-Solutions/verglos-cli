# Verglos Final V1 feature-to-backlog coverage matrix

**Owner:** Top Notchh Solutions  
**Status:** private implementation authority  
**Date:** 2026-10-13  
**Canonical contract:** `FINAL_V1_PRODUCT_CONTRACT_APPROVAL_DRAFT_2026-10-12.md`  
**Canonical goal:** `VERGLOS_V1_ACTIVE_GOAL_FINAL_EXECUTION_2026-10-13.md`
**Competitive research:** `COMPETITIVE_PRODUCT_RESEARCH_2026-10-13.md`
**Paying-value blueprint:** `FINAL_V1_PAYING_VALUE_BLUEPRINT_2026-10-13.md`

This matrix answers one question: **where is every promised Final V1 feature
implemented, and what evidence is still required before its backlog row can be
checked?** It is a cross-reference, not a second backlog and not a release
claim.

The private backlog remains the only source of checkbox state. This matrix does
not add or remove counted checkboxes. At this document revision the recorded
score was **228 checked / 52 unchecked / 280 total (81.4%)**. The live private
backlog has since been reconciled at **239 checked / 41 open / 280 total
(85.4%)** on 2026-10-21; the backlog and execution ledger are authoritative
for current checkbox state.

The paying-value blueprint is the companion authority for the customer problem,
plan outcome, economic guardrail, and acceptance metric for every surface in
this matrix. The contract and backlog remain the implementation and checkbox
authorities respectively.

## 0.1 Owner authorization checkpoint — 2026-10-14

The owner has authorized the bounded Preview, disposable-runner, SCM-test,
synthetic-recipient, protected-dry-run, legal/company-review, and acceptance-
preparation operations recorded in
`evidence/owner-authorization-2026-10-14.md`. This removes setup questions;
it does not satisfy the evidence column for any row. The independent AppSec
review remains a Hunt-specific human review against an exact unreleased CLI
commit, not a whole-product audit or npm-release requirement. Other surfaces
retain their own provider, legal, recipient, field, commercial, and release
acceptance conditions.

## 1. Product boundary

| Contract surface | Free | Pro | Team | Studio | Enterprise | Backlog anchors | Current truth / acceptance boundary |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Local `verglos` CLI and npm packages | Yes | Yes | Yes | Yes | Yes | `LOCAL-001..012`, `DIST-001..006`, `QUAL-CLI-001..006` | Core CLI/package surface is substantially implemented. Final package/release qualification remains open. |
| TypeScript/JavaScript source inspection | Baseline | Deep rules | Shared policy | Client-separated views | Custom/private controls | `ENGINE-001..015`, `TARGET-001..011`, `GRAPH-001..009` | Must report actual coverage, unsupported targets, stale engines, and failures. |
| Web account and hosted evidence | Optional/no account required | Private records/history | Organization control plane | Client workspaces/handoffs | Private governance | `PLAN-WEB-001..015`, `PRO-001..010`, `FINAL-WEB-001..008` | Web capability exists in code, but several hosted and final acceptance rows remain open. |
| MCP and AI-assisted development | Basic checks/explanations | Full Hunt/MCP depth | Shared policy/approvals | Client-safe handoff | Private runners/policy | `AGENT-001..007`, `HUNT-010` | MCP must never silently approve, sign, publish, mutate source, or bypass Hunt controls. |
| Attest and portable `.vgl` Release Records | Local verification/evidence | Signed local/private records | Shared approvals/audit | Public/client verification | Customer roots/KMS/HSM options | `RECORD-001..012`, `DIST-001..006` | Record contract is defined; end-to-end hosted and release evidence is not yet universally complete. |
| Scanner-to-proof Hunt verification | Starter local playbooks | Full local code-to-proof workflow | Shared org policy, approvals, and private targets | Client campaigns, redacted handoff, retest evidence | Private runners/custom adapters/playbooks | `HUNT-001..011`, `QUAL-CLI-004`, `TARGET-*`, `GRAPH-*` | The catalog contains eight A1 deterministic fixture probes plus ten A2 target-harness descriptors with a pinned Docker execution path. Real target discovery, scanner-to-playbook mappings, remediation/retest, and complete per-family target-code acceptance remain open. |
| SCM organization workflows | Local/no integration required | Personal/private projects where enabled | GitHub/GitLab org checks | Client repositories | Enterprise governance | `TEAM-CLI-001..002`, `TEAM-WEB-*`, `GITHUB-WEB-*` | Code-side hardening is merged; hosted signer, installation, binding, webhook, and removal evidence remain separate gates. |
| Cards-only prepaid billing | Not required | One-time fixed term/manual renewal | Shared org entitlements | Client billing views | Contracted billing/governance | `PLAN-CLI-001..004`, `PLAN-WEB-001..015`, `PRO-*`, `ENT-*` | V1 does not promise automatic recurring renewal. Provider lifecycle acceptance remains evidence-driven. |

## 2. Security coverage promised to customers

Agent/MCP is a cross-cutting overlay and is not a new eleventh domain.

| Domain | Final V1 meaning | Evidence/implementation anchors | Required customer truth |
| --- | --- | --- | --- |
| D1 Input and injection | SQL/NoSQL, command, XSS, unsafe parsing, and injection sinks | `ENGINE-*`, `TARGET-*`, `HUNT-008` recipe sub-scopes | Show detector coverage and bounded verification where a supported recipe exists. |
| D2 Authentication and sessions | JWT, cookies, sessions, password/token handling, auth-flow mistakes | `ENGINE-*`, `POLICY-*`, Web route/entitlement rows | No claim beyond supported static evidence and declared limitations. |
| D3 Authorization and tenancy | IDOR, ownership, mass assignment, cross-tenant access | `GRAPH-*`, `POLICY-*`, `TEAM-*`, `FINAL-WEB-*` | Tenant and policy decisions must be bound to the correct organization. |
| D4 Secrets, crypto, and leakage | Secrets, weak hashing/randomness, exposed sensitive output | `ENGINE-*`, `IMPORT-*`, `LOCAL-*` | Redact evidence and never upload raw secrets or source by default. |
| D5 Configuration and secure defaults | CORS, headers, permissive defaults, generated configuration | `ENGINE-*`, `POLICY-*`, `QUAL-*` | Report missing/unsupported checks rather than treating silence as safe. |
| D6 Dependencies and supply chain | npm/lockfiles, advisories, typosquats, vendored CVEs, SBOM/provenance | `ENGINE-*`, `IMPORT-*`, `TARGET-*`, `DIST-*` | Preserve package/artifact identity and exact digest/commit evidence. |
| D7 API and service hardening | Request controls, rate limits, route exposure, service boundaries | `ENGINE-*`, `TARGET-*`, `QUAL-WEB-*` | Dynamic checks are bounded and authorized; no general remote DAST promise. |
| D8 Source and release provenance | Git state, build identity, artifact lineage, release evidence | `DIST-*`, `LIC-*`, `QUAL-CLI-*`, `RECORD-*` | Records must identify what was checked and which release it belongs to. |
| D9 Network and file boundaries | SSRF, path/file boundaries, local-to-network transitions | `ENGINE-*`, `HUNT-008`, `TEAM-CLI-001` | Network-denied Hunt is the default; unsafe endpoints fail closed. |
| D10 Containers, IaC, and shipped artifacts | Docker/OCI, OS packages, IaC, licenses, SBOM and image evidence | `ENGINE-*`, `IMPORT-*`, `TARGET-*`, Trivy workflow, `DIST-*` | Missing/stale external-engine evidence is `INCOMPLETE`, never `PASS`. |

## 3. Engines, imports, and evidence layers

| Capability | What Verglos owns | External component or format | Backlog anchors | State |
| --- | --- | --- | --- | --- |
| Native JS/TS inspection | Finding schema, normalization, severity, policy, coverage manifest | Verglos rules and parsers | `ENGINE-001..015`, `LOCAL-*` | Implemented in slices; remaining rows require their stated evidence. |
| Dependency and package analysis | Correlation, policy, provenance, release decision | npm metadata, lockfiles, advisories | `ENGINE-*`, `TARGET-*`, `GRAPH-*` | Contracted; do not claim every ecosystem/rule is complete. |
| Trivy integration | Pin/verify engine, invoke safely, normalize output, bind digest, preserve incomplete state | Trivy, open-source Apache-licensed scanner maintained by Aqua | `ENGINE-*`, `IMPORT-*`, `DIST-*` | Trivy is an replaceable evidence engine, not the Verglos product. |
| SARIF/SPDX/CycloneDX/VEX | Import validation, source identity, correlation, stale/missing handling | Standard evidence formats | `IMPORT-001..012` | Must preserve provenance and show unsupported/invalid imports. |
| in-toto/SLSA/release evidence | Bind build/release identity and verification result | in-toto/SLSA-compatible evidence | `DIST-*`, `LIC-*`, `QUAL-CLI-*` | Separate from `.vgl`; no automatic release claim from a local test. |
| Coverage and target manifest | Declare targets, domains, engines, skips, stale databases and failures | Versioned Verglos manifest | `TARGET-001..011`, `GRAPH-001..009` | Required in every final corpus and Release Record. |

## 4. Hunt scope and recipe catalogue

### 4.1 Architecture roles

The amended contract defines five controlled roles. They are not five
uncontrolled AI agents and they are not all currently running as autonomous
services.

1. **Scout/Context Agent** maps the authorized target and finding context.
2. **Attack-Hypothesis Agent** selects an approved playbook and emits a signed
   declarative plan.
3. **Attack Worker Fleet** executes family-specific signed adapters.
4. **Proof/Counterexample Agent** independently replays and classifies the
   result.
5. **Release Auditor Agent** binds proof, policy, entitlement, provenance, and
   limitations to the release decision.

AI may assist reasoning only within these controls. No model may generate
arbitrary shell, silently change policy, access customer source outside the
declared target, or approve its own result.

### 4.2 V1 recipe sub-scopes owned by HUNT-008

These are matrix sub-scopes, not new counted backlog rows. `HUNT-008` owns the
approved-rule/provenance/fixture catalogue; `HUNT-009` owns the public
functional command path; `HUNT-010` owns MCP exposure; `HUNT-011` owns
adversarial sandbox qualification.

| Matrix sub-scope | Intended verification | Required recipe characteristics | Current truth |
| --- | --- | --- | --- |
| `HUNT-008-R1` | SQL/NoSQL injection | Deterministic local fixture, no external database, safe adapter, positive/negative/timeout/failure cases | A1 classifier plus A2 descriptor/protocol and sanitized SQL/NoSQL reference harness; complete target-code qualification remains open. |
| `HUNT-008-R2` | Command injection | Non-privileged fixture, no host shell escape, denied network, cleanup | A1 classifier plus A2 descriptor/protocol and sanitized command-injection reference harness; complete target-code qualification remains open. |
| `HUNT-008-R3` | Path traversal/file boundary | Temporary fixture root, allowlisted files only, no host paths/devices | A1 classifier plus A2 descriptor/protocol and sanitized path-traversal reference harness; complete target-code qualification remains open. |
| `HUNT-008-R4` | SSRF | Local fake target only, network denied except declared fixture adapter | A1 classifier plus A2 descriptor/protocol and sanitized SSRF reference harness; complete target-code qualification remains open. |
| `HUNT-008-R5` | Agent/MCP tool boundary | Fake tools, no real credentials/network, approval and output redaction | A1 classifier plus A2 descriptor/protocol and sanitized Agent/MCP reference harness; complete target-code qualification remains open. |
| `HUNT-008-R6` | XSS where a deterministic safe fixture exists | No remote browser target, bounded fixture, redacted output | A1 classifier plus A2 descriptor/protocol and sanitized XSS reference harness; complete target-code qualification remains open. |
| `HUNT-008-R7` | Authorization/tenant/mass-assignment | In-memory or disposable fixture with explicit tenant identities | A1 classifier plus A2 descriptor/protocol and sanitized authorization reference harness; complete target-code qualification remains open. |
| `HUNT-008-R8` | Prototype pollution/unsafe deserialization/parser boundary | Version-pinned parser target, safe payloads, no host object or process access | PR #110 merged the bounded prototype-pollution target fixture/harness and `D1-008` mapping; unsafe-deserialization/parser coverage remains absent and complete per-family acceptance remains open. |
| `HUNT-008-R9` | Secrets/credential-use and dependency/supply-chain behavior | Synthetic credentials, disposable package/image fixtures, no real credential validation | PR #111 merged signed `D4-001` and `D6-001` descriptors with synthetic in-memory credential-use and metadata-only supply-chain harnesses. Docker target integration 3/3 and CLI 6/6 passed; real credential/package/provider qualification and complete acceptance remain open. |
| `HUNT-008-R10` | AI-agent/MCP tool boundary and approval bypass | Fake tools, explicit capability receipts, no real credentials/network, replay-safe proof | PR #112 merged the sanitized Agent/MCP receipt fixture and replay-rejection assertion; no live MCP/customer-agent workflow is claimed and complete proof acceptance remains open. |

### 4.3 Current Hunt implementation truth

- The supported catalog contains eight A1 deterministic built-in fixture probes
  and ten A2 target-harness descriptors. The A1 probes are
  `a1-utf8-contains`, `a1-path-traversal`,
  `a1-command-injection`, `a1-ssrf-target`, `a1-tenant-boundary`,
  `a1-sql-injection`, `a1-xss-safe`, and `a1-agent-boundary`.
- Each A1 probe declares positive, negative, timeout, and adapter-failure
  fixtures and uses the bounded restricted-process path.
- The A2 descriptors bind the ten target-harness families to the pinned Node
  Docker image, a fixed harness path, and a strict one-line verdict protocol.
  Sanitized public reference harnesses for all ten families have passed the
  local protocol test and direct pinned-Docker runs.
- The expanded agentic workflow is not yet complete: target discovery,
  scanner-to-playbook mapping, real application adapters, remediation/retest,
  counterexample proof, and the held-out benchmark remain implementation and
  acceptance work.
- A1 probes are fixture-level classifications only. The A2 path is an
  implementation slice, not complete per-family target-code acceptance.
- The A1 worker is a technical bounded worker, not an autonomous AI agent and
  not an OS/security isolation boundary.
- The five roles remain controlled responsibilities, not autonomous AI agents
  at the current head. Full agent orchestration, playbook provenance, real
  target adapters, tests, remediation/retest, and safe-adapter acceptance for
  each family are still required before HUNT-008 closes.
- `HUNT-008..011` and dependent qualification rows remain the acceptance
  authority. This matrix does not close them.

### 4.4 Hunt isolation acceptance

Every supported recipe must declare and test: no network by default, no host
socket/secrets/devices, bounded CPU/memory/time/output, explicit target roots,
unconditional cleanup, redaction, deterministic failure handling, and a
structured verdict with limitations. Linux/Docker adversarial evidence and any
independent assurance required by the backlog are separate from unit fixtures.

## 5. Attest and Release Records by plan

| Plan | Attest/record value | What is not promised |
| --- | --- | --- |
| Free | Local coverage, starter code-to-proof playbooks, local evidence, report export, and offline verification | Hosted history, managed model calls, organization approvals, and paid/private-runner workflows |
| Pro | Full local TS/JS code-to-proof Hunt, remediation/retest, signed portable `.vgl`, private hosted records, and MCP Hunt | Team-wide approvals, SCM organization checks, or Enterprise private-runner controls |
| Team | Organization policy, roles, shared records, approvals, audit history, GitHub/GitLab checks, and configured private targets | Studio client handoff and Enterprise residency/KMS guarantees |
| Studio | Client-separated campaigns, redacted handoff receipts, white-label/public verification, and managed workflow allowances | Customer KMS/HSM or contracted Enterprise controls |
| Enterprise | Private runners, custom target adapters/playbooks, customer trust roots/KMS/HSM options, SSO/SCIM, retention/residency, and audit export | Features not explicitly configured and accepted in the customer contract |

The `.vgl` record is Verglos evidence. It is not the same thing as npm
provenance, in-toto/SLSA attestations, SARIF, SPDX, CycloneDX, or a provider
receipt; imported evidence keeps its original provenance and limitations.

## 6. MCP, organizations, and SCM

- The MCP server exposes only the capabilities authorized by the resolved plan
  and policy: inspect, explain, evidence, approved Hunt operations, and record
  verification.
- MCP cannot silently sign, approve, publish, change billing, mutate source,
  or run a networked Hunt.
- A Verglos organization is the tenant that owns policy, members, records, and
  entitlements. A GitHub/GitLab organization is a provider-side resource. They
  are connected through stable provider installation, organization,
  repository, and commit identifiers; they are not the same object.
- TopNotchh's company GitHub organization may be used for authorized tests.
  Public repositories and forks may be used when their license/NOTICE and
  exact commit are recorded. Private/customer repositories require owner
  consent and must not be copied into this public repository.
- The SCM acceptance path includes installation, least-privilege checks,
  repository binding, webhook delivery, replay protection, scan/check result,
  and removal evidence.

## 7. Billing, entitlements, and hosting boundary

- V1 paid access is cards-only, one-time prepaid fixed-term access with
  manual, user-initiated renewal. V1 does not promise automatic recurring
  renewal.
- The trusted path is provider payment -> signed webhook -> idempotent payment
  ledger -> server-owned entitlement -> expiry/manual renewal projection.
- Client-supplied plan, tenant, capability, price, allowance, or record fields
  never grant access.
- Local scanning and bounded verification use the customer's machine by
  default. Hosted Web provides identity, policy, records, organization
  coordination, and optional controlled execution; Verglos is local-first,
  not local-only.
- Preview/test qualification uses isolated data and canonical test prices.
  Production is not a test database, and synthetic provider events or direct
  entitlement edits are not acceptance evidence.

## 8. Distribution, qualification, and Point-5 finish boundary

| Stage | Required result | Anchors |
| --- | --- | --- |
| Package boundary | Public-safe packed artifacts, notices, manifests, clean consumer, no private evidence | `DIST-001..006`, `LIC-*` |
| CLI qualification | Build/typecheck/test, platform matrix, Hunt/record path, release provenance | `QUAL-CLI-001..006` |
| Web qualification | Privacy/deletion, accessibility, performance, plans, hosted evidence, production truth | `QUAL-WEB-*`, `FINAL-WEB-*` |
| Acceptance | Composed CLI/Web/Hunt/plan/record/release evidence with limitations | `ACCEPT-001..014` |
| Point 5 corpus | Packed npm consumer on public TS/JS repositories and authorized TopNotchh forks; no source upload; coverage, dependencies/secrets/provenance, Docker/Trivy, MCP, scanner-to-Hunt proof, plan, performance, failure, and competitive benchmark checks | `TARGET-*`, `ACCEPT-*`, current goal Point 5 |

This goal stops after the complete Point-5 evidence bundle. Npm publication,
held-out experiments/POC, campaign execution, and the final release decision
belong to the next goal. That boundary prevents an implementation loop from
quietly becoming a release claim.

## 9. Evidence state and execution rule

Every row must have: implementation reference, exact commit/deployment, real
test output, limitations/skips, privacy boundary, and the row's acceptance
condition. A Markdown update, code merge, deployment, browser click, or owner
approval alone does not check a row.

When a row is blocked, record the blocker owner, missing artifact, safe next
action, and review date in the private ledger. Continue with the next
dependency-ready row; do not rewrite the contract or pretend the blocker is
gone. Genuine provider, customer, legal, or independent-review requirements
remain explicit even when the founder is the sole current builder.

## 10. Public repository boundary

The public `verglos-cli` repository may contain public-safe implementation,
sanitized usage documentation, and non-sensitive contract claims. It must not
receive private backlog state, execution ledgers, raw findings, consent,
legal packets, provider details, credentials, internal deployment URLs, or
private customer data. The private tracker is authoritative for those records.
