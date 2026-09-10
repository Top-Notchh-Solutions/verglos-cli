# Verglos CLI capability inventory

Status: current implementation evidence for `TRUTH-001`

Reviewed: 2026-09-08

Behavior baseline: `caa2a56`

Scope: `verglos-cli` only; hosted-route behavior is audited by `TRUTH-002`

This inventory records what the repository does now. It is not a promise that a named command, plan, or interface is complete. States use the shipping registry vocabulary:

- `shipped`: an executable implementation exists for the bounded behavior stated here.
- `partial`: an implementation or integration exists, but the named product workflow is incomplete or depends on hosted behavior not established by this inventory.
- `planned`: only a type, option, package shell, or target contract exists.

## Runtime and package boundary

- Runtime: Node.js `>=20`; package manager: pnpm `9.15.9`; orchestration: Turbo.
- Published CLI package: `verglos@2.0.0-alpha.1` from `packages/cli`.
- Source license declared by every package: Apache-2.0. Third-party and fixture licensing is audited separately by `TRUTH-006`.

| Package | Publish state | Current responsibility | State | Evidence | Direct tests |
|---|---|---|---|---|---|
| `@verglos/shared` | publishable | findings, score, config, plan display, explain bank, fingerprints | shipped with contract drift | `packages/shared/src/*` | none in package |
| `@verglos/scanner` | publishable | project walk, 11 detector implementations, context classification, score, provenance | shipped for JS/TS-oriented coverage | `packages/scanner/src/index.ts` | 58 runnable tests |
| `@verglos/reporter` | publishable | terminal output, HTML, schema-versioned JSON, badge markdown | shipped | `packages/reporter/src/*` | none |
| `@verglos/entitlement` | publishable | signed entitlement JWTs, tier types, monitoring payload validation | shipped client primitives; not the whole hosted fence | `packages/entitlement/src/*` | 8 runnable tests |
| `@verglos/mcp` | publishable | stdio server with nine registered tools | partial: four functional, five alpha stubs | `packages/mcp/src/server.ts` | none |
| `verglos` CLI | publishable | command routing, reporting, local state, hosted integrations | partial product surface | `packages/cli/src/*` | 34 runnable tests |
| `@verglos/hunt` | private | Hunt interfaces and `runHunt` entry point | planned shell; throws `NotImplementedError` | `packages/hunt/src/index.ts` | none |
| `@verglos/attest` | private | attestation interfaces and `signBundle` entry point | planned shell; throws `NotImplementedError` | `packages/attest/src/index.ts` | none |

The package test scripts currently discover 100 tests: scanner 58, entitlement 8, and CLI 34. One additional fixture test under `packages/scanner/fixtures` is test data and is not discovered by a package test script.

## Command and flag inventory

Every command except `update` first calls `enforceLatestVersion`, which requests npm registry metadata and exits `1` when a newer version is required. Commander also provides normal help handling.

| Command | Explicit flags or arguments | Current behavior | State | Primary evidence | Direct tests |
|---|---|---|---|---|---|
| global | `-v, --version`; `--update`; `--as-plan <free\|pro\|studio>` | prints version, runs updater, or asks the entitlement endpoint for founder-only plan simulation | shipped; simulation is privileged/testing behavior | `packages/cli/src/index.ts`, `update.ts`, `entitlement.ts` | entitlement suites |
| `update` | none | checks `verglos/latest`; when newer, spawns `npm install -g verglos@latest` | shipped | `packages/cli/src/update.ts` | none |
| `scan` | `--watch`, `--quiet`, `--all`, `--strict`, `--no-provenance`, `--verify-secrets`, `--hunt`, `--no-telemetry` | runs Free detectors plus entitled Pro packs, git-history and optional provenance; writes HTML+JSON; stores score baseline; normally sends telemetry | shipped core; `--hunt` is message-only; live secret verification supports GitHub/Stripe but not paired AWS activation in the detector | `packages/cli/src/index.ts`, `scan.ts`, scanner/reporter | scanner suites |
| `score` | `--strict` | runs the scanner and prints only the score | shipped, but does not add CLI entitlement-selected Pro packs or git-history | `packages/cli/src/scan.ts` | scanner scoring/context suites |
| `secrets` | none | focused secret scan; no provenance or momentum baseline; writes both reports | shipped | `packages/cli/src/index.ts`, `scan.ts`, `detectors/secrets.ts` | one secret golden test |
| `deps` | none | focused dependency/OSV scan; no git history, provenance, or momentum baseline; writes both reports | shipped, network-dependent and fail-soft | `packages/cli/src/index.ts`, `detectors/dependencies.ts` | none |
| `ci` | `--threshold <score>`, `--quiet`, `--strict`, `--hunt`, `--no-telemetry` | all plans fail on criticals; paid plans also enforce the threshold; returns `1` on gate failure | shipped standard gate; `--hunt` only prints fallback text and does not gate on verification | `packages/cli/src/index.ts`, `scan.ts` | indirect scoring tests only |
| `fix` | none | Pro-gated; patches recognizable Next.js config headers or creates a helper for Express/Fastify/Node/React | shipped but limited to header injection | `packages/cli/src/fix.ts` | 10 regex/patch-shape tests |
| `hunt` | `--severity`, `--sandbox`, `--dry-run`, `--finding` | checks entitlement, prints parsed options, returns `78`; does not execute a sandbox | partial alpha shell | `packages/cli/src/hunt.ts`, `packages/hunt/src/index.ts` | none |
| `login` | none | device-code start, browser open, polling, and local credential save against hosted endpoints | partial until hosted contract is audited end to end | `packages/cli/src/login.ts` | none |
| `activate <licenseKey>` | `--ci` | validates key with hosted API and stores key, plan, expiry, and optional entitlement JWT | partial until hosted contract is audited end to end | `packages/cli/src/index.ts`, `license-api.ts`, `credentials.ts` | entitlement suites, no command journey |
| `whoami` | none | renders local Free state or hosted license status, masked key, renewal, and machines | partial until hosted contract is audited end to end | `packages/cli/src/whoami.ts` | none |
| `badge` | none | runs a default scanner invocation and prints shields.io markdown | shipped, but scan scope differs from `verglos scan` | `packages/cli/src/index.ts`, `reporter/src/html.ts` | none |
| `hook` | none | writes `.git/hooks/pre-commit` invoking `npx verglos precommit`; no-op outside a git hooks directory | shipped | `packages/cli/src/config.ts` | none |
| `monitor register` | `--email`, `--slack`, `--webhook`, `--label` | Pro-gated; collects npm dependencies and posts project fingerprint, label, dependencies, channels, and CLI version | partial hosted integration | `packages/cli/src/monitor.ts` | no register tests |
| `monitor status` | none | Pro-gated; lists registrations returned by hosted API | partial hosted integration | `packages/cli/src/monitor.ts` | four status/error tests |
| `monitor unregister` | `--project-fingerprint` | Pro-gated; deletes one hosted registration | partial hosted integration | `packages/cli/src/monitor.ts` | two tests |
| `monitor test-alert` | `--project-fingerprint` | Pro-gated; asks hosted API to dispatch a canary | partial hosted integration | `packages/cli/src/monitor.ts` | one test |
| `mcp` | `--print-config` | prints agent configuration or starts JSON-RPC over stdio | partial because five registered tools are stubs | `packages/cli/src/index.ts`, `packages/mcp/src/server.ts` | none |
| `precommit` | `--timeout <ms>` | local secrets/injection/AI subset; fail-open on timeout; blocks high-confidence high/critical findings | shipped bounded fast path | `packages/cli/src/precommit.ts` | none |
| `attest` | `--report`, `--sign`, `--verify-url` | checks Studio entitlement, prints parsed options, returns `78`; creates no bundle/signature | partial alpha shell | `packages/cli/src/attest.ts`, `packages/attest/src/index.ts` | none |
| `init` | `-y, --yes` | creates `.verglos.config.js` with consent; optionally installs hook; `--yes` never installs hook | shipped | `packages/cli/src/init.ts` | none |
| `explain [rule]` | `--list` | lists or renders entries from the shared explain bank | shipped for banked rules | `packages/cli/src/explain.ts`, `packages/shared/src/explain-bank.ts` | none |

## Detector inventory

The scanner registers 11 detector implementations and currently emits 44 literal rule IDs. A normal CLI `scan` starts with seven Free detectors, appends three capability-gated Pro detectors, and separately enables git history. The library-level default is only the seven Free detectors.

| Detector | Rules | Current scope | Default CLI `scan` | State | Direct tests |
|---|---|---|---|---|---|
| `secrets` | pattern-specific IDs plus `D4-002` | file secret patterns; context shaping; optional GitHub/Stripe live checks | yes | shipped | 1 golden test |
| `dependencies` | `D6-001` | npm manifest/lock versions queried against OSV | yes | shipped, fail-soft network | none |
| `misconfig` | `D5-001..004`, `D4-003`, `D8-001` | env/gitignore, CORS, eval, random security values, logs, Next.js headers | yes | shipped | context tests only |
| `injection` | `D1-001..007`, `D3-001`, `D9-002` | SQL/command/XSS/NoSQL/path/SSRF and related input-flow patterns | yes | shipped | indirect context tests |
| `git-history` | `D8-002` | last 50 commits via `git log -p` for secret patterns | separately enabled | shipped, bounded and fail-soft | none |
| `ai-patterns` | `AI-001..004`, `AI-007..010` | common AI-generated insecure code shapes | yes | shipped | indirect context tests |
| `slopsquat` | `AI-005`, `AI-006` | npm existence and edit-distance check against embedded popular package list | yes | shipped, cached/fail-soft network | none |
| `vendored-cves` | `D6-002` | recognize vendored JS library versions and query OSV | yes | shipped, fail-soft network | none |
| `agent-surface` | `AGENT-001..005` | MCP allowlists, env credentials, pinning, filesystem scope, transport | entitled Pro pack | shipped detector | 12 tests |
| `api-hardening` | `API-001`, `API-002`, `API-004`, `API-005` | rate limits, body limits, credentialed CORS, Helmet | entitled Pro pack | shipped detector | 17 tests |
| `deep-auth` | `AUTH-001..006` | JWT, comparison, cookie, password hash, session secret patterns | entitled Pro pack | shipped detector | 19 tests |

Post-detection behavior is also shipped: confidence filtering, production/test/placeholder/enum classification, ten noise context tags, severity downgrade with original severity retention, per-domain score caps, strict-mode inclusion, unsupported-language `N/A` protection, and optional repo provenance. Evidence: `packages/scanner/src/context*.ts`, `context-tags.ts`, `provenance/*`, and `packages/shared/src/types.ts`.

## Reports and local artifacts

| Artifact/state | Current behavior | State | Evidence |
|---|---|---|---|
| terminal summary | score/risk, counts, provenance headline, findings, verification count, report path | shipped | `packages/reporter/src/terminal.ts` |
| `verglos-report.json` | full `ScanResult` plus `schemaVersion: "2.0.0"`; missing verification becomes `null` | shipped legacy schema | `packages/reporter/src/json.ts` |
| `verglos-report.html` | standalone local report grouped by domains with legacy verification labels | shipped legacy UI | `packages/reporter/src/html.ts` |
| score baseline | `~/.verglos/last-scores.json` for full-scan momentum | shipped | `packages/cli/src/credentials.ts`, `scan.ts` |
| config | reads `.verglos.config.js` and `.verglosignore` | shipped with gaps | `packages/scanner/src/index.ts`, `packages/shared/src/config.ts` |
| canonical `.vgl` Release Record | no implementation | planned | final architecture and command/UI contract |
| SARIF/SBOM/VEX/provenance import/export | no implementation | planned | final architecture and backlog |

Known report/config gap: `reportFormat` is accepted by config, but `writeReports` always writes both HTML and JSON. `secretScanDepth` is configured, while git-history currently uses a fixed last-50-commit command. These are compatibility/migration inputs, not shipped configurability claims.

## MCP tool inventory

| Tool | Network | Current behavior | State |
|---|---|---|---|
| `verglos_check_before_write` | no | scans one temporary snippet with secrets, injection, and AI-pattern detectors; returns allow/warn/block and limited AI-002 correction | shipped, bounded fast path |
| `verglos_check_package` | npm + OSV | package existence, embedded-list typo distance, CVEs | shipped, fail-soft network |
| `verglos_scan` | npm + OSV; local git subprocesses | full library scan with git history/provenance, summarized to a default 20 findings | shipped; no plan-selected Pro packs |
| `verglos_explain_finding` | no | shared explain-bank lookup | shipped |
| `verglos_hunt_finding` | no action | structured alpha error | partial shell |
| `verglos_hunt_report` | no action | structured alpha error | partial shell |
| `verglos_hunt_before_write` | no action | structured alpha error | partial shell |
| `verglos_hunt_explain_verdict` | no action | structured alpha error | partial shell |
| `verglos_attest` | no action | structured alpha error | partial shell |

There are no direct MCP protocol, schema, dispatch, isolation, timeout, or adversarial-input tests in the current repository.

## Outbound request inventory

“Local scan” currently means source and reports stay on the machine; it does not mean zero network. Default scanning can contact npm, OSV, the entitlement API, the update endpoint, and telemetry unless the specific path or option disables them. Full payload/privacy classification belongs to `TRUTH-007`.

| Trigger | Destination/path | Data sent | Control/failure behavior | Evidence |
|---|---|---|---|---|
| pre-action/update | `registry.npmjs.org/verglos/latest` | HTTP metadata request | 3s timeout; update gate fail-open on lookup failure; explicit updater exits on failure | `packages/cli/src/update.ts` |
| dependency detector | `api.osv.dev/v1/query` | npm package name and version | catches errors as no vulnerabilities | `detectors/dependencies.ts` |
| vendored-CVE detector | `api.osv.dev/v1/query` | recognized npm package name/version | timeout and fail-soft | `detectors/vendored-cves.ts` |
| slopsquat detector | `registry.npmjs.org/<package>` | dependency name in URL | HEAD, local cache, fail-soft | `detectors/slopsquat.ts` |
| `--verify-secrets` | GitHub `/user`, Stripe `/v1/balance` | matched credential in authorization header | opt-in, timeout; finding records verdict not credential | `scanner/src/live-key-verify.ts`, `detectors/secrets.ts` |
| entitlement resolution | `/api/v1/entitlement/capabilities` | optional license bearer; optional founder `as_plan` query | 5s timeout, cache/JWT/Free fallback | `cli/src/entitlement.ts` |
| telemetry | `/api/v1/telemetry/scan` | fields listed below; optional license bearer | default on; flag/env opt-out; 8s timeout and one retry; fail-open | `cli/src/telemetry.ts` |
| login | `/api/v1/cli-auth/start`, `/status` | device-flow request/status code | explicit command; polling timeout | `cli/src/login.ts` |
| activation/status | `/api/v1/license/validate`, `/status` | license key body or bearer | explicit/identity commands; 5s timeout | `cli/src/license-api.ts` |
| legacy unlock | `/api/license/unlock` | license key and project fingerprint | explicit helper path; error becomes null | `cli/src/credentials.ts` |
| monitor register | `/api/v1/monitor/register` | fingerprint, label, full npm dep name/version list, selected channels, CLI version; optional license bearer | explicit command; response checked | `cli/src/monitor.ts` |
| monitor management | `/api/v1/monitor/registrations`, `/registration/:fp`, `/test-alert` | bearer; fingerprint in path/body where applicable | explicit commands; typed error mapping | `cli/src/authorized-fetch.ts`, `monitor.ts` |
| MCP package check | npm package endpoints and OSV | requested package name/version | tool invocation; 4s soft timeouts | `mcp/src/tools/check-package.ts` |

AWS live-key verification code exists and can send signed STS `GetCallerIdentity`, but the secrets detector does not currently pair access-key and secret-key material, so it does not invoke that path.

## Telemetry fields and controls

`sendScanEvent` constructs these fields:

`event_id`, `fingerprint`, `project_name`, `cli_version`, `node_version`, `platform`, `score`, `finding_critical`, `finding_high`, `finding_medium`, `finding_low`, `finding_info`, `ai_authored_percent`, `has_provenance`, `verify_secrets`, `duration_ms`, and `detectors`.

- `fingerprint` is derived from git remote, package name, and resolved project root; the server receives only the derived value.
- `project_name` can expose a repository owner/name or package name and therefore must not be described as “no identity” without qualification.
- A stored license key is sent as the Authorization bearer so hosted score history can associate a scan with an account.
- Disable per scan/CI with `--no-telemetry` or globally with `VERGLOS_TELEMETRY=0` (`0`, `false`, `off`, or `no`).
- `VERGLOS_DEBUG` prints endpoint, fingerprint prefix, project name, and whether auth was present to stderr.
- A first-run disclosure marker is written at `~/.verglos/telemetry-disclosed`.

No source contents, file paths, finding titles/descriptions/snippets, or matched secret values are present in the constructed telemetry JSON. Server-side storage/retention must be verified in `TRUTH-002` and `TRUTH-007`.

## Entitlement and plan inventory

Current plan vocabulary is not canonical and must not be normalized silently:

- `packages/shared/src/plans.ts`: `free | pro | studio | enterprise`.
- `packages/shared/src/config.ts`: `free | pro | studio | compliance`.
- `packages/entitlement/src/types.ts`: `free | pro | studio | compliance | founder`.
- `packages/cli/src/tier-defaults.ts`: `free | pro | studio | enterprise | founder`, with `compliance` normalized to `enterprise`.
- The final V1 target introduces `Team`; current CLI code has no Team tier.

Resolution order is REST capabilities, bounded cached REST, verified signed JWT plus baked-in tier defaults, then Free. REST cache and JWT offline grace are capped at seven days. Capability aliases and names also coexist (`scan.core` and `scan`, `fix.auto` and `fix`, `monitor.cve` and `monitor_register`). Exact cross-repository reconciliation is `TRUTH-004`.

## Current test evidence and uncovered surfaces

| Suite | Tests | What it establishes | Material gaps |
|---|---:|---|---|
| scanner context/noise | 9 | context classification, tag exclusions, score floor, selected regressions | no broad frozen corpus/determinism test |
| scanner secrets | 1 | one Next.js noise-suppression golden case | no live-key transport tests |
| agent surface | 12 | five rule families and metadata | no malformed/oversized config suite |
| API hardening | 17 | four rule families and negative cases | regex-only scope remains |
| deep auth | 19 | six rule families and negative cases | regex-only scope remains |
| entitlement package | 8 | signed JWT parsing, signature, rotation, tamper, expiry/grace | no server integration |
| CLI entitlement/tier | 17 | cache/JWT fallback, public helper, tier superset/mirror guard | no full command process journeys |
| CLI fix | 10 | Next config declaration matching/patch output | no filesystem or framework end-to-end fixture |
| CLI monitor | 7 | status/list errors, unregister, canary request | no register, channel-validation, auth, or hosted delivery journey |

No runnable tests directly cover dependencies, vendored CVEs, slopsquat, git history, provenance aggregation, reporter serialization/rendering, score/scan/CI command processes, updater, login, activate, whoami, badge, hook, precommit, init, explain, MCP protocol/dispatch, Hunt, or Attest.

## Truth corrections raised by this inventory

1. There are 19 top-level commands, not a smaller scan-only surface; compatibility work must preserve or intentionally migrate all of them.
2. Hunt, Attest, four MCP Hunt tools, and MCP Attest are executable shells, not verification or signing implementations.
3. The four functional MCP tools have no direct tests.
4. Default `scan` performs multiple network operations. `precommit` and `check_before_write` are the bounded network-free scan paths.
5. `score`, `badge`, and `ci` do not use the same detector-selection wrapper as `scan`; their coverage claims must remain distinct until reconciled.
6. Configuration accepts options that the execution/report path does not honor (`reportFormat`, `secretScanDepth`).
7. Legacy verification values are `true | false | not_attemptable | null`; they are not the final V1 verification-state contract.
8. Monitoring CLI calls are implemented, but “hourly/daily monitoring and alert delivery” remains a hosted end-to-end claim pending `TRUTH-002`.
9. Telemetry includes a derived project name and may include a license bearer; the short “no identity” wording is too broad.
10. Current plan and capability vocabularies conflict internally and lack Team.

These findings become inputs to `TRUTH-002`, `TRUTH-004`, `TRUTH-007`, `TRUTH-010`, and `TRUTH-013`. No runtime behavior changed in this inventory.
