# Verglos

**Security scanning built for AI-generated code.** Score any JS/TS repo in under a minute. Catch hallucinated packages, hard-coded secrets, injection sinks, header misconfig, and AI-authored blast-radius — before they ship.

```bash
npx verglos
```

- No install, no config, no signup. First scan is instant.
- Runs 100% locally. Your source code never leaves the machine.
- Free tier is fully unlocked, permanently.

**Website:** [verglos.com](https://verglos.com) · **Account & docs:** [verglos.com/account](https://verglos.com/account) · **GitHub:** [Top-Notchh-Solutions/verglos-cli](https://github.com/Top-Notchh-Solutions/verglos-cli)

---

## What you get

A HTML report and JSON report next to your code:

```
verglos-report.html
verglos-report.json
```

Open the HTML in a browser or ship the JSON to CI. Findings include severity, file:line, why it matters, and a suggested fix.

### Detectors

| Domain | What it catches |
|---|---|
| **Secrets** | AWS keys, Stripe keys, GitHub tokens, private keys — in files and 50 commits of history |
| **Dependencies** | OSV/CVE lookups on `package-lock.json` (top 50 packages) |
| **Supply chain** | Slopsquat (AI-hallucinated packages) + typosquat (Levenshtein-close to top-200 popular names) |
| **Injection** | SQL / command / prototype pollution / XSS sinks |
| **Misconfig** | `.env` in git, exposed `.git/`, permissive CORS, missing security headers |
| **AI patterns** | `eval`, `dangerouslySetInnerHTML`, unsafe `child_process` |
| **AI provenance** | Per-file signals → repo-level `aiAuthoredPercent` (git trailers, commit shape, code shape, agent artifacts) |

---

## Install

`npx` is the recommended way — pins to the latest published version automatically.

```bash
npx verglos            # one-off, no install
npm i -g verglos       # global (avoids the network round-trip)
pnpm add -D verglos    # in a project
```

Requires **Node.js 20+**. Works on macOS, Linux, and Windows.

---

## Commands

Every command is one line. See `verglos --help` for the full list, or [verglos.com/account](https://verglos.com/account) for the same in your dashboard.

### `verglos scan` — full security scan

```bash
verglos scan                  # standard scan
verglos scan --watch          # re-scan on file changes
verglos scan --quiet          # no terminal output; report files still written
verglos scan --all            # include low-confidence findings
verglos scan --strict         # include test-file findings in the score
verglos scan --no-provenance  # skip AI-authorship analysis (fastest)
verglos scan --verify-secrets # ping GitHub/Stripe to prove matched keys are live
```

### `verglos score` — score only

```bash
verglos score                 # prints 0-100 score, nothing else
```

### `verglos ci` — CI mode

Blocks the build on criticals (Free) and on a score threshold (Pro).

```bash
verglos ci                    # exits non-zero on any critical (Free)
verglos ci --threshold 80     # exits non-zero if score < 80 (Pro)
```

GitHub Actions:

```yaml
- name: Activate Verglos Pro
  run: npx verglos activate "$VERGLOS_LICENSE_KEY" --ci
  env:
    VERGLOS_LICENSE_KEY: ${{ secrets.VERGLOS_LICENSE_KEY }}

- name: Verglos CI scan
  run: npx verglos ci --threshold 80
```

`--ci` on `activate` exits 2 on failure (invalid/expired key) so the job fails fast.

### `verglos fix` — auto-remediation [Pro]

Framework-aware fixes for security headers (Next.js today, more shortly).

```bash
verglos fix                   # patches next.config.js / creates verglos-security-headers.ts
```

### `verglos secrets` · `verglos deps` — focused scans

```bash
verglos secrets               # secrets only (fastest)
verglos deps                  # dependency CVEs only
```

### `verglos precommit` · `verglos hook` — pre-commit gate

```bash
verglos hook                       # install the pre-commit hook once
verglos precommit --timeout 2000   # what the hook runs (2s budget)
```

### `verglos monitor register` — continuous CVE monitoring [Pro]

Registers your dep tree for hourly OSV checks. Alerts to email / Slack / webhook.

```bash
verglos monitor register --email you@example.com
verglos monitor register --slack https://hooks.slack.com/services/...
verglos monitor register --webhook https://your.app/verglos-alerts
verglos monitor register --label "prod-api"   # override the auto-detected label
```

### `verglos mcp` — MCP server for AI agents

```bash
verglos mcp                   # start the stdio server (agents call this)
verglos mcp --print-config    # print the JSON to paste into your agent's config
```

Works with Cursor, Claude Code, Windsurf, Cline.

### `verglos login` — device-code sign-in

```bash
verglos login                 # opens browser, prints a short code, activates within seconds
```

No custom URL scheme. No clipboard dance. Same UX as `gh auth login`.

### `verglos whoami` — show current plan + machine

```bash
verglos whoami
# You:      you@example.com
# Plan:     PRO
# License:  vg_xxxx…yyyy
# Renewal:  Jan 15, 2027 (in 365 days)
# Machine:  a1b2c3d4… (this machine)
```

Falls back to cached info with a `(cached)` marker when the server is unreachable.

### `verglos activate <key>` — activate with a license key

Validates against the server before saving. Won't persist garbage.

```bash
verglos activate vg_xxxx_yyyy_zzzz
verglos activate $VERGLOS_LICENSE_KEY --ci   # exits 2 on failure
```

### `verglos init` · `verglos explain` · `verglos badge` · `verglos update`

```bash
verglos init                  # interactive project config
verglos init -y               # non-interactive
verglos explain               # list every rule
verglos explain D2-001        # explain one rule
verglos badge                 # print markdown badge for your README
verglos update                # self-upgrade to the latest npm version
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

Upgrade at [verglos.com/checkout](https://verglos.com/checkout). One-time UPI payment, month-to-month, no lock-in.

---

## Config

Sane defaults. Customize with `.verglos.config.js` in the project root:

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
| `VERGLOS_LICENSE_KEY` | Used by `verglos activate --ci` in GitHub Actions |
| `VERGLOS_AS_PLAN` | [founder only] Simulate a plan (`free` \| `pro` \| `studio`) |

---

## Privacy

Verglos runs 100% locally. Your source code is never uploaded.

Anonymous scan telemetry (event ID, CLI version, Node version, platform, finding counts, project fingerprint hash, duration) is fired to `verglos.com/api/v1/telemetry/scan` after each scan. No source, no file paths, no findings text, no identity. Disable with `VERGLOS_TELEMETRY=0` or `--no-telemetry` per invocation.

---

## Support

- **Website:** [verglos.com](https://verglos.com)
- **Account & docs:** [verglos.com/account](https://verglos.com/account)
- **Email:** support@verglos.com
- **Issues:** [github.com/Top-Notchh-Solutions/verglos-cli/issues](https://github.com/Top-Notchh-Solutions/verglos-cli/issues)

License: Apache-2.0.
