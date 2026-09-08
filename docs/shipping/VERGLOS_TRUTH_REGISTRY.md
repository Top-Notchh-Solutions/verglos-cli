# Verglos truth registry

Reviewed: 2026-09-08

Owner: Product truth; CLI, Hosted, and Security owners maintain their evidence

This is the classification source for implementation docs, dashboard labels, pricing copy, sales language, and the final campaign. Every capability is `shipped`, `partial`, `planned`, or `hypothesis`. A higher-maturity label requires code plus proportionate verification evidence; route, type, table, package, or UI presence alone is insufficient.

## Evidence baselines

- CLI: [`VERGLOS_CLI_CAPABILITY_INVENTORY.md`](./VERGLOS_CLI_CAPABILITY_INVENTORY.md), reviewed at CLI commit `caa2a56`.
- Hosted: [`VERGLOS_WEB_CAPABILITY_INVENTORY.md`](./VERGLOS_WEB_CAPABILITY_INVENTORY.md), reviewed at web commit `5044e77`.
- Commercial migration: [`VERGLOS_PLAN_AND_CAPABILITY_RECONCILIATION.md`](./VERGLOS_PLAN_AND_CAPABILITY_RECONCILIATION.md), decided at `f8515dc`.
- Target: `docs/VERGLOS_PRODUCT_ARCHITECTURE_BLUEPRINT.md` and `docs/VERGLOS_COMPANY_USAGE_AND_FEATURE_MAP.md`.
- Interfaces: `VERGLOS_COMMAND_AND_UI_CONTRACT.md` and `VERGLOS_AGENT_AND_MCP_CONTRACT.md`.
- Acceptance: `VERGLOS_FINAL_ACCEPTANCE_AND_POC.md` and `RELEASE_GATES.md`.

## State rules

| State | Meaning | Allowed public treatment |
|---|---|---|
| `shipped` | Executable bounded behavior exists with enough evidence to state exactly what it does. | Describe only the recorded scope and limitations. |
| `partial` | Some behavior exists, but the journey is incomplete, untested, unsafe, deployment-dependent, or only an integration edge. | Say alpha/partial/limited and name the missing boundary. |
| `planned` | Target is approved, but code is absent or only a shell/type/option. | Roadmap/internal target only; never present tense. |
| `hypothesis` | Product, commercial, demand, pricing, or operational assumption lacks validation. | Internal hypothesis only; no public factual claim. |

## Current CLI command registry

Owner: CLI Core. Detailed flags, exit behavior, network paths, tests, and caveats live in the CLI inventory.

| Command/capability | State | Evidence | Reviewed | Bounded public wording |
|---|---|---|---|---|
| `verglos scan` native JS/TS-oriented scan | shipped | `packages/cli/src/scan.ts`, `packages/scanner/src/index.ts`, 58 scanner tests | 2026-09-08 | “Scan JavaScript/TypeScript-oriented repositories with Verglos native detectors.” |
| standard scan flags | shipped | `packages/cli/src/index.ts`, `scan.ts` | 2026-09-08 | Name the selected flag behavior; do not imply a separate engine. |
| `scan --verify-secrets` | partial | `scanner/src/live-key-verify.ts`, `detectors/secrets.ts` | 2026-09-08 | “Opt in to GitHub and Stripe credential checks.” AWS pairing is not shipped. |
| `scan --hunt` | partial shell | `packages/cli/src/scan.ts` | 2026-09-08 | “Reserved integration flag; current alpha does not run Hunt.” |
| `score` | shipped, bounded | `packages/cli/src/scan.ts` | 2026-09-08 | “Print a native scan score.” Coverage differs from full CLI `scan`. |
| `secrets` | shipped | CLI index and secrets detector | 2026-09-08 | “Run a focused local secret-pattern scan.” |
| `deps` | shipped, network-dependent | CLI index and dependencies detector | 2026-09-08 | “Query OSV for detected npm dependency versions.” |
| `ci` critical gate | shipped | `packages/cli/src/scan.ts` | 2026-09-08 | “Fail CI when native scanning finds a critical.” |
| `ci --threshold` | shipped, paid | CLI index and scan | 2026-09-08 | “Paid plans can enforce a native score threshold.” |
| `ci --hunt` | partial shell | same evidence | 2026-09-08 | “Reserved flag; current alpha falls back to standard CI gating.” |
| `fix` | shipped, limited | `packages/cli/src/fix.ts`, 10 tests | 2026-09-08 | “Pro can inject a bounded security-header fix for supported project shapes.” |
| `hunt` | partial shell | CLI Hunt and private Hunt package | 2026-09-08 | “Hunt is an alpha command shell; sandbox verification is not shipped.” |
| `attest` | partial shell | CLI Attest and private Attest package | 2026-09-08 | “Attest is an alpha command shell; signed records are not shipped.” |
| `login`, `activate`, `whoami` | partial hosted integration | CLI commands and hosted auth/license routes; no journey tests | 2026-09-08 | “Hosted license flows exist in alpha.” Do not claim general Free login or proven reliability. |
| `badge` | shipped, bounded | CLI index and reporter badge generator | 2026-09-08 | “Generate score badge markdown from a native scan.” |
| `hook` and `precommit` | shipped | CLI config and precommit | 2026-09-08 | “Install a fail-open, time-bounded pre-commit scan for high-confidence high/critical findings.” |
| monitor subcommands | partial hosted integration | CLI monitor; 7 CLI tests; 0 hosted tests | 2026-09-08 | “Alpha monitoring integration.” No reliability, retry, or digest claim. |
| MCP stdio/config | shipped transport | `packages/mcp/src/server.ts` | 2026-09-08 | “Run the MCP stdio server with four functional tools and five shells.” |
| `init` | shipped | `packages/cli/src/init.ts` | 2026-09-08 | “Create local config with explicit hook consent.” |
| `explain` | shipped | CLI explain and shared bank | 2026-09-08 | “Explain rules present in the local explain bank.” |
| `update` and version preflight | shipped | `packages/cli/src/update.ts` | 2026-09-08 | “Check npm and update the global CLI.” |

## Current native detection and report registry

Owner: CLI Core.

| Capability | State | Evidence | Reviewed | Bounded public wording |
|---|---|---|---|---|
| 11 registered native detectors | shipped, JS/TS-oriented | scanner detectors and CLI inventory | 2026-09-08 | Name detector families; never translate their count into full SAST coverage. |
| 44 literal rule IDs plus secret pattern IDs | shipped implementation | detector source inventory | 2026-09-08 | State exact rule families only. |
| context/noise classification and score caps | shipped | scanner context/tag files and shared scoring | 2026-09-08 | “Context-aware native scoring with strict-mode controls.” |
| provenance inference | shipped heuristic | `packages/scanner/src/provenance/*` | 2026-09-08 | “Heuristic AI-authorship signals with disclosed confidence.” Never claim authorship fact. |
| terminal/HTML/JSON reports | shipped legacy report | `packages/reporter/src/*` | 2026-09-08 | “Local native-scan reports.” Not a `.vgl` Release Record. |
| unsupported-language guard | shipped | scanner index | 2026-09-08 | “Reports unsupported instead of a misleading 100 when JS/TS evidence is insufficient.” |
| report-format/history-depth config | partial | shared config versus reporter/git-history | 2026-09-08 | Do not claim configurability until execution honors it. |

## Current MCP registry

Owner: Agent Interfaces.

| Tool | State | Evidence | Reviewed | Bounded public wording |
|---|---|---|---|---|
| `verglos_check_before_write` | shipped, untested protocol | MCP tool source | 2026-09-08 | “Run a bounded no-network snippet check before write.” |
| `verglos_check_package` | shipped, network-dependent | MCP tool source | 2026-09-08 | “Check npm existence, embedded-list typo similarity, and OSV advisories.” |
| `verglos_scan` | shipped, bounded | MCP tool source | 2026-09-08 | “Run the library default scan with git history/provenance and return a summary.” |
| `verglos_explain_finding` | shipped | MCP tool source | 2026-09-08 | “Return a shared explain-bank entry.” |
| four Hunt tools | partial shells | MCP server dispatch | 2026-09-08 | “Registered alpha shells; no sandbox verdict is produced.” |
| `verglos_attest` | partial shell | MCP server dispatch | 2026-09-08 | “Registered alpha shell; no record is signed.” |

## Current hosted capability registry

Owner: Hosted Platform. All hosted surfaces currently have zero application tests.

| Capability | State | Evidence | Reviewed | Bounded public wording |
|---|---|---|---|---|
| Clerk browser authentication | partial integration | middleware and account loaders | 2026-09-08 | “Clerk-backed account authentication is implemented.” Deployment configuration is not implied. |
| device-code CLI authentication | partial paid flow | CLI-auth routes/page | 2026-09-08 | “Active paid licenses can be connected through an alpha device flow.” |
| HMAC license issuance/validation | partial | web license library/routes | 2026-09-08 | “Hosted license issuance and validation are implemented in alpha.” |
| Ed25519 entitlement issuance | partial/config-dependent | web entitlement signing/routes | 2026-09-08 | “The server can issue signed entitlement JWTs when configured.” |
| Razorpay Pro QR checkout | partial | Razorpay routes/webhook | 2026-09-08 | “An environment-priced Pro UPI QR flow exists.” Do not state final price from this code. |
| telemetry ingestion | partial operational surface | telemetry route and `scan_events` | 2026-09-08 | “Optional scan telemetry ingestion exists.” Use field-level privacy wording below. |
| score history/activation updates | partial | telemetry dual-write and account loaders | 2026-09-08 | “Paid scan events can populate hosted score history and project activations.” |
| account operational pages | partial dashboard | account routes/loaders | 2026-09-08 | “An alpha Pro account dashboard exists.” Not the final V1 dashboard. |
| hourly OSV monitoring | partial/unsafe for GA | cron route and workflow | 2026-09-08 | “An alpha hourly OSV polling path exists.” No SLA, retry, digest, or exactly-once claim. |
| alert channel adapters | partial/unsafe for GA | monitor dispatch | 2026-09-08 | “One-attempt email/Slack/webhook adapters exist.” Generic webhook remains an SSRF boundary. |
| legacy report viewer | partial/security-blocked | reports page/table | 2026-09-08 | No availability claim until owner authorization is fixed and tested. |
| hosted summary minting | partial unsigned assertion | attestation API/table | 2026-09-08 | “A dormant alpha endpoint can publish a caller-supplied summary.” Never call it signed/verified evidence. |
| public summary/view ledger | partial, not verification | verify pages/tables | 2026-09-08 | “Public summary lookup and view counting exist.” Never call it cryptographic verification. |

## Planned V1 registry

These are approved targets, not present-tense product claims.

| Capability | State | Owner | Evidence/decision | Allowed wording before shipment |
|---|---|---|---|---|
| versioned evidence contracts | planned | Evidence Core | architecture and contracts | “Planned for V1.” |
| local directory/archive/image/IaC resolution | planned | CLI Core | target contract/backlog | “Planned for V1.” |
| pinned replaceable Trivy adapter | planned | Engine Adapters | decisions/backlog | “Planned integration”; never “built in” or “native.” |
| SARIF/SBOM/VEX/provenance/detect-secrets interchange | planned | Import/Export | architecture/backlog | “Planned standards support.” |
| normalization, deduplication, lineage, release diff | planned | Evidence Core | architecture/backlog | “Planned for V1.” |
| `PASS | REVIEW | BLOCK | INCOMPLETE` policy | planned | Policy | command/UI contract | “Planned policy decisions.” |
| local evidence viewer | planned | Local UI | command/UI contract | “Planned local viewer.” |
| canonical `.vgl` record | planned | Record Core | architecture/backlog | “Planned portable record.” Current JSON/DB summaries are not `.vgl`. |
| functional Hunt/six-state verification | planned | Hunt/Sandbox | agent/MCP contract | “Planned local verification.” No exploitability claim before acceptance. |
| guided signing and Sigstore/in-toto verification | planned | Supply Chain | decisions/backlog | “Planned signing/identity verification.” |
| final Pro hosted workflow | planned migration | Hosted Platform | architecture/plan contract | “Target V1 plan.” Current alpha Pro remains distinct. |
| Team plan/dashboard | planned | Hosted Platform | founder price decision pending | “Planned”; no current Team product claim. |
| Studio workspace/client handoff | planned | Hosted Platform | founder price decision pending | “Planned”; current shells/summary route are not the product. |
| Enterprise runners/SSO/SCIM/custom controls | planned | Enterprise Platform | architecture/qualification | “Planned” or scoped pilot only after evidence. |

## Hypothesis registry

Owner: Founder/Product. Implementation alone cannot convert a hypothesis into a public fact.

| Hypothesis | Required evidence before decision |
|---|---|
| non-Pro prices, allowances, overages, discounts | founder decision plus checkout/entitlement consistency |
| demand for unified source-to-artifact evidence | authorized post-RC POC evidence |
| willingness to pay for local verification | authorized POC/pilot evidence |
| Studio handoff/evidence resale | authorized agency workflow validation |
| Enterprise runners, SSO/SCIM, custom detectors | design-partner requirements and security review |
| managed cloud Hunt demand | demand evidence plus isolation/cost model |
| benchmark or false-positive advantage | frozen method, dated results, reproducible evidence |

## Privacy and network wording

Approved bounded current-alpha description:

“Source files and generated reports stay local unless the user explicitly submits data to a hosted workflow. A normal scan can query npm and OSV, resolve entitlement/update state, and send optional telemetry. Telemetry can include a derived project fingerprint/name, version/platform data, score and severity counts, provenance/verification flags, duration, detector names, and—when a paid license is active—a license bearer for account association. It does not include source contents, file paths, finding text/snippets, or matched secret values in the constructed event payload. Disable scan telemetry with `--no-telemetry` or `VERGLOS_TELEMETRY=0`.”

Retention, deletion, residency, encryption, server logs, and production configuration are not established by this wording and require separate evidence.

## Claim rules

1. “Native SAST” means Verglos-owned JS/TS-oriented detector coverage; it never includes Trivy or imported evidence.
2. External engine, imported evidence, and native detection stay separate in every UI, report, benchmark, and sales statement.
3. Sigstore proves only the scoped signer identity and artifact integrity its output establishes—not security perfection, company ownership, authorship, or compliance.
4. “Unlimited local” never means unlimited hosted storage, seats, projects, retention, alert delivery, or managed compute.
5. No customer, revenue, adoption, benchmark, exploitability, SLA, or compliance claim is public without a source, method, and date.
6. “Local” describes data placement, not zero network. Name external lookups and telemetry controls where material.
7. Do not say telemetry has “no identity.” Distinguish anonymous events from paid bearer-associated writes.
8. “Verify” is reserved for cryptographic verification or a precisely named check. A random-hash lookup is not independent attestation verification.
9. Hunt and Attest stay “alpha command shells” until accepted implementations replace these entries.
10. Team is planned. Current Studio and Compliance/Founder code does not establish final Studio or Enterprise products.
11. Trivy is a planned pinned, replaceable external adapter, never Verglos-native detection.
12. `.vgl` means the canonical versioned Release Record only. Current JSON reports, DB summaries, and random hashes are not `.vgl`.
13. “Dashboard” must name the current alpha Pro account surface or a specific accepted final-plan surface.
14. Route, table, package, interface, screenshot, or UI presence is not proof of production operation, authorization safety, reliability, or acceptance.
15. When code conflicts with a public claim, reduce the claim or fix and verify the code before publication. Evidence wins.

## Update protocol

When a task changes capability truth, the same logical change updates the registry row, `TRACEABILITY.md`, `STATUS.md`, the backlog checkbox, and affected binding contracts. Public copy changes only in its authorized release stage. No row becomes `shipped` from a self-authored assertion; the named acceptance evidence must exist and be reproducible.
