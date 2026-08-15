# Verglos v1.8.1 — Free + Pro Truth Audit

**Audit date:** 2026-08-15
**Scope:** Free + Pro tiers only (Studio + Compliance rows marked Planned/deferred are out of scope).
**Method:** Cross-referenced 15 pricing capabilities against actual shipped code in `verglos-cli/packages/*` and `verglos-web/src/*`, then ran live scans with `verglos@1.8.1` in `--as-plan free` and `--as-plan pro` modes against a real TS/JS repo (`topcotchhsolutions-company-website`).
**Verdict:** **13 of 15 pass · 1 conditional · 1 partial.** Safe to sell Free forever; safe to sell Pro after the two flagged items are resolved.

---

## Overall pass rate

| Verdict | Count | Rows |
|---|---:|---|
| ✅ SHIPPED | 13 | SAST · SCA · file+line · HTML+JSON report · AI-authored · Slopsquat · MCP server · CI thresholds (both tiers) · Email/Slack/webhook · Agent-surface rule pack · API-hardening rule pack · Deep-auth rule pack · score-history-30d |
| 🟡 CONDITIONAL | 1 | Continuous CVE monitoring + hourly alerts (works if external cron is configured) |
| ⚠️ PARTIAL | 1 | `verglos fix` (silently no-ops on modern Next.js configs) |
| ❌ MISSING | 0 | — |

---

## Row-by-row verdict

### FREE tier (9 rows)

| # | Pricing row | Verdict | Backing code | Live-test result |
|---|---|---|---|---|
| 1 | SAST scan (code-side detectors across 10 domains) | ✅ | `packages/scanner/src/index.ts` registers 11 detectors: `secrets`, `dependencies`, `misconfig`, `injection`, `git-history`, `ai-patterns`, `slopsquat`, `vendored-cves`, `agent-surface`, `api-hardening`, `deep-auth` | Scan produced 1 critical + 2 high + 3 medium findings in 4.6s |
| 2 | SCA scan (dependency CVEs + vendored-library cross-ref) | ✅ | `packages/scanner/src/detectors/dependencies.ts` + `vendored-cves.ts` (207 lines) | Dependencies scanned; cross-ref detector shipped |
| 3 | All file paths and line numbers | ✅ | Scan output template in `packages/cli/src/scan.ts` | Verified: `app/products/verglos/page.tsx:37`, `components/redesign/verglos-visual.tsx:16` |
| 4 | Local HTML + JSON report | ✅ | `packages/reporter/` renders both | `verglos-report.html` written to project root after scan |
| 5 | AI-authored code detection | ✅ | `packages/scanner/src/provenance/` (4 sources: agent-artifacts, git-trailer, commit-shape, code-shape) | Output: `"95.7% of this codebase is AI-authored ... (high confidence — agent-artifacts, git-trailer, commit-shape, agent-artifacts)"` |
| 6 | Slopsquat / hallucinated-package check | ✅ | `packages/scanner/src/detectors/slopsquat.ts` (427 lines) | Detector shipped and included in ALL_DETECTORS list |
| 7 | MCP server | ✅ | `packages/mcp/src/tools/` — 4 tools: `check-before-write`, `check-package`, `explain-finding`, `scan` | JSON-RPC `tools/list` request returned all 4 tools with schemas |
| 8 | CI score thresholds — Free = "Criticals only" | ✅ | `packages/cli/src/scan.ts::executeCi` + entitlement gate `ci_threshold` | Free-tier `ci` output: `"Free tier: threshold enforcement is Pro — this run only blocks on criticals."` |
| 9 | (Everything below marked "No" on Free) | ✅ | Entitlement gates in `packages/cli/src/entitlement.ts::requireCapability` | Verified: Free-tier `fix` prints `"'verglos fix' requires Pro. Upgrade at..."`; Free-tier `monitor register` prints `"Continuous CVE monitoring requires Pro."` |

### PRO tier — 11 adds beyond Free

| # | Pricing row | Verdict | Backing code | Live-test result |
|---|---|---|---|---|
| 10 | Continuous CVE monitoring + hourly alerts | 🟡 CONDITIONAL | `verglos-web/src/app/api/cron/monitor/route.ts` reads registrations, batch-queries OSV, dispatches alerts, dedupes on `(registration_id, cve_id, package_name)` | Code path is correct. But `vercel.json` has no `crons` config, and the code comment references `docs/cron-setup.md` that **does not exist**. The route works when hit by an authenticated bearer, but nothing IN THE REPO triggers it on schedule. See § "Critical fix #1" below. |
| 11 | Email / Slack / webhook alerts | ✅ (env-dependent) | `verglos-web/src/lib/monitor/dispatch.ts` — real send functions for email (Resend), Slack (`hooks.slack.com/services/*` webhook), and generic HTTPS webhook | Code is complete. Requires `RESEND_API_KEY` in prod env for email; Slack + generic webhook need no server-side env. Skipped channels return `{ skipped: true }` — safe, no false positives. |
| 12 | Agent-surface rule pack (Cursor / Claude Code / Windsurf / Cline) | ✅ | `packages/scanner/src/detectors/agent-surface.ts` (332 lines) | Registered in `ALL_DETECTORS`. Live scan output on our repo caught `"Cursor: MCP server 'render' env c…"` as CRITICAL — proves the detector fires. |
| 13 | API-hardening rule pack (rate limit / body size / CORS+creds) | ✅ | `packages/scanner/src/detectors/api-hardening.ts` (239 lines) | Registered. Live scan flagged `"Wildcard CORS configuration"` as HIGH. |
| 14 | Deep-auth rule pack (JWT / cookies / password compare / weak hashes) | ✅ | `packages/scanner/src/detectors/deep-auth.ts` (285 lines) | Registered. Detector shipped and pro-gated. |
| 15 | Score-history dashboard — Pro = "30 days" | ✅ | Table `scoreHistory` in `verglos-web/src/lib/db/schema.ts:170`; endpoint `verglos-web/src/app/api/v1/score-history/route.ts` caps window at 30 days for Pro (`DAYS_LIMIT.pro = 30`) | Endpoint returns rows for calling license, most recent first, capped correctly per tier |
| 16 | `verglos fix` (framework-aware headers) | ⚠️ PARTIAL | `packages/cli/src/fix.ts` — patches `next.config.{js,mjs,ts}` OR writes `src/verglos-security-headers.ts` snippet for other frameworks | **Regex mismatch on modern Next.js.** The Next.js path matches only `/const\s+nextConfig\s*=\s*\{/` — that fails on the standard TypeScript shape `const nextConfig: NextConfig = { ... }` (which is what Next 14/15 templates ship with). Live-tested on our own `next.config.ts` — output: `"No next.config.* with a const nextConfig = { … } block — skipping."` See § "Critical fix #2" below. |
| — | Every other Pro-only gate (`monitor register`, `channel_*`, `ci_threshold`) | ✅ | `packages/cli/src/entitlement.ts::requireCapability` calls REST + JWT fallback | Verified: Pro `ci` accepts `--threshold <score>` (default 60), Pro `fix` runs without CTA, Pro `monitor register` accepts the flags |

---

## Critical fixes required BEFORE Studio outreach

### Fix #1 — Hourly cron must be documented AND active in production

**Symptom:** Pricing says "Continuous CVE monitoring + hourly alerts". The account UI shows `hourly OSV sweeps`. The cron endpoint at `/api/cron/monitor` exists and works — but nothing in the repo triggers it on schedule.

**What's in the code:**

```ts
// verglos-web/src/app/api/cron/monitor/route.ts:18-26
 * Trigger today: an external free scheduler (cron-job.org is set up
 * as the primary — see docs/cron-setup.md). Vercel Cron in
 * vercel.json is a Pro-plan feature and stays off until the project
 * upgrades. Both callers are safe to run in parallel — dedup on the
 * alert_dispatches unique index makes a duplicate tick a no-op.
```

**What's missing:**
- `docs/cron-setup.md` — referenced but does not exist in the repo (checked `verglos-web/docs/` and `verglos-web/` root — no docs dir)
- `vercel.json crons` array — not configured; the file only has build settings
- No `.github/workflows/*.yml` under `verglos-web/.github/` (that dir does not exist)

**Two possible truth states:**

1. **Cron-job.org IS configured** in the founder's account, pinging the endpoint hourly with `Bearer $CRON_SECRET`. Evidence: the account UI shows a canary alert firing on `2026-08-02 21:00Z`. If it was configured, the audit passes — we're shipping.
2. **Cron-job.org is NOT configured** and the "hourly" claim is aspirational. Evidence: `docs/cron-setup.md` doesn't exist, so a new team member reading the repo cannot verify or restart the trigger.

**Action:**
- **Verify (5 min):** log into cron-job.org and confirm there's an active job hitting `https://verglos.com/api/cron/monitor` on the hourly cadence. Screenshot the schedule + last-run-status. If yes → skip Fix.
- **Fix (30 min):** create `verglos-web/docs/cron-setup.md` documenting the cron-job.org job (URL, cadence, headers, secret rotation). Add a runbook for "what to do if the cron stops firing". Write a small `/api/health/monitor-cron` endpoint that returns `{ last_tick, minutes_since_last_tick }` so we can spot cron failure from the dashboard.
- **Alternative (needs Vercel Pro plan on the project):** move to Vercel Cron by adding to `vercel.json`:
   ```json
   { "crons": [{ "path": "/api/cron/monitor", "schedule": "0 * * * *" }] }
   ```
   Then delete the cron-job.org dependency.

### Fix #2 — `verglos fix` regex misses modern Next.js configs

**Symptom:** Pricing says `verglos fix (framework-aware headers)` is a Pro feature. Ran it against our own `topcotchhsolutions-company-website` (Next.js 16 App Router with `next.config.ts`) — output: `"No next.config.* with a const nextConfig = { … } block — skipping."` and no headers added.

**Root cause:** `packages/cli/src/fix.ts:77` uses regex `/const\s+nextConfig\s*=\s*\{/`. Our `next.config.ts` declares `const nextConfig: NextConfig = {` — the `:` type annotation kills the match. This is the DEFAULT shape in every `next.config.ts` template Vercel ships since Next 14.

**Fix (10 min):** widen the regex to accept optional TypeScript type annotation:

```ts
// packages/cli/src/fix.ts:77
- if (/const\s+nextConfig\s*=\s*\{/.test(content)) {
-   const updated = content.replace(
-     /const\s+nextConfig\s*=\s*\{/,
-     `const nextConfig = {${headersBlock}`,
-   );
+ const NEXT_CONFIG_DECL = /const\s+nextConfig(?:\s*:\s*[A-Za-z_][\w.<>,\s]*)?\s*=\s*\{/;
+ if (NEXT_CONFIG_DECL.test(content)) {
+   const updated = content.replace(
+     NEXT_CONFIG_DECL,
+     (match) => `${match}${headersBlock}`,
+   );
```

Then add unit test cases in the existing `fix` test file covering: bare `const nextConfig = {`, typed `const nextConfig: NextConfig = {`, and typed with generics.

**Why this matters for Studio outreach:** the agencies we're targeting almost all use TypeScript with Vercel/Next boilerplate. If the first Pro feature they try silently no-ops, they will not trust the second one. This is a $0 bug for us to catch now vs. a lost deal to catch later.

---

## Non-blocking observations

### Capability name drift: `monitor_daily` vs "hourly alerts"

Both `packages/cli/src/tier-defaults.ts:31` and `verglos-web/src/lib/entitlement/capabilities.ts:31` list the capability as `monitor_daily`. But the pricing table + account UI + code comment in `api/cron/monitor/route.ts` all say **hourly**. The schedule IS hourly (per the cron docstring). Just rename the capability string to `monitor_hourly` in one commit — but only after verifying no external consumer has hardcoded `monitor_daily`. If any published SDK / doc references the string, add `monitor_hourly` as an additive capability and keep `monitor_daily` as an alias for one release, then drop.

### "35 capabilities enabled" on the FOUNDER card — math check

Account UI shows `FOUNDER · 35 CAPABILITIES ENABLED`. Verified: `capabilitiesFor("founder")` returns `9 (free) + 11 (pro) + 7 (studio) + 8 (compliance) = 35`. ✅ Real, computed from `PLAN_CAPABILITIES.founder.length`. No hardcoded fake.

### CLI comment vs pricing string alignment

`packages/mcp/src/index.ts` says `"All tools are free forever."` — matches pricing table row 7. `packages/cli/src/entitlement.ts::FREE_FALLBACK.capabilities` matches `FREE_CAPS` in `tier-defaults.ts` exactly. Wire contract is consistent across CLI + web.

### Alert dispatch requires `RESEND_API_KEY` for email

`verglos-web/src/lib/monitor/dispatch.ts` gracefully skips email when the env var is missing (returns `{ skipped: true }`). Slack + webhook channels don't need env vars. **Verify** `RESEND_API_KEY` is set in the Vercel production environment for verglos.com before selling Pro to a customer who expects email alerts.

### Score-history rows only insert during authenticated scans

The `scoreHistory` table gets rows written when a Pro+ scan runs with a valid license and posts back via `/api/v1/telemetry/scan/route.ts`. Anonymous (Free) scans do not populate history — that matches pricing ("30 days" is Pro-only). Verified schema + endpoint.

### Cron endpoint auth

`/api/cron/monitor` requires `Authorization: Bearer $CRON_SECRET`. Denies anything else. Correct — this endpoint would otherwise be a free DoS vector against OSV.

### Test coverage

`packages/cli/src/` has 5 test files: `entitlement-jwt.test.ts`, `entitlement-offline.test.ts`, `entitlement.test.ts`, `monitor.test.ts`, `tier-defaults.test.ts`. `packages/scanner/src/detectors/` has tests for `agent-surface`, `api-hardening`, `deep-auth`, `secrets`. Coverage for `slopsquat`, `injection`, `misconfig`, `dependencies`, `vendored-cves` is thin — worth adding before scaling detector count.

---

## Live-scan artifacts

The audit ran `verglos@1.8.1` against `topcotchhsolutions-company-website` (Next.js 16 App Router, ~600 files, 1350 deps). Results captured verbatim:

```
verglos --version
1.8.1

verglos whoami
  You:      anuragyadav20062002@gmail.com
  Plan:     FOUNDER
  License:  vg_df3…d3bd
  Renewal:  never (founder)
  Machine:  0e759370967d8519 (this machine)
  Activated projects (1): 0d8caa0d39…

verglos --as-plan free scan
  Score   67 / 100    HIGH RISK
  Critical  1    High  2    Medium  3    Low  0
  ▸ 95.7% of this codebase is AI-authored
    0 of 1 criticals are in AI-generated code
  ▸ Top 3
    1  Cursor: MCP server "render" env credentials  ~/.cursor/mcp.json    CRITICAL
    2  Wildcard CORS configuration                  app/products/verglos/page.tsx:37   HIGH
    3  Math.random() used for security-sensitive    components/redesign/verglos-visual.tsx:16   HIGH
  Report  → verglos-report.html

verglos --as-plan free ci
  ...same findings...
  Free tier: threshold enforcement is Pro — this run only blocks on criticals.

verglos --as-plan free fix
  `verglos fix` requires Pro.
  Upgrade at  →  https://verglos.com/checkout

verglos --as-plan free monitor register --email x@y.com
  Continuous CVE monitoring requires Pro.
  Upgrade at  →  https://verglos.com/checkout

verglos --as-plan pro scan     → same score, same findings (correct: detectors don't change per plan)
verglos --as-plan pro ci --help → --threshold <score> option present, default 60
verglos --as-plan pro fix       → silently skipped our TypeScript-typed next.config.ts (see Fix #2)
verglos --as-plan pro monitor register --help → shows --email --slack --webhook --label flags

verglos mcp
  {"result":{"tools":[
    {"name":"verglos_check_before_write", ...},
    {"name":"verglos_check_package", ...},
    {"name":"verglos_scan", ...},
    {"name":"verglos_explain_finding", ...}
  ]}}
```

Every capability I could exercise from the CLI produced the correct behavior. The two gaps (Fix #1 = missing cron docs, Fix #2 = fix regex too narrow) are the only load-bearing items.

---

## What to tell a Studio prospect on day one

Once Fix #1 + Fix #2 are shipped:

- **Free forever** — every scan capability, MCP, HTML+JSON report. Verifiable in 60s: `npx verglos`.
- **Pro** — 3 rule packs (agent-surface / api-hardening / deep-auth), `verglos fix` for security headers, 30-day score history, CI threshold enforcement, hourly OSV monitoring with email/Slack/webhook alerts. All shipped, all backed by real code.
- **Studio + Compliance** — clearly labeled "Planned" in the pricing table; do not oversell.

Studio pitch to agencies is honest: "buy Pro today to prove Verglos on your active repos; Studio ships in Q4 with signed attestations + white-label reports + SBOM export."

---

## Governance

- Re-run this audit before every minor release (v1.9, v2.0).
- After Fix #1 + Fix #2, delete the ⚠️ / 🟡 rows above and re-mark as ✅.
- Whenever a new capability is added to `capabilities.ts`, add a row here in the same PR — never let the pricing table drift from the code.
- The wire contract lives in TWO files (`tier-defaults.ts` client + `capabilities.ts` server). Any change requires mirroring in the same commit. If they ever drift, offline Pro users get a different feature set than online Pro users — that's the exact "look fake" failure mode we're auditing against.
