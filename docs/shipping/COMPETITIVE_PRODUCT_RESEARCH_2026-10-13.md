# Verglos Final V1 Competitive Product Research

**Date:** 2026-10-13  
**Owner:** Top Notchh Solutions  
**Purpose:** Private research used to amend the Final V1 product contract.  
**Scope:** TypeScript/JavaScript AppSec, autonomous attack verification, AI
developer workflows, evidence, SCM, and commercial packaging.

This is a product-planning document, not a claim that competitor marketing
claims have been independently audited. Prices and feature pages can change;
the source URLs and date are retained so the comparison can be refreshed.

## Executive conclusion

The market already expects more than SAST rules:

1. Static analysis, dependency/supply-chain checks, secrets, AI triage, and
   remediation are table stakes.
2. DAST/API products are expected to discover an application surface, run in
   CI/CD, validate exploitability, and give developer-ready evidence.
3. Autonomous pentest products differentiate with target mapping, focused
   attack agents, independent validation, impact demonstration, retesting, and
   fast reports.
4. Enterprise buyers pay for governance, privacy, private deployment,
   identity, auditability, and measurable reduction of risk—not for a list of
   agent names.

Verglos can win a focused wedge by connecting the local scanner finding to a
bounded real-target attack, counterexample, signed Release Record, and release
decision without requiring source upload. That wedge is only credible after a
held-out TS/JS benchmark proves coverage, reproducibility, containment, and
time-to-proof.

## Official market evidence

### XBOW — autonomous pentest reference bar

- Platform page: <https://xbow.com/platform>
- Console introduction: <https://docs.xbow.com/console/get-started/introduction/>
- Security and safety: <https://docs.xbow.com/console/get-started/trust-and-safety/>
- Impact demonstration: <https://docs.xbow.com/console/reference/impact-demonstration/>

XBOW describes autonomous agents that learn an asset, map the attack surface,
coordinate focused workers, attack, and prove findings. Its documentation also
describes attack-surface guidance, safety judges, deterministic command checks,
pause/resume behavior, validators, and optional impact demonstration.

**Contract implication:** Verglos needs target mapping, worker orchestration,
independent proof, safe-impact levels, pause/stop controls, and exact scope
records. A signed fixed recipe by itself is below this bar.

### Aikido — continuous AI pentest and remediation reference bar

- AI Pentest: <https://www.aikido.dev/attack/aipentest>
- Continuous pentest: <https://www.aikido.dev/blog/introducing-aikido-infinite>

Aikido describes white-box, grey-box, and black-box testing; agent-driven
discovery and exploitation; separate validation; automatic fixes and retesting;
and continuous testing on every release. Its public page advertises a
time-boxed assessment price of roughly $4,000 and a managed continuous-testing
offering.

**Contract implication:** Verglos needs a paid outcome stronger than “scan
completed”: proof of exploitability, suggested remediation, retest status, and
release-to-release coverage. Local execution can be the cost/privacy advantage.

### Semgrep — developer AppSec reference bar

- Pricing/features: <https://semgrep.dev/pricing/>
- Workflows: <https://semgrep.dev/docs/workflows/overview>
- Assistant: <https://semgrep.dev/products/product-updates/semgrep-assistant-ga/>

Semgrep publicly lists SAST, SCA, secrets, cross-file/data-flow analysis,
malicious dependency detection, SBOM/license support, AI detection/triage/
remediation, PR/CI/IDE integrations, and custom workflows. Its pricing page
lists 35+ supported languages and paid contributor-based plans.

**Contract implication:** Verglos must make its ten-domain TS/JS coverage
manifest, dependency reachability, secret validation, AI/MCP workflow, PR
checks, custom policy, and remediation loop visible and usable—not hide behind
future language expansion.

### Snyk — integrated platform and usage-based AI reference bar

- Plans: <https://snyk.io/plans/>
- API/Web/MCP documentation: <https://developers.probely.com/>

Snyk publicly packages SAST, SCA, IaC, container, source-manager/IDE/CLI
integrations, API/Web testing, MCP, and enterprise usage credits. Its published
rate card separates ordinary scanning from higher-cost AI pentest assessments.

**Contract implication:** Verglos should keep local scanning and local Hunt
cheap/free, while metering hosted model calls, managed runners, retention,
public verification, and high-cost campaigns. A single unlimited hosted promise
would damage margin.

### GitHub Code Security — SCM-native reference bar

- Code scanning: <https://github.com/features/security/code-scanning>
- Product details: <https://docs.github.com/en/get-started/learning-about-github/about-github-advanced-security>
- Published pricing: <https://github.com/security/advanced-security>

GitHub publicly offers CodeQL data-flow analysis, code scanning, dependency
review, secret scanning/push protection, AI scan/autofix, security campaigns,
and organization-level security configuration. Its public page lists $19 per
active committer/month for Secret Protection and $30 per active committer/month
for Code Security.

**Contract implication:** Verglos cannot sell a dashboard without a developer
loop. Team and above must provide useful PR status/check output, policy gates,
baselines, audit history, and actionable proof attached to the changed code.

### StackHawk — code-to-runtime/API reference bar

- Pricing/product page: <https://www.stackhawk.com/pricing-old/>

StackHawk publicly positions shift-left DAST/API testing in CI/CD, attack-surface
discovery from code, OpenAPI generation, SAST/DAST correlation, API protocols,
coverage metrics, MCP, and developer-ready validation commands.

**Contract implication:** Verglos needs a real local/private target adapter,
route/API discovery, code-to-runtime correlation, coverage reporting, and
repeatable proof. “No general remote DAST” cannot mean “no dynamic application
testing.”

## Competitive requirements adopted for Verglos

### Required customer outcome

For a supported TS/JS application, a customer must be able to:

1. run a local scan and see the exact domain/rule/subject/evidence coverage;
2. select a finding or changed route for Hunt;
3. let the Scout map the authorized target and the planner create a bounded
   attack hypothesis;
4. approve and execute the appropriate playbook in a disposable target
   environment;
5. see a confirmed, rejected, inconclusive, unsupported, or environment-error
   result with a safe proof and counterexample;
6. receive remediation guidance or a proposed patch without hidden mutation;
7. rerun the same proof after the fix;
8. create a signed `.vgl` Release Record and enforce the policy in CLI, MCP,
   Web, and PR workflows.

### Differentiation to build, not merely market

- **Code-to-proof graph:** Every Hunt run starts from a scanner/SCA/secret/
  provenance/Trivy finding or an explicitly scoped target route and returns
  proof to that same observation.
- **Privacy by default:** local execution, no source upload, opt-in model
  provider, redacted evidence, and customer-controlled private runners.
- **Proof with counterexamples:** positive reproduction and safe negative
  control are both recorded; model confidence alone never closes a finding.
- **Re-test loop:** a fix can be applied only with approval, then the same
  proof is replayed and the Release Record shows before/after status.
- **Evidence portability:** `.vgl` records preserve subject, engine, playbook,
  proof, policy, approval, provenance, and limitations independently of the
  Verglos Web account.
- **Plan economics:** local work is not metered like hosted AI/DAST; paid plans
  monetize collaboration, governance, managed execution, retention, and
  support.

## Required benchmark before claiming “better”

The held-out corpus must contain real and intentionally vulnerable TS/JS apps,
API targets, agent/MCP fixtures, dependency cases, container targets, clean
projects, and failure environments. It must report:

- finding recall and verified-proof recall by domain;
- false-positive and inconclusive rates;
- target/route discovery coverage;
- proof reproducibility across repeated runs;
- time-to-first-proof and P50/P95 run duration;
- remediation acceptance and successful retest rate;
- source-upload and network-egress audit results;
- resource consumption and hosted-cost attribution;
- comparison against a declared baseline, with unsupported cases visible.

Verglos may claim superiority only for dimensions where this evidence supports
it. The initial intended wedge is high-confidence TS/JS code-to-proof security
with portable evidence and local privacy, not an unsupported claim to beat
every competitor at every language or attack surface.

## Commercial packaging recommendation

The existing prepaid prices can remain as an entry point only if hosted cost
is bounded:

| Plan | Paid outcome | Economic guardrail |
| --- | --- | --- |
| Free | Local scanner, coverage, starter Hunt, local records, safe MCP | No hosted history, managed model calls, or private-runner cost. |
| Pro | Full local code-to-proof loop, personal records, remediation/retest, MCP Hunt | Local execution included; hosted storage and model calls have declared allowances. |
| Team | Shared policy, PR gates, repository bindings, audit history, private-runner option | Seats, repositories, retention, and runner/AI usage are explicit. |
| Studio | Multi-client campaigns, redacted evidence, handoffs, verification views | Client workspace and managed campaign quotas are explicit. |
| Enterprise | Private execution, governance, identity, residency, custom adapters, support | Contracted minimum, usage/retention terms, and SLA are explicit. |

Do not promise unlimited hosted autonomous pentesting at the current entry
prices. Customers should be able to run local work without surprise bills;
managed campaigns, external targets, long retention, and high-volume model
execution must use credits or contracted allowances.

## Decisions for the canonical product contract

The Final V1 contract must therefore require:

- real target adapters and route/API discovery in addition to fixture recipes;
- scanner-to-Hunt mapping for all supported families;
- independent proof, counterexamples, retest, stop/pause controls, and impact
  levels;
- remediation proposals and approval-bound patch/retest workflow;
- MCP, Web, SCM, Attest, and Release Records using one evidence graph;
- explicit plan entitlements and hosted-cost controls;
- a benchmark before any “better than competitors” claim.

No checkbox is closed by this research. It changes the product requirements;
implementation and acceptance evidence remain necessary.
