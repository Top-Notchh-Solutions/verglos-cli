# Verglos baseline verification

Status: executed baseline for `TRUTH-013`

Executed: 2026-09-08 (Asia/Kolkata)

CLI baseline: `verglos-cli@bd1d394b484c4f6fa6c16d8e1b4a96388c5b64e3`

Web baseline: `verglos-web@5044e77c48de59475a388fad52a7618d466a2966`

Scope: existing test, typecheck, and production-build scripts only. This is a pre-implementation regression baseline, not proof that planned V1 capability or any external production integration works.

## Starting worktree state

| Repository | Branch | Tracked state | Preserved user state |
|---|---|---|---|
| `verglos-cli` | `chore/publish-alpha-2-0-0` | Clean at the baseline commit | Eight untracked founder documents/assets under `docs/` were present and intentionally not read as generated test input, modified, staged, or removed. |
| `verglos-web` | `chore/public-alpha-status` | Clean at the baseline commit | No untracked files reported. |

The preserved CLI paths were `VERGLOS_COMPANY_USAGE_AND_FEATURE_MAP.md`, `VERGLOS_FINAL_DATA_FLOW_MAP.html/.pdf`, `VERGLOS_FINAL_VISUAL_SYSTEM.html/.pdf`, `VERGLOS_PRODUCT_ARCHITECTURE_BLUEPRINT.md`, `verglos-hero-explainer.gif`, and `verglos-scan-loop.gif` under `docs/`.

## Environment

| Surface | Runtime/tool | Result relevance |
|---|---|---|
| CLI | Node `v26.4.0`; pnpm `9.15.9`; Turbo `2.10.6` | CLI declares Node `>=20`, so the runtime satisfies its manifest range. |
| Web initial pass | Node `v26.4.0`; pnpm `10.34.5`; Next `15.5.21` | Commands passed but pnpm warned that the repository requires Node `22.x`; this pass is supplemental, not the supported-engine evidence. |
| Web supported pass | Temporary Node `v22.23.2`; pnpm `10.34.5`; Next `15.5.21` | Satisfies the declared Node `22.x` engine and is the authoritative local web baseline. |

No dependency or lockfile update was performed. The temporary Node 22 runtime was invoked through `npx` and did not add a project dependency.

## Executed commands and results

### CLI authoritative fresh run

Command:

```text
pnpm exec turbo run test typecheck build --force
```

Result: pass, exit 0. Turbo reported 19 successful tasks, 0 cached, 19 total, in 5.236 seconds.

| Task family | Packages/execution | Result |
|---|---|---|
| Build | All eight workspace packages | 8 successful TypeScript builds. |
| Typecheck | All eight workspace packages | TypeScript no-emit checks passed wherever defined; dependency builds also ran under the task graph. |
| Test | Scanner, entitlement, and CLI packages have test scripts; packages without tests contribute no runnable cases | 100 tests passed: scanner 58, entitlement 8, CLI 34; 0 failed/cancelled/skipped/todo. |

An earlier `pnpm test && pnpm typecheck && pnpm build` pass also exited 0 but replayed every CLI task from local Turbo cache. It is retained as supplemental evidence only; the `--force` execution above is the baseline.

### Web supported-engine run

Commands:

```text
npx -y node@22 --version
npx -y node@22 /opt/homebrew/bin/pnpm typecheck
npx -y node@22 /opt/homebrew/bin/pnpm build
```

Result: pass, exit 0. Node resolved to `v22.23.2`; `tsc --noEmit` passed; the Next `15.5.21` production build compiled successfully in 2.2 seconds, completed type validation, generated all 34 static-page work units, and collected build traces.

The build consumed the already-present `.env.production.local` without printing its values. This proves build-time configuration was sufficient on this machine; it does not prove production secret correctness or live Clerk, Neon, Razorpay, Resend, OSV, scheduler, webhook, DNS, storage, or deployment behavior.

### Web supplemental current-shell run

Command:

```text
pnpm typecheck && pnpm build
```

Result: pass, exit 0, wall time 14.96 seconds under Node `v26.4.0`. The explicit unsupported-engine warning prevents using it as the supported Node baseline; its build output otherwise completed all stages and showed the same route surface.

The web package exposes no `test` script. Repository inspection found no `*.test.*` or `*.spec.*` application files, so there was no existing web application suite to run. This is a coverage gap, not a passing zero-test assertion.

## Post-command drift

| Repository | Tracked drift | Other result |
|---|---|---|
| CLI | None before this report; `git diff --check` passed | The same eight user-owned untracked docs/assets remained. Generated package build outputs did not appear as tracked changes. |
| Web | None; `git diff --check` passed | `.next` build output exists but is ignored; branch remained clean. |

No blog, landing page, runtime source, lockfile, dependency manifest, database, environment file, or user-owned untracked file was changed by verification.

## What the passing baseline establishes

- All currently wired CLI workspace TypeScript projects can build/typecheck together under a manifest-compatible Node runtime.
- All 100 currently discovered CLI/scanner/entitlement tests pass when Turbo cache is bypassed.
- The current web source typechecks and produces a Next production build under its declared Node 22 engine.
- Later implementation failures can be compared against these exact repository commits and commands instead of being attributed to an unknown starting state.

## What it does not establish

- No CLI command process, packaged install, npm tarball install, update, report schema, MCP protocol, login/activation, live secret verification, default network, Hunt, Attest, or cross-platform journey was exercised here.
- The 100 tests remain concentrated in scanner rules/context, entitlement/JWT/cache behavior, CLI header-fix parsing, monitoring helper calls, and tier helpers. Reporter, shared contracts, MCP, Hunt, and Attest expose no runnable package tests in the baseline.
- No web API, database migration, authorization/tenant, webhook, cron, billing, telemetry/privacy, retention/deletion, backup/restore, public verification, accessibility, browser, or end-to-end test exists in the baseline.
- A successful build does not prove the deployed artifact, environment, scheduler, provider credentials, external services, database contents/schema, or production route behavior.
- Turbo/task success does not close the licensing, package-notice, security, privacy, migration, cost, truth, or final acceptance blockers in `RISKS.md` and `RELEASE_GATES.md`.

## Regression rule

Implementation tasks record their starting commit and rerun the smallest relevant package tests during iteration. Before merge/release, the fresh CLI task graph and supported-engine web typecheck/build run again, alongside the new task-specific tests. A later failure is classified as:

- `new regression` when it reproduces only after the task change;
- `baseline gap exposed` when no baseline test covered the behavior but unchanged code/evidence already contained the defect;
- `environment/provider failure` when the same commit differs only by a recorded tool/service/config state;
- `unknown` until the baseline commit and environment reproduce it.

No failure is waived because this baseline passed, and no planned capability is called shipped because its repository compiles.

`TRUTH-013` changes documentation only and does not modify application behavior, blog content, or landing-page content.
