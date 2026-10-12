# Verglos Final V1 — Scope, Hunt, Plans, and Business Decision

**Decision date:** 2026-10-12  
**Status:** approved contract; documentation/implementation target  
**Scope:** public CLI, private shipping tracker, shipping worktree, Web, and MCP  
**Important:** this file does not claim that any capability is implemented or shipped.

The approved execution goal is deliberately bounded to Points 1–5: synchronize
this contract across the repositories, implement the real bounded Hunt/public
CLI path, connect Web entitlements/Attest/Release Records, and qualify the npm
package on public TypeScript/JavaScript repositories. Npm publication, held-out
POC/experiments, and the final release decision are deferred to the next goal.

This is the context document to read before creating the execution goal. It
defines what Verglos is supposed to deliver, what remains missing, and what
must not be invented during implementation.

## 1. The company product in one sentence

Verglos is a local-first security decision and evidence layer for
TypeScript/JavaScript software built with human and AI assistance:

```text
Inspect -> Decide -> Hunt-verify -> Prove -> Approve/block -> Monitor
```

Verglos is not only a scanner and is not an unrestricted autonomous pentester.
The scanner discovers risk; Hunt verifies selected risk; Attest/Release Records
prove what was checked and why a release was allowed.

## 2. What customers actually buy

### Free

Free is a complete local baseline, not a demo:

- TypeScript/JavaScript source scanning;
- secrets, dependency, provenance, injection, misconfiguration, AI-code and
  package-risk coverage in the Free rule set;
- local JSON/HTML results;
- pre-commit and CI use;
- MCP `check_before_write`, package, scan, and explanation tools;
- a small safe Hunt starter pack;
- no required account, source upload, hosted execution, or paid history.

The Free plan is economically viable because the user's machine performs the
scan and bounded local verification. There are still small company costs for
package distribution, documentation, support, and optional public services,
so “free local compute” must not be confused with “zero company cost.”

### Pro

Pro sells depth and confidence, not basic safety:

- every Free capability;
- the complete supported V1 Hunt recipe catalogue;
- multi-finding and CI Hunt execution within explicit local limits;
- advanced rule packs such as agent-surface, API hardening, and deep auth;
- remediation, monitoring, score history, private hosted records;
- MCP Hunt tools with full Pro recipe coverage;
- signed portable `.vgl` Release Records.

### Team

Team sells coordination:

- organization, members, roles, shared policy and baseline;
- shared history, approvals, and release decisions;
- GitHub/GitLab pull-request checks;
- repository and commit identity binding;
- organization-level Hunt policy and evidence visibility.

### Studio

Studio sells agency/client delivery:

- client workspaces and separation;
- redacted client projections;
- handoff receipts, white-label evidence, and public verification;
- longer retention and higher evidence allowances.

### Enterprise

Enterprise sells private control and governance:

- private/customer-network runners;
- outbound-polling job protocol with replay protection;
- residency and retention controls;
- SSO/SCIM, audit export, contracted policy, and support;
- optional customer KMS/HSM integration.

The target commercial anchors remain Free $0, Pro $29/month, Team
$99/month, Studio $249/month, and Enterprise contact-sales. The Web catalog is
the source of truth; no plan is advertised as generally available until its
end-to-end capability evidence exists.

## 3. Why this is not a copycat

The competitor lanes are different:

- XBOW positions autonomous agents around externally directed continuous
  penetration testing and working exploits.
- Semgrep and GitHub position AI around code scanning, triage, and automated
  remediation inside developer workflows.

Verglos should not imitate XBOW's remote attack-fleet promise or GitHub's
general-purpose coding agent. Its own wedge is:

1. local source-preserving scanning for AI-assisted TypeScript/JavaScript;
2. security checks inside MCP before an agent writes code;
3. finding-specific verification rather than undirected exploration;
4. a signed, portable Release Record joining source, artifact, policy, Hunt,
   exception, approval, and final decision;
5. the same evidence contract from an individual developer to an enterprise
   private runner.

The goal is not to have the most agents. The goal is to produce the most
trustworthy release decision with the least unnecessary data movement.

## 4. Hunt: what an agent means in Verglos

Verglos will use a bounded agentic pipeline, not uncontrolled model-generated
shell execution.

```text
Scanner finding
  -> Planner/Scout selects an approved recipe for the exact rule
  -> Attack Worker runs the recipe in a bounded local sandbox
  -> Proof Adjudicator checks deterministic assertions
  -> Release Record stores result, coverage, limits, and evidence digest
```

These are controlled roles, not four independent autonomous bots:

1. **Planner/Scout:** deterministic rule-to-recipe selection. An optional
   local model may explain or rank candidates, but it cannot create a recipe.
2. **Attack Worker:** executes only a signed, digest-pinned recipe with
   allowlisted inputs, no host secrets, no host Docker socket, bounded files,
   CPU, memory, processes, output, and time, and no network by default.
3. **Proof Adjudicator:** evaluates declared assertions and emits
   `confirmed`, `not-reproduced`, `inconclusive`, `not-supported`, or
   `environment-error`.
4. **Release Auditor:** binds the result to the exact subject, policy,
   approval, and Release Record. It does not claim that one probe proves the
   whole application secure.

The Free path must require no cloud model. Pro may optionally use a customer
configured model for explanation or prioritization, but model output never
gets direct execution authority.

## 5. V1 recipe catalogue

Only recipes tied to a supported scanner rule and a repeatable safe fixture may
enter V1. Every recipe requires positive, negative, timeout, adapter-failure,
cleanup, redaction, and limitation fixtures.

### V1 security recipes

1. **SQL/NoSQL injection boundary** — maps to high-confidence D1 query rules;
   proves whether a controlled input reaches a query boundary without turning
   the worker into a database attack tool.
2. **Command-injection boundary** — maps to D1 command execution rules;
   proves argument/shell separation using a harmless canary command.
3. **Path-traversal boundary** — maps to D1 path rules; proves that a canary
   path cannot escape the declared fixture root.
4. **SSRF boundary** — maps to D9 user-controlled fetch rules; uses a local
   deny/allow test service and never targets public or cloud metadata hosts.
5. **XSS sink boundary** — maps to D1 HTML sink rules; proves whether the
   controlled value reaches an unsafe sink in a local fixture without a real
   browser attack against an external target.
6. **Mass-assignment boundary** — maps to D3 rules; proves that a protected
   field cannot be set by the controlled request fixture.
7. **Authentication and authorization boundary** — maps to AI/D2/D3/D4 deep
   auth rules; verifies declared ownership/role cases in a customer-provided
   local test harness, never by guessing credentials.
8. **Agent/MCP boundary** — maps to AGENT-001..005; verifies allowlisted tools,
   pinned server identity, HTTPS, and credential redaction using a synthetic
   MCP fixture. It does not execute a customer's real agent configuration.

The first implementation slice should be recipes 1–4 plus the Agent/MCP
boundary. Recipes 5–7 follow after their fixture contracts are proven. This
keeps V1 useful without pretending that application-specific authorization can
be verified generically from a regex finding.

### Recipe non-goals

- no arbitrary LLM-generated commands;
- no public-internet exploitation;
- no credential guessing or real customer data;
- no claim that a non-reproduced result means “secure”;
- no recipe copied from a competitor's proprietary content;
- no networked recipe without an explicit approved policy and evidence.

## 6. Plan allocation for Hunt and MCP

All plans expose the same named MCP/CLI contract, but entitlements limit
recipes, depth, history, and organizational features.

| Capability | Free | Pro | Team | Studio | Enterprise |
| --- | --- | --- | --- | --- | --- |
| Core scanner | Full Free baseline | Full | Full | Full | Full |
| Hunt starter pack | Yes, local-only | Yes | Yes | Yes | Yes |
| Full V1 recipe catalogue | No | Yes | Yes | Yes | Yes |
| MCP Hunt preflight | Yes | Yes | Yes | Yes | Yes |
| MCP finding/report Hunt | Limited starter pack | Full | Full | Full | Full |
| Advanced rule packs | No | Yes | Yes | Yes | Yes |
| Shared policy and approvals | No | Personal only | Yes | Yes | Yes |
| GitHub/GitLab checks | No | No | Yes | Yes | Yes |
| Signed `.vgl` Release Record | Local unsigned/basic result | Yes | Yes | Yes | Yes |
| Client projections/public verification | No | No | No | Yes | Yes |
| Private runner/governance | No | No | No | No | Yes |

This is the intended business balance: Free remains genuinely useful and
zero-price; Pro pays for deeper verification and proof; Team/Studio/Enterprise
pay for organizational memory, collaboration, custody, and governance.

## 7. What is implemented versus what is only planned

### Implemented foundation

- substantial local JS/TS scanner;
- scanner-to-finding data model;
- MCP scanner tools;
- Hunt recipe schema and validation;
- recipe trust/signature checks;
- planner and execution gates;
- redaction and structured verdict types;
- restricted worker and Docker adapters;
- adversarial safety tests;
- one `a1-utf8-contains` fixture recipe.

### Not yet a shipped customer capability

- the eight security recipes above;
- a complete Hunt catalogue;
- the public CLI Hunt runtime distribution;
- functional public MCP Hunt execution;
- Free/Pro/Team/Studio/Enterprise Hunt entitlement alignment;
- complete scanner-to-Hunt-to-Release-Record flow;
- final customer-facing Attest workflow;
- live Team SCM qualification;
- final npm publication and release evidence.

The one text-containment recipe is a plumbing fixture, not the product's
competitive value. The product becomes commercially meaningful when the
scanner can route high-confidence findings into real bounded security recipes
and preserve the result in a release decision.

## 8. Public repository and POC corpus policy

Public TypeScript/JavaScript repositories may be used as a technical evaluation
corpus after the implementation candidate is ready. They are not customers,
endorsements, or permission to copy proprietary content.

For each repository, retain privately:

- URL and exact commit SHA;
- license and NOTICE status;
- allowed commands and network policy;
- expected language/framework shape;
- scan/Hunt configuration;
- findings, coverage, false-positive notes, and limitations.

Use a held-out split so recipes are not tuned only to the repositories used to
design them. Build product fixtures from TopNotchh-authored synthetic cases or
license-compatible material, not by silently redistributing repository code.

## 9. Whole-product contract that must be synchronized

Before creating the execution goal, this decision must be propagated to:

- `FINAL_V1_PRODUCT_CONTRACT_2026-10-11.md`;
- company feature map;
- architecture blueprint;
- CLI and Web plan/capability registries;
- MCP authority and capability truth;
- Hunt planner, recipe, trust, and verdict docs;
- Attest/Release Record docs;
- backlog and execution ledger;
- active goal;
- public README, homepage, pricing, and command documentation.

The old statements “Hunt is Pro-only,” “Hunt is a shell,” and “MCP Hunt is
beta-only” must remain only as historical maturity notes after the replacement
implementation is actually shipped. They must not be erased before evidence
exists.

## 10. Gate for the next execution goal

The next goal may be created only after the founder accepts this product
direction and the synchronized documents state the same contract. The goal
must then execute, in order:

1. implement recipe contracts and the first four recipes plus Agent/MCP
   boundary;
2. ship the public CLI and MCP distribution;
3. align plan entitlements across CLI/Web/MCP;
4. connect Hunt results to Attest/Release Records;
5. run the public TS/JS corpus and held-out POC;
6. complete remaining SCM, release, legal, rollback, and acceptance gates;
7. publish only the capability set actually proven.

No checkbox is closed because this design document exists. It is context for
the next implementation goal, not evidence of implementation.
