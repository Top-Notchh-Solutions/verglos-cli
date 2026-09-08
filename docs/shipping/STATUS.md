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

Planning complete. The 260-item dependency-ordered execution tracker is in `VERGLOS_V1_BACKLOG.md`. Waiting for the founder's explicit command before starting implementation.

## Last verified checks

- `verglos-web`: `pnpm typecheck` passed.
- `verglos-web`: `pnpm build` passed.
- No final V1 implementation claim is authorized by those checks.

## Next task

`TRUTH-001`: inventory current CLI/web behavior and populate the truth registry with evidence links before changing contracts or public copy.

## Scope hold

- Core product work forecasts 252 commits: 162 in `verglos-cli`, 90 in `verglos-web`.
- The final landing/marketing pass forecasts 8 additional `verglos-web` commits and remains on hold until a later founder command after GA truth lock.
- Blog work is excluded; no blog or landing-page element may be changed during core execution.

## Blockers

- None for local documentation work.
- External POC and campaign remain intentionally blocked until release-candidate gates pass.
