<p align="center">
  <img src="https://raw.githubusercontent.com/Top-Notchh-Solutions/verglos-cli/main/.github/assets/hero.svg" alt="Verglos — security scanning for AI-generated code" width="100%">
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/verglos">
    <img src="https://img.shields.io/npm/v/verglos?style=flat-square&color=e85d4c&labelColor=18181b&label=npm" alt="npm version">
  </a>
  <a href="https://www.npmjs.com/package/verglos">
    <img src="https://img.shields.io/npm/dw/verglos?style=flat-square&color=a1a1aa&labelColor=18181b&label=downloads" alt="downloads">
  </a>
  <a href="https://github.com/Top-Notchh-Solutions/verglos-cli/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/Top-Notchh-Solutions/verglos-cli?style=flat-square&color=a1a1aa&labelColor=18181b" alt="license">
  </a>
  <a href="https://nodejs.org">
    <img src="https://img.shields.io/node/v/verglos?style=flat-square&color=a1a1aa&labelColor=18181b" alt="node version">
  </a>
  <a href="https://verglos.com">
    <img src="https://img.shields.io/badge/verglos.com-e85d4c?style=flat-square&labelColor=18181b&logoColor=white" alt="verglos.com">
  </a>
</p>

<p align="center">
  <strong>Verglos scans your repo, spots the security issues AI coding agents commonly introduce, and shows you the fix.</strong><br>
  <sub>Runs 100% locally. Your source never leaves the machine. Free tier is fully unlocked, permanently.</sub>
</p>

<p align="center">
  <a href="#quick-start">Quick start</a> ·
  <a href="#what-verglos-catches">What it catches</a> ·
  <a href="#commands">Commands</a> ·
  <a href="#ci-usage">CI usage</a> ·
  <a href="#plans">Plans</a> ·
  <a href="https://verglos.com/account/docs">Full docs →</a>
</p>

---

## Quick start

```bash
npx verglos
```

That's it. Verglos scans the current directory, prints a summary, and writes `verglos-report.html` + `verglos-report.json` next to your code. No install, no config, no signup.

### What you'll see

```
Scanning project... (42s)

  SECURITY SCORE                                          62 / 100

  Critical  2   secrets · deps
  High      5   injection · misconfig
  Medium    12  ai-patterns · misconfig
  Low       31  ai-patterns · injection
  Info      8   misconfig

  AI-authored     ~68% (agent artifacts, git trailers, commit shape)
  Density ratio   1.9× more findings per LOC in AI-authored files

  Full report:  verglos-report.html
```

Open the HTML to drill into every finding, or ship the JSON to CI.

---

## What Verglos catches

<table>
  <thead>
    <tr>
      <th align="left">Domain</th>
      <th align="left">Detectors</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>Secrets</b></td>
      <td>AWS keys, Stripe live/test keys, GitHub tokens, RSA/EC private keys — in-file and across the last 50 commits of git history</td>
    </tr>
    <tr>
      <td><b>Dependencies</b></td>
      <td>OSV / CVE lookups on <code>package-lock.json</code>, top 50 packages</td>
    </tr>
    <tr>
      <td><b>Supply chain</b></td>
      <td>Slopsquat (AI-hallucinated packages) + typosquat (Levenshtein-close to top-200)</td>
    </tr>
    <tr>
      <td><b>Injection</b></td>
      <td>SQL, command, prototype pollution, XSS sinks — pattern-matched with confidence scoring</td>
    </tr>
    <tr>
      <td><b>Misconfig</b></td>
      <td><code>.env</code> in git, exposed <code>.git/</code>, permissive CORS, missing security headers</td>
    </tr>
    <tr>
      <td><b>AI patterns</b></td>
      <td><code>eval</code>, <code>dangerouslySetInnerHTML</code>, unsafe <code>child_process</code></td>
    </tr>
    <tr>
      <td><b>Vendored library CVEs</b></td>
      <td>Parses <code>name@version</code> from vendored files under <code>public/libraries/</code>, <code>vendor/</code>, <code>third_party/</code> and cross-references OSV. Catches CVEs in libraries other scanners skip because they aren't in your lockfile — but they <i>are</i> served to every browser that loads your app.</td>
    </tr>
    <tr>
      <td><b>AI provenance</b></td>
      <td>Per-file signals → repo-level <code>aiAuthoredPercent</code> (git trailers, commit shape, code shape, agent artifacts)</td>
    </tr>
  </tbody>
</table>

---

## Why the findings are actually actionable

Pattern-matching scanners cry wolf. A password-shaped string in `docs/setup.md` isn't a leaked secret — it's a code sample. A `Bearer <token>` in `openapi.yml` isn't a credential — it's an API-spec example. `eval()` in `workers/Evaluation/formEval.ts` isn't a vulnerability — it's the entire point of a low-code platform. Reporting those as "critical" is what makes security tools uninstalled after 90 seconds.

Verglos runs a post-detection **context-tag pass** that downgrades findings whose file path tells you they can't be a production threat. Each downgrade is stamped with a tag so you know *why*:

| Tag | Where it fires |
|---|---|
| `docs` | Markdown, `docs/`, README, CONTRIBUTING, CHANGELOG |
| `dev-fixture` | `.env.example`, `docker-compose*.yml`, `docker/`, Dockerfile |
| `ci-workflow` | `.github/workflows/`, `.gitlab-ci.yml`, `.circleci/`, `.depot/`, `.buildkite/` |
| `test-fixture` | `test/`, `__tests__/`, `cypress/`, `playwright/`, `*.test.*`, `testUtils/` |
| `vendored-bundle` | `public/libraries/`, `vendor/`, `*.min.js`, `.yarn/releases/` |
| `build-config` | `webpack.config.*`, `rspack.config.*`, `vite.config.*` |
| `generated` | `generated/`, `__generated__/`, `.generated.*` |
| `api-spec-example` | `openapi.yml`, `swagger.yml`, `api/v*/*.yml` |

The finding stays visible with severity `info` and the original severity preserved on `originalSeverity`, so nothing is silently dropped — the reader can always ask "why is this info?" and the tag answers.

**Bottom line:** the numbers you see for `critical` and `high` are ones a human security reviewer would care about. The rest is context-tagged, not hidden.

---

## Install

```bash
npx verglos             # one-off, no install
npm i -g verglos        # global (avoids the network round-trip)
pnpm add -D verglos     # in a project
```

Requires **Node.js 20 or newer**. macOS, Linux, and Windows all supported.

---

## Commands

Every command with an example. In-app docs with copy buttons live at **[verglos.com/account/docs](https://verglos.com/account/docs)**.

### `verglos scan` — full security scan

```bash
verglos scan                   # standard scan
verglos scan --watch           # re-scan on file changes
verglos scan --quiet           # no terminal output; reports still written
verglos scan --all             # include low-confidence findings
verglos scan --strict          # include test-file findings in the score
verglos scan --no-provenance   # skip AI-authorship analysis (fastest)
verglos scan --verify-secrets  # ping GitHub/Stripe to prove matched keys are live
```

### `verglos score` — score only

```bash
verglos score                  # prints 0-100 score, nothing else
```

### `verglos ci` — build gate

```bash
verglos ci                     # blocks on any critical (Free)
verglos ci --threshold 80      # blocks if score < 80 (Pro)
```

Free tier still fails on criticals — Verglos is genuinely useful in CI at $0. Threshold enforcement is Pro.

### `verglos fix` — auto-remediation `Pro`

Framework-aware fixes. Today: security headers on Next.js. More rules land every release.

```bash
verglos fix
```

### `verglos secrets` · `verglos deps` — focused scans

```bash
verglos secrets                # secrets only (fastest, <5s on most repos)
verglos deps                   # dependency CVEs only
```

### `verglos login` · `verglos whoami` · `verglos activate`

```bash
verglos login                  # device-code sign-in (opens browser, prints a short code)
verglos whoami                 # show plan, license (masked), renewal, machine
verglos activate <key>         # non-interactive activation
verglos activate $KEY --ci     # CI mode — exit 2 on failure
```

Sample `whoami` output:

```
  You:      you@example.com
  Plan:     PRO
  License:  vg_xxxx…yyyy
  Renewal:  Jan 15, 2027 (in 365 days)
  Machine:  a1b2c3d4… (this machine)
```

### `verglos monitor register` — continuous CVE monitoring `Pro`

Registers your dep tree. The Verglos server checks OSV hourly and alerts on new criticals via email, Slack, or a generic webhook.

```bash
verglos monitor register --email you@example.com
verglos monitor register --slack https://hooks.slack.com/services/...
verglos monitor register --webhook https://your.app/verglos-alerts
```

### `verglos mcp` — MCP server for AI agents

Exposes Verglos tools (`scan`, `check_package`, `check_before_write`, `explain_finding`) to Cursor, Claude Code, Windsurf, and Cline.

```bash
verglos mcp                    # start stdio server (agents call this)
verglos mcp --print-config     # print the JSON to paste into your agent config
```

### `verglos hook` · `verglos precommit` — pre-commit gate

```bash
verglos hook                       # install the pre-commit git hook once
verglos precommit --timeout 2000   # what the hook runs (2s budget by default)
```

### Utilities

```bash
verglos init                   # interactive project config
verglos explain                # list every rule
verglos explain D2-001         # explain one rule
verglos badge                  # print README badge markdown
verglos update                 # self-upgrade to the latest npm version
```

---

## CI usage

Copy-paste snippet for GitHub Actions:

```yaml
name: Verglos
on: [push, pull_request]

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }

      # Free tier — blocks on criticals, works without a key
      - run: npx verglos ci

      # Pro tier — blocks on threshold too. Requires a repo secret.
      # - run: npx verglos activate "$VERGLOS_LICENSE_KEY" --ci
      #   env: { VERGLOS_LICENSE_KEY: ${{ secrets.VERGLOS_LICENSE_KEY }} }
      # - run: npx verglos ci --threshold 80
```

`activate --ci` exits with code 2 on invalid or expired keys, so the job fails fast instead of running the whole scan without Pro features.

---

## Plans

| | Free | Pro |
|---|---|---|
| Full scan (every detector) | Yes | Yes |
| AI-provenance layer | Yes | Yes |
| Slopsquat / typosquat | Yes | Yes |
| MCP server | Yes | Yes |
| Pre-commit hook | Yes | Yes |
| Local HTML + JSON report | Yes | Yes |
| CI mode (block on criticals) | Yes | Yes |
| **CI mode with score threshold** | — | Yes |
| **`verglos fix` — auto-remediation** | — | Yes |
| **Continuous CVE monitoring** (email / Slack / webhook) | — | Yes |
| **Price** | $0 forever | $29 / month |

Upgrade at **[verglos.com/checkout](https://verglos.com/checkout)**. One-time UPI payment, month-to-month, no lock-in.

_Studio ($199/mo — signed attestations, SBOM export, `verglos rotate`) is on the roadmap for v1.5._

---

## Configuration

Sane defaults. Customize with a `.verglos.config.js` in your repo root:

```js
// .verglos.config.js
module.exports = {
  ignorePaths: ["**/fixtures/**", "**/legacy/**"],
  failOnCritical: true,
  failThreshold: 80,
  secretScanDepth: 100,
};
```

Or drop a `.verglosignore` file for path-only ignores — same syntax as `.gitignore`.

### Environment variables

| Variable | Effect |
|---|---|
| `VERGLOS_API_URL` | Override the server (default: `https://verglos.com`) |
| `VERGLOS_TELEMETRY=0` | Disable anonymous scan telemetry |
| `VERGLOS_PROVENANCE_FILE_CAP` | Override the 300-file cap on provenance analysis |
| `VERGLOS_LICENSE_KEY` | Consumed by `verglos activate --ci` in CI |
| `VERGLOS_AS_PLAN` | _Founder only._ Simulate a plan for testing |

---

## Privacy

Verglos runs 100% locally. **Your source code is never uploaded.**

Anonymous scan telemetry (event ID, CLI version, Node version, platform, finding counts, project fingerprint hash, duration) is POSTed to `verglos.com/api/v1/telemetry/scan` after each scan. No source, no file paths, no findings text, no identity, no license key. Disable per-invocation with `--no-telemetry` or globally with `VERGLOS_TELEMETRY=0`.

---

## Support

- **Website** — [verglos.com](https://verglos.com)
- **Account & docs** — [verglos.com/account](https://verglos.com/account) · [verglos.com/account/docs](https://verglos.com/account/docs)
- **GitHub** — [Top-Notchh-Solutions/verglos-cli](https://github.com/Top-Notchh-Solutions/verglos-cli)
- **Issues** — [github.com/Top-Notchh-Solutions/verglos-cli/issues](https://github.com/Top-Notchh-Solutions/verglos-cli/issues)
- **Email** — [support@verglos.com](mailto:support@verglos.com)

License: Apache-2.0.
