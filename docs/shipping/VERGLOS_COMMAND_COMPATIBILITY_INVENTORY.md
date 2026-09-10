# Verglos command compatibility inventory

Status: governing current-surface baseline for `TRUTH-010`

Reviewed: 2026-09-08

Implementation baseline: `9bbf87e`

Runtime baseline: `verglos@2.0.0-alpha.1`, Node.js `>=20`, Commander 14

Scope: the current executable CLI syntax, aliases, defaults, filesystem/network effects, output artifacts, exit behavior, compatibility risks, and required process-level fixtures. Target commands in `VERGLOS_COMMAND_AND_UI_CONTRACT.md` remain planned unless listed here.

## Compatibility policy

1. Preserve current command names, accepted flags, local artifact readability, and intentional exit behavior until a versioned replacement and compatibility fixture exist.
2. Observed defects are not promoted into permanent product philosophy. They are recorded so a fix is deliberate, release-noted, tested, and—where scripts can depend on it—introduced through an alias, warning, schema version, or bounded compatibility path.
3. Human terminal prose may improve, but scripts must use a versioned machine contract. The current CLI has almost no stdout JSON mode; do not invite parsing of colorized prose as an API.
4. Adding a command or optional flag is normally additive. Changing a default detector, network action, report filename/schema, destructive side effect, entitlement result, or exit code is a compatibility change even if syntax stays the same.
5. Free local scanning and existing readable reports survive migration. Later server authorization may protect hosted work, but a client update cannot convert a formerly local artifact into an unreadable hosted-only format.
6. Shells remain honest shells. Replacing Hunt/Attest exit 78 with functional work occurs only when their acceptance gates pass; legacy unsigned summaries never become signed records by command reuse.
7. Every command process fixture controls time, network, home directory, terminal/color, locale, current directory, and server responses. Tests never contact production services.
8. Blog and landing-page command copy remains out of scope until the final pass.

## Executable root surface

The root help exposes 19 top-level commands plus Commander's `help [command]` pseudo-command:

`update`, `scan`, `score`, `secrets`, `deps`, `ci`, `fix`, `hunt`, `login`, `activate`, `whoami`, `badge`, `hook`, `monitor`, `mcp`, `precommit`, `attest`, `init`, and `explain`.

Current root options are:

| Syntax | Current behavior | Compatibility state |
|---|---|---|
| `-v, --version` | Prints installed package version and exits successfully. | Preserve exact semantic version source and zero exit. |
| `-h, --help`, `help [command]` | Commander-generated help plus repeated command-groups footer. | Preserve command discoverability; prose/layout is not a machine contract. |
| `--update` | Early alias that calls the same global npm updater before Commander parsing, then exits 0 if the updater returns. | Preserve until an explicit deprecation; test parity with `update`. |
| `--as-plan <plan>` | Visible founder-only simulation propagated through `VERGLOS_AS_PLAN`; help names `free|pro|studio`. | Internal/legacy surface. Must not authorize hosted access; future removal needs founder tooling replacement and a clear error. |

Before every parsed command except `update`, a pre-action hook requests `https://registry.npmjs.org/verglos/latest`. If it believes a newer version exists, it prints an error and exits 1; lookup failure is ignored. `VERGLOS_DEV_SKIP_UPDATE_CHECK=1` bypasses this for maintainers and is not a public user contract. This mandatory gate, its prerelease comparison, and the absence of a supported offline switch are explicit migration risks.

There is no current global `--json`, `--quiet`, `--config`, `--policy`, `--cwd`, or offline/network-policy option. `scan` accepts no path argument and all project commands use the process current working directory. The target contract cannot assume those surfaces already exist.

## Current command behavior

| Command and accepted options | Default work and observable output | Exit behavior | Compatibility notes |
|---|---|---|---|
| `update` | Fetch npm latest; if newer, spawn `npm install -g verglos@latest` with inherited stdio; otherwise print current status. | 0 on current/success; 1 on metadata or install failure. | Bypasses the root update gate. Global install and prerelease ordering need platform/process fixtures. |
| `scan` with `-w/--watch`, `-q/--quiet`, `--all`, `--strict`, `--no-provenance`, `--verify-secrets`, `--hunt`, `--no-telemetry` | Full wrapper selects seven Free detectors plus entitled packs, includes git history by default, writes/overwrites both reports, prints summary/momentum unless quiet, persists full-scan score, and may send telemetry. Watch rescans on change and ignores common build/report paths. | One-shot exits 0 unless an unhandled error occurs; returned score is not a process status. Watch runs until signal. | `--hunt` only prints an alpha message. `--all` lowers confidence floor. Quiet still writes reports and can send telemetry. No path/JSON option. |
| `score [--strict]` | Runs scanner defaults and prints score only; no report, momentum persistence, or telemetry wrapper. | 0 unless unhandled error. | Detector selection differs from `scan`; preserve as observed until unified intentionally. |
| `secrets` | Focused secrets detector, provenance off, git-history still enabled, writes both reports, no momentum/baseline persistence, may send telemetry. | 0 unless unhandled error. | No `--verify-secrets`, quiet, strict, all, path, or telemetry flag despite environment opt-out. |
| `deps` | Focused dependencies detector, provenance and git history off, writes both reports, no momentum/baseline persistence, may query OSV and send telemetry. | 0 unless unhandled error. | No offline, quiet, strict, path, or telemetry flag despite environment opt-out. |
| `ci` with `-t/--threshold <score>` default string `60`, `-q/--quiet`, `--strict`, `--hunt`, `--no-telemetry` | Runs scanner defaults, prints summary unless quiet, sends telemetry unless disabled, writes no report. Always fails on a critical. Paid plans also compare score with parsed threshold; Free ignores the threshold and prints an upgrade note. | 0 pass; 1 critical, paid threshold failure, or denied Hunt gate. | `parseInt` is not validated, so malformed thresholds can avoid comparison. `--hunt` may exit during capability gate; if allowed it only prints fallback shell copy. |
| `fix` | Requires capability, then modifies/creates supported Next.js header configuration and reports changes. | 1 when entitlement is denied; otherwise 0 unless unhandled error, including no applicable fix. | Current promise is header injection only. File mutation and idempotence must stay bounded; no preview/diff flag exists. |
| `hunt` with `--severity`, `--sandbox`, `--dry-run`, `--finding` | Checks plan, prints parsed options, performs no sandbox verification. Defaults are `critical,high`, `auto`, no dry run, all eligible findings. | 3 when plan denied; 78 when entitled shell is reached. | Both exit values are externally observable and differ from the target exit vocabulary. Functional replacement requires explicit compatibility decision. |
| `login` | Starts device flow, prints short/direct URLs and user code, tries to open browser, polls up to 15 minutes, and stores returned license/account data. | 0 success; 1 start, denial/expiry, polling, or timeout failure. | Browser-open failure is ignored. Network/time and credential-file behavior need deterministic fakes. |
| `activate <licenseKey> [--ci]` | Validates remotely and persists raw license plus plan/expiry/token; prints activation/renewal. | 0 success; invalid non-CI is 1; invalid `--ci` is 2. | License is a positional secret and may enter shell history/process listings. CI changes only failure code/copy, not transport. |
| `whoami` | Without a key prints Free. With a key fetches status, masks key, prints account/plan/renewal/machine/projects, and refreshes cache; network failure shows cached state. | 0 for Free, live success, network fallback, and most unknown sync failures; 1 for invalid/not-found stored key. | Output is human/localized dates. No JSON. Full server status currently returns raw key before CLI masks it. |
| `badge` | Runs scanner defaults and prints Shields.io Markdown based on score; writes no report through this wrapper. | 0 unless unhandled error. | Network/detector coverage differs from `scan`; stdout must remain one parseable Markdown line if treated as script output. |
| `hook` | Writes `.git/hooks/pre-commit` calling `npx verglos precommit`, replacing any existing file content, and then prints installed/bypass copy. | 0 even when hook write is swallowed; unhandled errors outside helper may fail. | Destructive overwrite and false-success-on-write-failure are defects requiring migration, backup/merge, and fixtures—not silent preservation. |
| `monitor` | Parent help only; subcommands below. | Commander behavior when no subcommand. | Capability is checked independently by every child. |
| `mcp [--print-config]` | With flag, prints JSON config plus human setup/tool list and exits. Without flag, starts long-lived stdio MCP server with nine tools. | Print mode 0; server until EOF/signal or failure. | Mixed JSON and prose means stdout is not a pure machine JSON document. Protocol framing must never be polluted by logs. |
| `precommit [--timeout <ms>]` default `2000` | Runs secrets/injection/AI-pattern detectors with no git history/provenance/network-producing detectors; prints pass or up to 10 blocking high/critical findings. | 1 on blocking findings; 0 on pass and deliberately 0 on timeout. | Timeout uses `Promise.race` without cancelling scanner work. Invalid timeout is not validated. Fail-open timeout is current behavior. |
| `attest` with `--report`, `--sign`, `--verify-url` | Checks plan, prints parsed defaults/options, creates/signs/uploads nothing. Defaults report to `verglos-report.json` and URL base to `https://verglos.com/verify`. | 3 when plan denied; 78 when entitled shell is reached. | Options are placeholders, not evidence. Functional record commands remain a separate contract with legacy alias handling. |
| `init [-y/--yes]` | Writes `.verglos.config.js`; interactively asks before overwrite and hook install. `--yes` preserves existing config and never installs hook. | 0 unless an unhandled config write error. | Template includes legacy plan names and config fields not fully honored. Hook helper can swallow failure after UI says installed. |
| `explain [rule] [-l/--list]` | No rule or `--list` prints all explain-bank rules; known rule prints why/fix/example/references. | 0 list/known; 1 unknown. | Static local operation. Rule IDs are compatibility keys and renamed IDs require aliases. |

### Monitor subcommands

| Subcommand and options | Current behavior | Exit behavior and compatibility risk |
|---|---|---|
| `monitor register --email <address> | --slack <url> | --webhook <url> [--label <name>]` | Requires `monitor_register`; computes fingerprint; reads npm lock/package dependencies; uploads label, full dependency set, selected destinations, and CLI version. At least one channel is required. | 0 success; 1 capability, validation, fingerprint/dependency, auth, network, or HTTP failure. No timeout/preview. Wording promises hourly monitoring and unsupported digest behavior elsewhere must not be treated as a stable service guarantee. |
| `monitor status` | Requires capability; fetches and prints registrations, fingerprint prefixes, dependency count, channel booleans, timestamps, and seven-day alert count. | 0 success/empty and also 0 on server 501; 1 on other failures. The 501-as-success compatibility quirk must be handled explicitly. |
| `monitor unregister [--project-fingerprint <fp>]` | Uses supplied or current-project fingerprint; sends DELETE; prints success. | 0 success, 404, or 501; 1 other failure/fingerprint failure. Idempotent not-found behavior is intentional; 501-as-success is legacy. |
| `monitor test-alert [--project-fingerprint <fp>]` | Uses supplied/current fingerprint; requests canary and prints channel booleans. | 0 success and 501; 1 other failures. Current success message can appear even if response marks no channel delivered. |

## Filesystem and machine-output contract

| Artifact | Producer | Current semantics | Compatibility requirement |
|---|---|---|---|
| `verglos-report.json` | `scan`, `secrets`, `deps` | Overwritten in project root; top-level `schemaVersion: "2.0.0"`; finding `verified` is normalized to explicit `null` when absent. | Preserve reader for every supported schema; new domain contract receives a new version/migration, never silent shape replacement. |
| `verglos-report.html` | Same focused/full scans | Overwritten self-contained local report in project root. | Remain locally readable; no implicit hosted fetch/upload. |
| `.verglos.config.js` | `init` | CommonJS template; may overwrite only after interactive confirmation. | Continue reading existing config/legacy aliases until versioned migration and warnings exist. |
| `.git/hooks/pre-commit` | `hook`, optional `init` | Entire file replaced with a shell hook invoking `npx verglos precommit`; mode `0755` requested. | Future implementation must preserve/chain existing hooks and report real write outcome; regression fixture protects user content. |
| `~/.verglos/credentials.json` | login/activate/whoami | Raw credential/account/token cache, umask-dependent. | Privacy/security migration preserves sign-in or provides recoverable re-auth; never print raw secret. |
| `~/.verglos/last-score.json` | full `scan` | Baseline keyed by transformed absolute root; focused scans do not update it. | Momentum compatibility must not consume focused scores; privacy migration may remap keys explicitly. |
| MCP stdio frames | `mcp` | JSON-RPC over stdout; nine registered tool contracts. | Version/tool-schema fixtures and clean stdout are mandatory; stderr only for diagnostics. |

`score`, `badge`, and `ci` call `runScan` directly, while `scan`/focused commands use the CLI detector-selection/report wrapper. That difference is current truth, not evidence that they have equivalent coverage.

## Environment and configuration compatibility

| Input | Current effect | Status |
|---|---|---|
| `VERGLOS_API_URL` | Overrides hosted origin used by credentials and authenticated requests. | Development/advanced surface with a security gate required by `TRUTH-007`; do not silently remove without test-server replacement. |
| `VERGLOS_TELEMETRY` | `0`, `false`, `off`, or `no` disables scan/CI telemetry. | Preserve as hard opt-out through consent redesign. |
| `VERGLOS_DEBUG` | Enables telemetry diagnostic stderr with project identity metadata. | Diagnostic surface; future redaction can intentionally reduce output. |
| `VERGLOS_AS_PLAN` | Consumed by entitlement resolution; root `--as-plan` sets it. | Internal founder compatibility only; never hosted authority. |
| `VERGLOS_DEV_SKIP_UPDATE_CHECK` | Value `1` bypasses mandatory update lookup/gate. | Maintainer-only, not public compatibility promise. |
| `.verglos.config.js` | Scanner loads plan, failure thresholds, ignore paths, history depth, report format, and hook preference fields. | Current execution does not honor every declared field (`reportFormat`, `secretScanDepth` were identified as drift); freeze parsing fixtures and correct behavior deliberately. |

## Required compatibility fixture matrix

Every top-level command has at least one named process fixture below. `TRUTH-013` runs the existing unit baseline; these are requirements for the implementation tasks that alter each surface.

| Fixture ID | Command coverage | Required assertions |
|---|---|---|
| `compat.root.help-version-errors` | root/help/version/unknown command | 19 commands present, current options/aliases parse, version source, help success, unknown/invalid option code and stderr. |
| `compat.update.current-upgrade-failure` | `update`, `--update`, global pre-action | Current, newer, registry-offline, npm failure, prerelease comparison, Windows `npm.cmd`, non-update forced gate, alias parity. No real registry/install. |
| `compat.scan.clean-findings-options` | `scan` | Clean/finding fixtures still exit 0; both reports/schema; quiet/all/strict/provenance/live-secret/hunt/telemetry combinations; full baseline/momentum; network manifest. |
| `compat.scan.watch` | `scan --watch` | Initial scan, ignored/report change, source change debounce/concurrency, repeat artifacts/telemetry, signal shutdown and watcher cleanup. |
| `compat.score.stdout` | `score` | One score presentation, strict behavior, no report/baseline/telemetry, detector manifest. |
| `compat.secrets.focused` | `secrets` | Only secret detector plus current git-history behavior, focused report, no momentum/baseline, telemetry/env opt-out. |
| `compat.deps.focused` | `deps` | Only dependency detector, no provenance/git history, OSV success/failure/incomplete migration, reports, telemetry/env opt-out. |
| `compat.ci.free-paid-matrix` | `ci` | Critical, exact threshold, below threshold, Free ignored threshold, paid threshold, quiet/strict, malformed values, telemetry, Hunt shell/capability, no report. |
| `compat.fix.headers` | `fix` | Denied plan, each supported framework shape, existing headers, created helper/config, idempotence, unsupported project, write failure, no unrelated diff. |
| `compat.hunt.alpha-shell` | `hunt` | Denied 3, entitled 78, defaults and every option rendered, no subprocess/network/file mutation. Replacement fixture later proves new safe behavior and intentional exit transition. |
| `compat.login.device-flow` | `login` | Start failure, URL/code, browser failure, pending/slow-down if supported, success persistence, deny/expire/timeout, polling cleanup and no secret logs. |
| `compat.activate.matrix` | `activate` | Each server reason, network, success/token/cache, masked/no secret output, non-CI 1 versus CI 2, endpoint trust. |
| `compat.whoami.matrix` | `whoami` | No key Free, live active/inactive/founder, machines/names, network cached 0, invalid key 1, locale-stable machine output alternative. |
| `compat.badge.stdout` | `badge` | Exact Markdown/color bands at score boundaries, no report/telemetry, detector/network manifest, clean stdout. |
| `compat.hook.preserve-user-hook` | `hook` | Current overwrite and false-success are captured as known defects; target backup/chain/idempotence/mode/write-failure behavior preserves original bytes. |
| `compat.monitor.register` | monitor register | Capability/channel validation, lock/package fallback, private/5,000 dependencies, label/fingerprint, payload preview target, auth/status/network/timeout, no secret logs. |
| `compat.monitor.status` | monitor status | Empty/list rendering, channel flags/times/counts, auth/network/status map, current 501 zero behavior. |
| `compat.monitor.unregister` | monitor unregister | Explicit/current fingerprint, URL encoding, success, idempotent 404, 501, auth/network, no deletion outside owner. |
| `compat.monitor.test-alert` | monitor test-alert | Explicit/current fingerprint, channel combinations, no-delivery response, auth/network/501, canary idempotency and destination redaction. |
| `compat.mcp.print-protocol` | `mcp` | Print-config exact JSON object plus current prose; stdio initialize/list/call for all nine tools, schemas/errors, EOF/signal, no stdout pollution. |
| `compat.precommit.pass-block-timeout` | `precommit` | Pass 0, up to 10 findings/block 1, test/placeholder/confidence exclusions, custom/malformed timeout, timeout 0 and eventual-work cleanup, no network/reports. |
| `compat.attest.alpha-shell` | `attest` | Denied 3, entitled 78, defaults/options rendered, no read/sign/upload. Later legacy alias fixture prevents unsigned-summary confusion. |
| `compat.init.interactive-yes` | `init` | New/existing config, overwrite yes/no, `--yes` preserves existing and skips hook, non-git, hook write failure, exact template parse. |
| `compat.explain.list-known-unknown` | `explain` | No-rule/list parity, stable rule IDs/count, known sections/references, unknown 1, local/no-network. |

All fixture snapshots strip ANSI only when the assertion targets semantic text; separate TTY/color tests preserve readable terminal behavior. Dates, durations, random IDs, paths, home directories, versions, and network responses are injected or normalized. Windows/macOS/Linux path and executable differences are included where commands touch hooks, npm, paths, permissions, or signals.

## Planned-contract deltas requiring explicit migration

| Planned delta | Current conflict | Required compatibility treatment |
|---|---|---|
| Common `--help --json --quiet --config --policy` | Only help is universal; quiet is scan/CI only; no command JSON/config/policy flags. | Add and test per command, define stdout/stderr and schema versions; never claim current support. |
| `scan [path]` and target/record/evidence/policy/report/diff commands | Current scan is cwd-only and those command groups do not exist. | Additive syntax with path normalization/security; old cwd invocation stays valid. |
| Target exits `0/1/2/3/78` | Current commands use these inconsistently; shells return 3 when denied, CI uses 1, activate CI uses 2, most thrown errors are uncontrolled. | Freeze command-specific matrix, introduce centralized errors, and release-note intentional transitions. |
| No empty success on incomplete engines | Current OSV failures can look clean and monitor 501 can return 0. | Add explicit incomplete status/exit 3 while preserving a bounded legacy mode only if required by supported automation. |
| Consent-first network/upload/sign actions | Current default scan performs background lookup/telemetry and shells parse upload/sign-looking flags. | Network preview/policy and affirmative consent; shell flags remain no-op until safe implementation, then explicit action preview. |
| Canonical `.vgl` record commands | Current `attest` shell and hosted unsigned summary use different semantics. | Add `record create/sign/verify`; retain `attest` only as an honest deprecated alias after compatibility decision. |
| Normalized plan/capability catalog | Current raw/legacy capability names and `--as-plan` vocabulary omit Team. | Decode aliases at boundary; hosted server remains authority; unknown target values do not break old Free local work. |
| Report/evidence schemas | Current JSON is `schemaVersion: 2.0.0` `ScanResult`, not the final subject/observation/decision record. | Keep old reader/export; add explicit new schema and deterministic migration without overwriting old artifacts silently. |

## Release gate

No command migration is complete until its process fixture runs against the old baseline and new implementation, every intentional difference is classified, help/docs and JSON schema agree, filesystem/network effects are asserted, old artifacts/configs load, supported old CLI/server combinations pass, and rollback/deprecation behavior is demonstrated. Unit tests of internal functions alone do not satisfy command compatibility.

`TRUTH-010` changes no CLI behavior, exit code, artifact, config, network request, blog content, or landing-page content.
