# Verglos telemetry and privacy inventory

Status: governing baseline for `TRUTH-007`

Reviewed: 2026-09-08

Implementation baseline: `e10584a`

Scope: current CLI, scanner, MCP, and hosted application network behavior; local and hosted persistence; consent, retention, deletion, credential, logging, and upload boundaries across `verglos-cli` and `verglos-web`.

This inventory describes code-observable behavior. Infrastructure logs, database backups, deployment regions, vendor retention, encryption controls, subprocess behavior, and production environment configuration remain unproved until their owners produce operational evidence.

## Governing privacy rules

1. Free local scanning remains useful without signup, source upload, or scan metering.
2. `local` describes where source and findings are processed and stored; it does not imply that every detector performs zero network requests. Every network-producing detector must be named, configurable, and visible before execution.
3. Source, file paths, finding text, snippets, matched secrets, signing material, customer identifiers, and private project names do not leave the machine unless a user explicitly selects a feature whose preview names the exact fields, recipient, purpose, and retention class.
4. Analytics consent is affirmative and revocable. A notice immediately before a default-on request is not consent. Quiet, non-interactive, CI, and agent use default to no analytics.
5. A stable repository fingerprint, project name, license key, account ID, machine ID, IP-derived digest, or destination URL is identifying or pseudonymous data. It must not be called anonymous.
6. Product synchronization and coarse analytics are separate purposes. Authentication for a paid feature must not silently attach identity to an analytics event.
7. No telemetry dataset ships without a named owner, code-enforced retention period, deletion path, access policy, and field-level test proving forbidden content cannot enter it.
8. Credentials are minimized, redacted from logs and errors, written with restrictive permissions, and sent only to an approved TLS endpoint. Endpoint overrides that can redirect a credential require an explicit trust boundary.
9. Upload, publication, and third-party delivery are separate consent events. Public verification must never imply that a project name or summary is private.
10. Support and diagnostics default to metadata. Any requested diagnostic bundle has a local preview and redaction step before upload.

## Consent classes

| Class | Meaning | Current examples | V1 requirement |
|---|---|---|---|
| Local-only | No application-controlled outbound request | Static source detectors, local reports, bounded MCP `check_before_write` | Remain independently usable; subprocesses and enabled adapters must declare any separate network behavior. |
| Background lookup | A scan-time request to a registry or advisory provider | npm package checks, OSV dependency and vendored-CVE queries | Name provider and fields before first use; provide offline/disable controls; report unavailable coverage as incomplete rather than clean. |
| Analytics | Product-usage measurement not necessary to produce the local result | `/api/v1/telemetry/scan` | Default off until durable affirmative consent; no stable project identifier, project name, raw license, source, path, finding, or secret fields. |
| Account operation | User requests authentication, activation, entitlement, history, billing, or monitoring | login, license validation/status, monitor management | The command is consent to the named operation, not to unrelated analytics. Show material fields and persistence before first registration. |
| Secret verification | A matched credential is sent to its owning provider | GitHub, Stripe, AWS STS under `--verify-secrets` | Explicit per-run opt-in, provider allowlist, aborting timeout, no proxy or Verglos relay, no secret logs, and a clear result-retention warning. |
| Third-party delivery | Verglos sends stored customer data to a chosen destination | OSV, Resend, Slack, generic webhook | Explicit channel setup, destination validation, delivery-field preview, retry/redaction rules, and deletion controls. |
| Upload/publication | Evidence leaves the device or becomes retrievable | Target hosted report upload and attestation publication | Separate explicit approval after an exact-field preview; private by default; public state and retention unmistakable. No current CLI source/report upload exists. |

## CLI, scanner, and MCP outbound-request inventory

| Trigger and source | Recipient and request | Fields leaving the device | Current choice/failure behavior | Classification and open gate |
|---|---|---|---|---|
| Every CLI invocation except `update`; `packages/cli/src/update.ts` | `GET https://registry.npmjs.org/verglos/latest`; explicit update later runs `npm install -g verglos@latest` with inherited stdio | Requested package/version path plus normal network metadata; npm itself receives install metadata during update | Default-on. Lookup has a 3-second abort and fails open. Only an internal development skip exists; no supported offline/disable control. | Background lookup. Add a documented offline/update-check control and distinguish freshness unknown from current. |
| Dependency detector; `packages/scanner/src/detectors/dependencies.ts` | Up to 50 `POST https://api.osv.dev/v1/query` requests | npm package name and version | Runs in default full scans and focused dependency paths; fail-soft with no timeout. Failure currently appears equivalent to no vulnerability. | Background lookup. Add consent/configuration, aborting timeout, bounded concurrency, and incomplete-coverage evidence. Private package names can reveal project context. |
| Vendored CVE detector; `packages/scanner/src/detectors/vendored-cves.ts` | Up to 200 OSV query requests | Package name/version inferred from vendored filenames | Included in full scanning; 5-second abort; fail-soft. | Background lookup. Name the provider and mark partial/unavailable results. Filenames are not sent, but inferred component identity leaves the device. |
| Slopsquat detector; `packages/scanner/src/detectors/slopsquat.ts` | npm registry `HEAD /<package>` | Dependency name | Included in full scanning; 3-second abort; local 24-hour existence cache. | Background lookup. A private dependency name enters the registry URL and provider logs. Add offline/disable control and sensitive-package handling. |
| MCP `check_package`; `packages/mcp/src/tools/check-package.ts` | npm `HEAD`, npm `GET /latest`, and OSV query | User/agent supplied package name and optional version | Explicit tool call; 4-second `Promise.race` does not abort the underlying requests. | Agent network action. Tool metadata must declare recipients/fields and require the host's network approval; use aborting timeouts. |
| `scan --verify-secrets`; `packages/scanner/src/live-key-verify.ts` | GitHub `GET /user`, Stripe `GET /v1/balance`, or signed AWS STS `POST GetCallerIdentity` | The matched GitHub/Stripe secret in authorization, or AWS access ID plus a signature derived from the secret; normal network metadata | Explicit flag. Five-second `Promise.race` does not abort the underlying request. Provider response details can enter the finding/report. | Secret verification. Keep direct-to-owner-provider only, add aborting timeout, make providers visible before scan, and warn that username/account/ARN details can persist in reports. |
| Capability resolution; `packages/cli/src/entitlement.ts` | Verglos `GET /api/v1/entitlement/capabilities`, with optional plan simulation query | Raw license bearer when present; requested simulation plan; network metadata | User-visible plan/capability action or paid gate; 5-second abort; cached locally. | Account operation. Never include the raw bearer in logs; restrict trusted API origins and document cached identity/expiry. |
| Scan telemetry; `packages/cli/src/telemetry.ts`, called by `packages/cli/src/scan.ts` | Verglos `POST /api/v1/telemetry/scan`, retried once | Event UUID; stable fingerprint; project name; CLI, Node, and platform versions; score; severity counts; AI-authored percent; provenance/secret-verification flags; duration; detector names; raw license bearer when present | Default-on for `scan`, focused `secrets`/`deps`, watch rescans, and CI. `scan` and CI expose a flag; the environment variable disables all. First-run notice is skipped in quiet and CI and does not ask yes/no. Failures are silent. | Analytics plus paid account synchronization are currently conflated. This blocks the privacy gate: consent is not affirmative, project identity is not anonymous, and paid identity is silently attached. Split the purposes and default analytics off in CI, quiet, agent, and non-interactive execution. |
| Legacy unlock refresh; `packages/cli/src/credentials.ts` | Configured Verglos `POST /api/license/unlock` | Raw license key, stable project fingerprint, 16-hex machine digest derived from hostname and OS username | No timeout; no current caller was found. | Dormant account surface. Remove if obsolete or secure, test, and document before reuse. The machine digest is pseudonymous, not anonymous. |
| License activation/status; `packages/cli/src/license-api.ts` | Configured Verglos validation/status endpoints | Raw license in request body or bearer; fingerprint/machine identity during activation; response includes account/license/machine data | Explicit account commands; 5-second abort. | Account operation. Migrate away from raw-key persistence/echo, minimize status responses, and enforce endpoint trust. |
| Device login; `packages/cli/src/login.ts` | Verglos CLI-auth start and status polling; opens returned verification URL | Device code in query during polling; browser receives verification URL/user code; successful polling returns raw license key | Explicit login; 8-second abort per request; polls at least every 3 seconds for up to 15 minutes. | Account operation. Treat device codes as credentials, keep them out of logs, expire/delete server rows, and replace raw license return where feasible. |
| Monitor register/manage; `packages/cli/src/monitor.ts`, `authorized-fetch.ts` | Configured Verglos monitor endpoints | Raw license bearer; stable fingerprint; default remote-derived project label; CLI version; up to 5,000 dependency names/versions; alert email; Slack and generic webhook URLs | Explicit commands, but registration does not preview the complete payload or downstream OSV/delivery behavior. Registration has no timeout; management requests also lack a common abort policy. | Hosted upload/third-party delivery. Add exact preview/confirmation, aborting timeout, private-package warning, destination redaction, endpoint trust, retention, and delete verification. |

The full current raw-`fetch` inventory is 13 source files: seven CLI files, four scanner detector/verification files, one MCP tool, and `authorized-fetch.ts`. `precommit` and MCP `check_before_write` scan local content in process; `check_before_write` creates and removes a temporary snippet directory. Full MCP scans inherit the enabled scanner detectors and therefore may use npm/OSV.

### Command-level network truth

- `scan` is not presently zero-network by default: update, npm/OSV detectors, and default-on telemetry may run. Watch mode can repeat the latter requests on every rescan.
- `ci` can perform the same update/detector/telemetry requests. CI does not display the interactive disclosure.
- Focused `secrets` and `deps` scans send telemetry but do not expose the command-level `--no-telemetry` flag; the environment variable is the only common opt-out.
- `score` and `badge` do not call `sendScanEvent`, but their scanner execution can still perform npm/OSV lookups.
- `precommit` and `check_before_write` are bounded local scans with current network-producing detectors excluded.
- No current CLI path uploads source files or a generated report to Verglos. Monitor registration uploads dependency metadata and destinations. Live-key verification sends matched secrets directly to the owning provider. The current Attest CLI is a shell and does not call the hosted attestation route.

## Local persistence and credential surfaces

| Local artifact | Stored data | Current retention/protection | Required control |
|---|---|---|---|
| `~/.verglos/credentials.json` | Raw license key, unlock token/expiry, API URL, plan/expiry, email, entitlement JWT | Indefinite until manually removed; directory/file mode depends on umask; non-atomic write | `0700` directory, `0600` atomic file, explicit logout/delete, least-secret replacement, corruption recovery, and permission tests. |
| `~/.verglos/capabilities.json` | Plan, capabilities, activity/reason, simulation and cache expiry data | Indefinite stale file; no explicit permissions | Restrictive atomic write, bounded expiry cleanup, and no identity/secret fields beyond need. |
| `~/.verglos/last-score.json` | Score/critical count keyed by transformed absolute project path | Indefinite; absolute path fragments can expose username/workspace/project names; no explicit permissions | Key by a non-reversible local random mapping or user-visible project store; add cleanup/delete and restrictive mode. |
| `~/.verglos/telemetry-disclosed` | First-notice timestamp | Indefinite; proves notice, not consent | Replace with versioned consent state including choice, policy version, timestamp, and revocation. |
| `~/.verglos/cache/npm-existence.json` | Package names, existence result, check timestamp | Entries expire logically after 24 hours but stale records remain on disk | Bound physical retention, protect private package names, and clear through a privacy command. |
| Generated scan reports | Findings, file references, evidence/context, provider verification detail, score, project metadata | User-chosen local output; persistence follows filesystem behavior | Default local only; redact secrets; warn before public paths; never upload implicitly. |

`VERGLOS_API_URL` currently overrides the trusted service origin and can redirect raw license bearers and product data to an arbitrary endpoint. This is useful for development but is a credential-exfiltration boundary in inherited or manipulated environments. Production builds must enforce HTTPS and an allowlist or present a high-signal explicit trust prompt; debug logs must redact the origin if it contains credentials or sensitive query data.

Current telemetry debug output prints the destination, the first 12 fingerprint characters, full project name, authentication presence, network error messages, and status. It does not intentionally print the raw license, but the project name and provider error content remain sensitive diagnostic data.

## Hosted outbound-request inventory

| Trigger and source | Recipient and fields | Current behavior | Open gate |
|---|---|---|---|
| Hourly monitor cron; `src/lib/monitor/osv.ts` | OSV `querybatch` with every registered npm package name/version, up to the registration limit | No timeout; stored customer dependency snapshot is shared with OSV on each active run | Disclose this during registration; add abort, batching, incomplete-state evidence, provider retention review, and private-package policy. |
| Monitor email; `src/lib/monitor/dispatch.ts` | Resend receives API bearer, recipient email, sender, and message containing project label, CVE ID, package/version, and severity | Skips without API key; no timeout | DPA/subprocessor record, retry/idempotency, redacted failure storage, retention, and channel deletion. |
| Monitor Slack; same source | Customer Slack webhook receives project label, CVE ID, package/version, and severity | No timeout | Redact stored/displayed URL, validate destination, define retry/error retention, and preview fields. |
| Generic monitor webhook; same source | Customer URL receives source/type/project label/CVE/package/version/severity/fired-at data | HTTPS syntax is required; no timeout; redirects, DNS resolution, and private/link-local/loopback destinations are not blocked | Critical SSRF gate: resolve and block non-public targets, revalidate redirects/DNS, cap body/time, sign payloads, and redact URLs/errors. |
| Checkout server routes; `src/app/api/razorpay/create-qr/route.ts`, `qr-status/route.ts`, and Razorpay SDK | Razorpay receives amount, description/duration/close time, internal Clerk and database user IDs in notes, cadence, and QR/payment queries | Explicit checkout. Full SDK errors are logged; selected provider description/code/reason/status are returned to the browser. | Minimize notes, map safe public errors, redact provider objects/request IDs, establish payment retention and deletion policy. |
| Checkout browser; `src/app/checkout/checkout-client.tsx` | Same-origin create/status requests; browser loads returned Razorpay QR image URL | Visitor IP, user agent, referrer behavior, and other request metadata can reach Razorpay's asset host | Disclose payment provider, constrain image origin, set referrer policy, and verify browser CSP/privacy behavior. |
| Authentication/database/hosting | Clerk, Neon/Postgres, and Vercel receive the data necessary to authenticate, persist, execute, and log requests | SDK/platform traffic is not represented by raw `fetch` searches | Vendor DPA/subprocessor, region, encryption, access log, backup, deletion, and exit evidence are mandatory production records. |

The `domains-showcase.tsx` `fetch` string is display content, not an application request. Client calls in checkout and CLI confirmation are same-origin; their downstream server/vendor behavior is listed separately.

## Hosted data inventory and retention truth

| Store | Sensitive or identifying fields | Current retention/deletion truth | Release requirement |
|---|---|---|---|
| `users` | Clerk ID, email | No account deletion workflow found | Account export/correction/deletion contract; reconcile Clerk and database deletion. |
| `licenses` | Raw license key, email/account relation, plan, payment identifiers, expiry/status | Indefinite; key is stored plaintext | Hash/tokenize lookup credentials, never echo a full key, restrict operator access, retain billing records only under a named legal policy. |
| `activations` | License relation, stable project fingerprint/name, machine ID, timestamps | Indefinite; account UI exposes entries | User-visible revoke/delete, retention window, name minimization, and pseudonymous labeling. |
| `reports` | User/license/project relation plus untyped findings JSON | No current ingestion route was found; existing/legacy writes and content constraints are unproved | Define a versioned redacted schema before any upload, reject source/snippet/secret fields server-side, authorize every read, and add deletion/expiry. |
| `heartbeats` | License relation, fingerprint, machine ID, timestamps | Append-only with no cleanup; inbound body carries raw license for lookup | Replace raw body secret, aggregate/minimize, enforce expiry, and test inactive/revoked behavior. |
| `cli_auth_codes` | Device/user codes, Clerk and license relations, expiry/consumption | Logical 15-minute validity; expired/consumed rows are not physically swept | Treat codes as secrets, hash where possible, delete promptly after expiry/consumption, and never log query values. |
| `monitor_registrations` | License, fingerprint/label, complete dependency list, email and webhook URLs | Registration delete exists; no account-wide deletion or time retention | Encrypt/restrict destinations, offer export/update/delete, confirm cascade, and erase inactive registrations after policy expiry. |
| `alert_dispatches` | Project/CVE/package/version/severity, per-channel success/error details | Cascades when its registration is deleted; otherwise indefinite | Bound delivery-log retention and store normalized/redacted error classes rather than provider messages or URLs. |
| `score_history` | License, fingerprint, score/severity counts, CLI version, timestamp | Query windows are bounded but rows have no enforced expiry | Aggregate or expire raw rows; deletion must cover account/project identity. |
| `scan_events` | Event ID, fingerprint, tool/platform versions, score/counts, provenance/verification flags, duration/detectors | Accepted by a public endpoint; no retention, deletion, or application rate limit | Do not accept identifying analytics until consent/retention controls ship; schema allowlist, abuse controls, field tests, aggregation, expiry, and deletion. |
| `attestations` | License, fingerprint, optional project name, score/counts, CLI version, public hash | Indefinite and publicly retrievable; recent project names and summaries also appear on the public verification index | Explicit publication confirmation, private default, immutable/redacted subject contract, owner deletion/revocation, index opt-in, and clear permanence window. |
| `attestation_verifications` | Attestation hash, day-linkable IP digest, user agent, timestamp | Indefinite; default salt falls back to a hard-coded value | No fallback salt, secret rotation, minimize/drop user agent, short enforced retention, notice/legal basis, and aggregate before public use. |

`project_name` sent to the telemetry route is stored in an activation for a valid paid bearer, while the scan-event row omits it. That does not make the event anonymous: its stable fingerprint and bearer can associate it with account/project records. The verification IP digest is likewise pseudonymous and linkable within its daily scope, not anonymous.

No privacy-policy route, data export, account deletion, or complete data-subject workflow was found in application code. Monitor unregister is a narrow deletion path, not an account privacy workflow. Database encryption, backup expiry, production region, restore access, audit logging, and hosting request-log retention are unknown rather than assumed safe.

## Named leakage and misuse cases

| Data class | Current or credible path | Consequence | Gate |
|---|---|---|---|
| Source | No current CLI upload path; a future report/record endpoint or generic support bundle could accept it unless schemas reject it | Proprietary code disclosure | Server-side deny-by-default schemas, exact preview, size/type constraints, and tests with canary source. |
| File paths | Local `last-score.json` embeds transformed absolute roots; findings/reports can carry paths; provider/runtime errors may echo paths | Username, workspace, repository, and customer disclosure | Normalize to project-relative locally, exclude from telemetry/logs, redact exports, and use canary path tests. |
| Finding text/snippets | Local reports contain finding evidence; hosted `reports.findings` is untyped | Vulnerability and code-context disclosure | No implicit upload; versioned redacted hosted schema; reject unknown fields; private authorization and expiry. |
| Matched secrets | Explicit live verification sends credentials to providers; raw licenses cross CLI/web and persist; webhook URLs are credentials | Account compromise and lateral access | Direct approved recipients only, aborting timeouts, secret scanners on logs/tests, hashing/tokenization, restrictive local files, and rotation playbooks. |
| Project/customer identity | Telemetry project name and stable fingerprint, activation labels, monitor payloads, public attestations | Correlation of private/customer work with security posture | Stop calling it anonymous; minimize, separate purpose/consent, private default, deletion, and public-name opt-in. |
| Dependency identity | npm/OSV lookups and monitoring send names/versions; private packages can reveal product/domain names | Technology and roadmap leakage | Offline controls, private-name warning/exclusion, provider disclosure, and incomplete-result semantics. |
| Network destination | Stored Slack/generic webhook URLs and verbose errors; arbitrary `VERGLOS_API_URL` | Credential leakage, SSRF, internal-network probing | Redaction, approved origin policy, outbound egress controls, redirect/DNS validation, signed webhooks, and safe error codes. |
| Identity/access metadata | Clerk/email, machine digest, device code, payment IDs, daily IP digest/user agent | Tracking, impersonation, and account enumeration | Minimize, hash/tokenize, purpose-bound retention, access audit, rate limits, and complete deletion/export. |
| Logs and support | Telemetry debug prints project identity; Razorpay logs full SDK errors; deployment/provider logs are unbounded by code | Persistent disclosure outside primary database | Structured redaction library, forbidden-field tests, log retention inventory, vendor evidence, and reviewed support-bundle flow. |

## Required privacy contract before implementation epics

1. Introduce a versioned data-field registry assigning each field a purpose, sensitivity, owner, recipient, lawful/contractual basis, retention, deletion path, and permitted logs.
2. Split local scan analytics from authenticated score-history synchronization. Analytics is opt-in and coarse; product sync is an explicit account feature with its own preview and control.
3. Replace the disclosure marker with versioned consent. Provide `verglos privacy status`, consent/revoke, local-data list/delete, and network preview controls. Environment opt-out remains a hard override.
4. Default analytics off in CI, quiet, non-interactive, and agent contexts. Agents must surface network/upload/sign actions through host approval instead of inheriting a hidden prior choice.
5. Add an offline/network policy that can independently disable update checks, registry lookups, advisory lookups, live-key verification, hosted product sync, analytics, and delivery.
6. Every request uses an aborting timeout, bounded retry with idempotency where relevant, safe error classes, TLS, response/body limits, and an approved destination policy.
7. Replace raw-license storage/transmission where feasible with one-way lookup hashes, scoped short-lived tokens, and rotation. Never return a full stored license from status endpoints.
8. Harden local state with restrictive permissions and atomic writes; add a single inventory/delete operation that includes caches, consent, credentials, and path-derived history.
9. Add code-enforced expiry/deletion jobs for all hosted tables, backup/log/vendor retention evidence, account export/deletion orchestration, and deletion receipts.
10. Treat public attestation as publication: show exact public fields and index visibility, obtain explicit approval, never accept source/findings/secrets, and support owner revocation without rewriting signed evidence truth.
11. Block generic-webhook SSRF before enabling production delivery. Sign webhook payloads and never store or return a full destination URL after creation.
12. Add canary tests proving that source strings, absolute paths, finding text, snippets, matched secrets, raw license keys, device codes, and full webhook URLs cannot enter analytics, logs, public verification, or support artifacts.

## Acceptance evidence for follow-on work

`OPS-012` owns consented analytics aggregation, raw-event minimization, retention, opt-out, and deletion. Hosted data work owns account/project data rights and tenant isolation. Agent work owns per-action approval. Record work owns publication/redaction. Security work owns credential storage, SSRF, egress, and log redaction. Release gates require all owners to provide executable tests plus production configuration evidence; documentation alone does not close those gates.

`TRUTH-007` changes no application behavior, telemetry setting, stored data, blog content, or landing-page content.
