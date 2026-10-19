# FINAL-WEB-008 public release smoke evidence

Date: 2026-10-19

## Source and scope

- Repository: `anuragyadav-git/verglos-web`
- Verified tree: Web `origin/main` normal merge
  `47518c774a339e81ba66968e9cd6dbe0249b5e2d` (`git diff --quiet origin/main`
  from the qualification worktree).
- Existing public-smoke implementation: `scripts/public-release-smoke.ts`
  and `scripts/public-release-smoke.test.ts`.
- Hosted workflow: `.github/workflows/verify.yml` runs the smoke and uploads
  its report; PR #227 hosted checks passed **8/8**.

## Original logic and observed result

The smoke reads the actual public route/source manifest, requires each mapped
source surface and its truth-registry wiring, rejects stale prices and
unsupported claims, validates the public truth snapshot and proof assets, and
returns a versioned report. It does not claim that final acceptance or browser
field performance has occurred.

Observed report:

- Schema: `urn:verglos:public-release-smoke:v1`
- Status: `passed`
- Public routes audited: **15**
- Homepage claims: **7**
- Machine-readable claims: **15**
- Total claims: **22**
- Publishable claims: **22**
- Proof assets: **2**
- Issues: **0**
- Regression tests: **2/2 pass, 0 fail**

Commands:

- `pnpm public:release-smoke`
- `pnpm test:public-release-smoke`

The command output is retained at `/tmp/verglos-public-release-smoke-20261019.json`
for the local run; the hosted workflow artifact remains the authoritative CI
copy.

## Disposition

This is substantive public-surface implementation and merged-head smoke
evidence. `FINAL-WEB-008` remains unchecked because its row is downstream of
final truth-registry/acceptance sequencing and does not permit a local smoke
pass to substitute for final acceptance. No production, customer, provider,
billing, publication, credential, or AppSec state changed. Score remains
**239 checked / 41 open / 280 total (85.4%)**.
