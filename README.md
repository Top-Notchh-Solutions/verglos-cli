# Verglos

**Security scanning built for AI-generated code.** Score any JS/TS repo in under a minute. Catch hallucinated packages, hard-coded secrets, injection sinks, header misconfig, and AI-authored blast-radius — before they ship.

```bash
npx verglos
```

- No install, no config, no signup. First scan is instant.
- Runs 100% locally. Your source code never leaves the machine.
- Free tier is fully unlocked, permanently.

**Website:** [verglos.com](https://verglos.com) · **Account & docs:** [verglos.com/account](https://verglos.com/account) · **npm:** [`verglos`](https://www.npmjs.com/package/verglos)

---

## What Verglos does

| Domain | Detectors |
|---|---|
| Secrets | AWS keys, Stripe keys, GitHub tokens, private keys, in files and 50 commits of history |
| Dependencies | OSV/CVE lookups on your `package-lock.json` (top 50) |
| Supply chain | Slopsquat (hallucinated packages) + typosquat (Levenshtein-close to top-200 popular names) |
| Injection | SQL / command / prototype pollution / XSS sink patterns |
| Misconfig | `.env` in git, exposed `.git/`, permissive CORS, missing security headers |
| AI patterns | Overpermissive `eval`, `dangerouslySetInnerHTML`, unsafe `child_process` |
| AI provenance | Per-file signal aggregation (git trailers, commit shape, code shape, agent artifacts) → repo-level `aiAuthoredPercent` |

The scan produces `verglos-report.html` and `verglos-report.json` next to your code. Open the HTML in a browser or ship the JSON to CI.

---

## Install

`npx` is the recommended way — pins to the latest published version automatically.

```bash
# One-off scan (recommended)
npx verglos

# Global install (avoids the network round-trip)
npm i -g verglos
verglos

# In a project
pnpm add -D verglos    # or npm i -D / yarn add -D
```

Requires **Node.js 20+**. Works on macOS, Linux, and Windows.

---

## Commands

Every command is documented below with an example. See `verglos --help` for the full list, or [verglos.com/account](https://verglos.com/account) for the same in your dashboard.

### `verglos scan` — full security scan

```bash
verglos scan                 # standard scan, writes verglos-report.html + .json
verglos scan --watch         # re-scan on file changes
verglos scan --quiet         # no terminal output; report files still written
verglos scan --all           # include low-confidence findings
verglos scan --strict        # include test file findings in the score
verglos scan --no-provenance # skip AI-authorship analysis (fastest)
verglos scan --verify-secrets # ping GitHub/Stripe APIs to prove matched keys are live (opt-in)
```

### `verglos score` — score only

```bash
verglos score                # prints 0-100 score, nothing else
```

### `verglos ci` — CI mode

Blocks the build on criticals (Free) and on a score threshold (Pro).

```bash
verglos ci                      # exits non-zero on any critical (Free)
verglos ci --threshold 80       # exits non-zero if score < 80 (Pro)
verglos ci --quiet              # suppress output
```

Example GitHub Actions step:

```yaml
- name: Activate Verglos (Pro)
  run: npx verglos activate "$VERGLOS_LICENSE_KEY" --ci
  env:
    VERGLOS_LICENSE_KEY: ${{ secrets.VERGLOS_LICENSE_KEY }}

- name: Verglos CI scan
  run: npx verglos ci --threshold 80
```

### `verglos fix` — auto-remediation [Pro]

Framework-aware fixes for what can safely be auto-fixed today (starting with security headers).

```bash
verglos fix                  # patches next.config.js / creates verglos-security-headers.ts
```

### `verglos secrets` / `verglos deps` — focused scans

```bash
verglos secrets              # secrets only (fastest)
verglos deps                 # dependency CVEs only
```

### `verglos precommit` — fast pre-commit hook

```bash
verglos hook                       # install the pre-commit hook
verglos precommit --timeout 2000   # run under a 2s budget (used by the hook)
```

### `verglos monitor register` — continuous CVE monitoring [Pro]

Registers your dep tree for hourly OSV checks. Alerts to email / Slack / webhook on new criticals.

```bash
verglos monitor register --email you@example.com
verglos monitor register --slack https://hooks.slack.com/services/...
verglos monitor register --webhook https://your.app/verglos-alerts
```

### `verglos mcp` — MCP server for AI agents

Exposes Verglos tools (scan, check-package, check-before-write, explain-finding) to Cursor / Claude Code / Windsurf / Cline.

```bash
verglos mcp                  # start the stdio server (agents call this)
verglos mcp --print-config   # print the JSON snippet you paste into your agent's MCP config
```

### `verglos login` — sign in

Device-code flow (like `gh auth login`). Opens your browser, prints a short code, confirms with one click.

```bash
verglos login                # opens browser, activates within seconds
```

### `verglos whoami` — check your current plan

```bash
verglos whoami
# You:      you@example.com
# Plan:     PRO
# License:  vg_xxxx…yyyy
# Renewal:  Jan 15, 2027 (in 365 days)
# Machine:  a1b2c3d4… (this machine)
```

### `verglos activate <key>` — activate with a license key

For CI use — non-interactive. Validates against the server before saving.

```bash
verglos activate vg_xxxx_yyyy_zzzz         # validates, saves, prints plan
verglos activate $VERGLOS_LICENSE_KEY --ci # exits 2 on failure (no interactive prompts)
```

### `verglos init` — configure

```bash
verglos init                 # interactive setup
verglos init -y              # non-interactive
```

### `verglos explain [rule]` — rule documentation

```bash
verglos explain              # list every rule
verglos explain D2-001       # explain one rule
```

### `verglos badge` — README badge

```bash
verglos badge                # prints markdown you paste into your README
```

### `verglos update` — self-update

```bash
verglos update               # upgrade to the latest npm version
```

---

## Plans

| | Free | Pro ($29/mo) | Studio ($199/mo) |
|---|---|---|---|
| Full scan (all detectors) | Yes | Yes | Yes |
| AI-provenance layer | Yes | Yes | Yes |
| Slopsquat / typosquat | Yes | Yes | Yes |
| MCP server | Yes | Yes | Yes |
| Pre-commit hook | Yes | Yes | Yes |
| Local HTML/JSON report | Yes | Yes | Yes |
| `verglos fix` — auto-remediation | — | Yes | Yes |
| `verglos ci --threshold` | — | Yes | Yes |
| Continuous CVE monitoring | — | Yes | Yes |
| Signed attestations | — | — | Yes |
| SBOM export | — | — | Yes |
| `verglos rotate` (5 providers) | — | — | Yes |

Sign up at [verglos.com/checkout](https://verglos.com/checkout). One-time UPI payment, month-to-month.

---

## Config

Verglos runs with sane defaults. To customize, add a `.verglos.config.js` in the project root:

```js
// .verglos.config.js
module.exports = {
  ignorePaths: ["**/fixtures/**", "**/legacy/**"],
  failOnCritical: true,
  failThreshold: 80,
  secretScanDepth: 100,
};
```

Or drop a `.verglosignore` file for path-only ignores (same syntax as `.gitignore`).

---

## Environment variables

| Var | Effect |
|---|---|
| `VERGLOS_API_URL` | Override the server (default: `https://verglos.com`) |
| `VERGLOS_TELEMETRY=0` | Disable anonymous scan telemetry |
| `VERGLOS_PROVENANCE_FILE_CAP` | Override the 300-file cap on provenance analysis |
| `VERGLOS_AS_PLAN` | [founder only] Simulate a plan (`free` \| `pro` \| `studio`) |
| `VERGLOS_LICENSE_KEY` | Used by `verglos activate --ci` in GitHub Actions |

---

## Privacy

Verglos runs 100% locally. Your source code is never uploaded.

Anonymous scan telemetry (event ID, CLI version, Node version, platform, finding counts, project fingerprint hash, duration) is fired to `verglos.com/api/v1/telemetry/scan` after each scan. No source, no file paths, no findings text, no identity. Disable with `VERGLOS_TELEMETRY=0` or `--no-telemetry`.

Detailed disclosure: [verglos.com/docs/telemetry](https://verglos.com/docs/telemetry).

---

## Repo layout

This is the CLI monorepo. Six packages, all published under the `@verglos` scope (except the bin, `verglos`).

- **`packages/cli`** — the `verglos` bin (npm-published)
- **`packages/scanner`** — detectors, provenance, walker, orchestrator
- **`packages/reporter`** — terminal / HTML / JSON output
- **`packages/shared`** — types, config, fingerprint, plans
- **`packages/entitlement`** — license verification client
- **`packages/mcp`** — MCP server for AI coding agents

## Local development

Requires Node 20+ and pnpm 9.

```bash
pnpm install
pnpm build
pnpm typecheck
```

Bin path after build: `packages/cli/dist/index.js` (invoke with `node <path>`).

---

## Contact

- **Website:** [verglos.com](https://verglos.com)
- **Account:** [verglos.com/account](https://verglos.com/account)
- **Support:** support@verglos.com
- **Issues:** [github.com/Top-Notchh-Solutions/verglos-cli/issues](https://github.com/Top-Notchh-Solutions/verglos-cli/issues)

License: Apache-2.0.
