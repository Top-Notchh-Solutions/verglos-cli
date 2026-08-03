# End-to-end test matrix

Manual walkthrough for every CLI command and MCP tool, free and paid.
Run before every minor release. Every step names the expected result;
if the actual output differs, note the divergence, don't pass the row.

Prereqs before the run:
- fresh terminal
- clean npx cache: `rm -rf ~/.npm/_npx`
- pin the version being tested: `npx verglos@<version> --version` must
  print `<version>` before you begin
- Neon SQL editor open in a browser tab so you can verify DB writes
- a JS/TS project checkout on disk (wolfpack-product-bundles is a
  good default — real deps, git remote, package.json)
- an activated founder or Pro license on your test account

---

## Free tier — must work with zero credentials

Every row runs from a JS/TS project directory unless noted.

| # | Command | Expected result | Verify |
|---|---|---|---|
| F1 | `npx verglos --version` | Prints exactly the version under test | Compare to `packages/cli/package.json` |
| F2 | `npx verglos --help` | Lists every command: scan, score, secrets, deps, ci, fix, login, activate, whoami, badge, hook, monitor register/status/unregister/test-alert, mcp, precommit, init, explain, update | Every command from `packages/cli/src/index.ts` appears |
| F3 | `npx verglos scan` | Runs to completion, prints score /100, writes `verglos-report.html` + `verglos-report.json` in cwd, shows AI-provenance line | Files exist, HTML opens cleanly |
| F4 | `npx verglos scan --no-provenance` | Same as F3 but no provenance section | Faster (skips slowest step) |
| F5 | `npx verglos scan --strict` | Includes test-file findings in score, message reflects it | Message says "included in the score" |
| F6 | `npx verglos scan --all` | Includes low-confidence findings (below 0.7) | Finding count > F3's count |
| F7 | `npx verglos score` | Prints just the score line, no findings | One-liner output |
| F8 | `npx verglos secrets` | Runs only the secrets detector, ~5s | Score is per-secrets only; no dependency scan |
| F9 | `npx verglos deps` | Runs dependency CVE audit only, ~1-2s | No git-history or secret findings |
| F10 | `npx verglos ci` | Exits 0 if no criticals, non-zero otherwise. Free tier: no threshold enforcement — prints "Pro" note | Exit code + note about Pro |
| F11 | `npx verglos ci --threshold 90` | Free tier ignores threshold, still only blocks on criticals + prints upgrade note | Free tier does not enforce |
| F12 | `npx verglos fix` | Prints Pro upgrade CTA. Exits 1. | No file edits; CTA points at `/checkout` |
| F13 | `npx verglos monitor register --email x@y.com` | Prints Pro upgrade CTA. Exits 1. | No row in `monitor_registrations` |
| F14 | `npx verglos monitor status` | Prints Pro upgrade CTA. Exits 1. | No network call needed |
| F15 | `npx verglos hook` | Installs `.git/hooks/pre-commit` | `cat .git/hooks/pre-commit` shows it |
| F16 | `npx verglos precommit` | Fast secrets + criticals scan under 2s | Exit 0 if clean |
| F17 | `npx verglos badge` | Prints Markdown badge line | `[![Verglos](...)]()` shape |
| F18 | `npx verglos init -y` | Writes `.verglos.config.js` (or keeps existing), silent | File exists after |
| F19 | `npx verglos explain --list` | Lists every rule ID Verglos knows | Includes AGENT-001..005, API-001..005, AUTH-001..006 (new packs) |
| F20 | `npx verglos explain AI-002` | Prints why + fix for AI-002 | Multi-line, human-readable |
| F21 | `npx verglos mcp --print-config` | Prints MCP JSON snippet for Cursor/Claude/Windsurf/Cline | Copy-paste ready |
| F22 | `npx verglos update` | Checks npm for latest, updates in place | Terminal shows current + latest |

---

## Free tier — MCP server (stdio)

MCP is used by coding agents (Cursor / Claude Code / Windsurf / Cline).
Start it as a stdio subprocess and exercise the four tools.

| # | Test | Expected result |
|---|---|---|
| M1 | Wire the config snippet from F21 into `~/.cursor/mcp.json` (or Claude Code equivalent) | Agent sees Verglos server on next restart |
| M2 | From agent chat: "Check if `left-pad-v99` is a real npm package via Verglos" | `verglos_check_package` fires; returns `exists: false, reason: hallucinated` |
| M3 | From agent chat: "Scan this repo with Verglos" | `verglos_scan` fires; returns score + finding count |
| M4 | Ask agent to write a `Math.random()` for a session token | `verglos_check_before_write` fires; response tells agent this is AI-002 |
| M5 | `verglos_explain_finding AI-002` from agent | Same output as F20 |

---

## Paid tier — Pro (activate a Pro or founder license first)

Prerequisite for every row: `verglos activate <key>` OR `verglos login`
has succeeded. Verify `cat ~/.verglos/credentials.json` shows a
`licenseKey` (and a fresh `entitlementToken` when the server is
signing them).

| # | Command | Expected result | Verify |
|---|---|---|---|
| P1 | `npx verglos whoami` | Plan = pro/founder, renewal date if applicable, machine fingerprint | Matches DB row in `licenses` |
| P2 | `npx verglos ci --threshold 90` | Threshold enforced. Exits non-zero if score < 90 | Free-tier note is GONE |
| P3 | `npx verglos fix` | Patches `next.config.*` (if Next.js) OR writes `verglos-security-headers.ts` | File was actually modified/created |
| P4 | `npx verglos scan` (in any project) | Same output as F3 | New row in `scan_events` with `cli_version = latest`, fingerprint set. New row in `score_history` for the license. New/updated row in `activations`. |
| P5 | `npx verglos scan` (agent-surface rule pack) — from any project | Findings include AGENT-001..005 when `~/.cursor/mcp.json` etc. have hits | Free tier scan of same repo does NOT show these |
| P6 | `npx verglos scan` (api-hardening) — from a repo with `cors({ origin: '*', credentials: true })` | Finding: API-004 critical | Free tier: not present |
| P7 | `npx verglos scan` (deep-auth) — from a repo with `jwt.verify(..., { algorithms: ['none'] })` | Finding: AUTH-001 critical | Free tier: not present |
| P8 | `npx verglos monitor register --email you@example.com` | Prints `Registered N dependencies`. Row appears in `monitor_registrations` with correct license_id + fingerprint | `SELECT * FROM monitor_registrations WHERE license_id = ...` |
| P9 | `npx verglos monitor register --email you@example.com` (again) | Prints `updated` OR `Registered` — idempotent. Only one row per (license, fingerprint) | Same row, `snapshot_at` refreshed |
| P10 | `npx verglos monitor status` | Lists the project with fingerprint prefix, dep count, channels, `last check: pending` (before first cron tick) | Server GET /v1/monitor/registrations returned data |
| P11 | `npx verglos monitor test-alert` | Prints `Test alert dispatched. email delivered, ...`. Email arrives in inbox within ~30s. New row in `alert_dispatches` with `is_canary = true` | Check inbox + Neon |
| P12 | `npx verglos monitor unregister` | Prints `Unregistered ...`. Row disappears from `monitor_registrations`. `alert_dispatches` history cascades. | Both tables |
| P13 | Register a project, wait for hourly cron tick (or manually trigger with `curl -H "Authorization: Bearer $CRON_SECRET" https://verglos.com/api/cron/monitor`) | Cron returns JSON summary; `last_checked_at` on the registration updates | Neon shows updated timestamp |
| P14 | Open `/account/dashboard` in browser | Entitlement strip shows plan + counts. Registered projects table shows P8's registration. Alerts table shows P11's canary. Score history shows P4's score. Activations table shows P4's fingerprint. | Every panel populated |
| P15 | Open `/account` in browser | ACTIVATED PROJECTS count = number of distinct fingerprints from paid scans + logins | Non-zero after P4 |

---

## Entitlement JWT — offline safety

| # | Test | Expected result |
|---|---|---|
| J1 | After a fresh `verglos activate <key>`, `cat ~/.verglos/credentials.json` | Contains `entitlementToken` (Ed25519 JWT, 3 base64url segments) |
| J2 | Turn off wifi. `npx verglos monitor status` | Prints Pro upgrade CTA (server unreachable, no cache, falls to Free) — expected within 5s |
| J3 | Turn on wifi, run any Pro command once to warm the cache. Turn off wifi. `npx verglos fix` | Fix runs — JWT + REST cache both honour offline within 7 days |
| J4 | Set `VERGLOS_TEST_PUBKEY_B64URL` to a wrong value. `npx verglos monitor status` | Falls back to Free-with-CTA — the wrong pubkey rejects the signed JWT |

---

## Paywall honesty checks — Free tier should never see paid output

| # | Test | Expected result |
|---|---|---|
| N1 | Free tier `verglos scan` in a repo that would trigger AGENT-001 (wildcard MCP tool grant) | Finding is NOT emitted. Free scan output has no D11 findings. |
| N2 | Free tier `verglos scan` in a repo with `cors({ origin: '*', credentials: true })` | API-004 is NOT emitted. Only the older wildcard-CORS finding (D5-002 or AI-001) fires. |
| N3 | Free tier `verglos scan` in a repo with `jwt.verify(..., { algorithms: ['none'] })` | AUTH-001 is NOT emitted. |
| N4 | Free tier `verglos ci --threshold 90` in a repo with score 60 | Exit 0 (threshold ignored, only criticals block). Terminal notes Pro upgrade. |
| N5 | Free tier `verglos monitor register` | Prints Pro CTA, exits 1. No DB write. |

---

## Cron / server-side loop

| # | Test | Expected result |
|---|---|---|
| S1 | cron-job.org execution log | Green 200 every hour, response body is `{ ok: true, summary: {...} }` |
| S2 | Manual trigger of `/api/cron/monitor` with the right Bearer | Same JSON summary; `last_checked_at` on active registrations updates |
| S3 | Manual trigger with a WRONG Bearer | 401 unauthorized |
| S4 | Manual trigger with NO Bearer | 401 unauthorized |
| S5 | Delete `CRON_SECRET` on Vercel and redeploy. Trigger with any Bearer. | 500 `CRON_SECRET is not configured` |
| S6 | `SELECT * FROM alert_dispatches ORDER BY fired_at DESC LIMIT 20` after a few days of running | Rows accumulate for real CVEs (if any hit registered deps). No duplicate `(registration_id, cve_id, package_name)` combinations. |

---

## Website / pricing

| # | Test | Expected result |
|---|---|---|
| W1 | Visit `https://verglos.com` | Landing renders, no console errors |
| W2 | Every capability row in the pricing table on `/` | Maps to a real capability string in `capabilities.ts` — no row is aspirational |
| W3 | `/account/dashboard` while signed in as Free user | Renders "The dashboard is a Pro feature" empty state |
| W4 | `/account/dashboard` while signed in as Pro/founder | Renders all five sections |
| W5 | `/account/docs` | Renders CLI docs correctly |

---

## What "fake" would look like — the failure modes to watch for

- CLI command exists in `--help` but does nothing → hollow surface
- `verglos monitor register` succeeds locally but the row never lands in Neon → wire-only, not real
- Cron runs but `last_checked_at` never updates → cron auth or DB write is broken
- Dashboard shows old cached data even after a fresh scan → stale query, force-dynamic missing
- Test-alert email arrives but real cron-triggered alerts don't → dispatch works, OSV integration broken
- `verglos scan` on Pro tier shows the same findings as Free → capability filter not applied

The tests above cover all six. Run them as a set on every minor release.
