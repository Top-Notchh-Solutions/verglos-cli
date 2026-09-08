# Verglos V1 shipping status

Updated: 2026-09-08

## Current phase

Phase 0 — product, evidence, truth, and delivery contracts.

## Founder sequencing

Build and qualify the complete V1 before external POC, Reddit validation, public benchmark publication, paid pilots, or the final campaign. Internal fixture tests run continuously; external validation happens only after a release candidate passes the gates.

## Verified baseline

- Free local JavaScript/TypeScript scan is shipped.
- Pro is commercially wired with fix, CI thresholds, monitoring, alerts, deeper rules, and score history.
- Hunt and Attest are alpha shells, not complete verification/signing products.
- Team, Studio, Enterprise, Trivy orchestration, canonical `.vgl` records, and final dashboards are target capabilities.
- Current web/CLI public copy must remain bounded by the capability registry and code.

## Critical path

`truth registry → contracts → target resolution → adapters/imports → normalization/correlation → policy → local viewer → records/signing → hosted control plane → plan enforcement → dashboards → qualification → external acceptance`

## Active task

Execution started. `TRUTH-001` is complete at `9877482`: the current CLI capability inventory now covers all commands, flags, packages, detectors, reports, outbound requests, telemetry fields, entitlement vocabularies, and runnable tests without changing runtime behavior.

## Last verified checks

- `verglos-cli`: `TRUTH-001` inventory counts reconcile to 19 top-level commands, 11 detectors, 9 MCP tools, 8 packages, and 100 package-discovered tests.
- `verglos-cli`: documentation diff check passed after the execution-state update.
- `verglos-web`: `pnpm typecheck` passed.
- `verglos-web`: `pnpm build` passed.
- No final V1 implementation claim is authorized by those checks.

## Next task

`TRUTH-002`: inventory current hosted routes, libraries, schema, auth, licenses, reports, telemetry, monitoring, alerts, attest summaries, account routes, and production dependencies.

## Scope hold

- Core product work forecasts 252 commits: 162 in `verglos-cli`, 90 in `verglos-web`.
- The final landing/marketing pass forecasts 8 additional `verglos-web` commits and remains on hold until a later founder command after GA truth lock.
- Blog work is excluded; no blog or landing-page element may be changed during core execution.

## Blockers

- None for local documentation work.
- External POC and campaign remain intentionally blocked until release-candidate gates pass.
