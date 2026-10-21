# FINAL-WEB-007/008 current-source qualification · 2026-10-21

## Scope and acceptance boundary

This packet records current Web source and public-surface qualification only.
It does not create a browser capture, human screen-reader observation,
field Core Web Vitals result, customer acceptance, founder command, or final
release decision. No Web source or deployment was changed by this packet.

## Source and environment

- Repository: `verglos-web` isolated clean worktree.
- Exact source: `a3819c1` (`fix(web): resolve Studio workspace allowance from app db`).
- Runtime: Node `v26.4.0`, pnpm `10.34.5`; pnpm reported the repository's
  requested Node `22.x` engine as a warning, not a test failure.
- `pnpm test:truth-registry` — **34/34** passed, 0 failures, 0 skips.
- `pnpm test:landing-release` — **4/4** passed, 0 failures, 0 skips.
- `pnpm test:public-release-smoke` — **2/2** passed, 0 failures, 0 skips.
- `pnpm public:release-smoke` — passed with schema
  `urn:verglos:public-release-smoke:v1`, **16** routes, **22/22** publishable
  claims, **2** proof assets, and **0** issues.
- `git diff --check` passed and the source worktree remained clean.

## Row mapping and residual requirements

`FINAL-WEB-007` now has a tested fail-closed landing-capture contract. The
tests cover complete desktop/mobile capture shape, required viewport presence,
duplicate/failed page rejection, required booleans, and finite performance
measurements. No browser-produced capture JSON was available in this worktree,
so this does not satisfy the row's actual browser, human screen-reader,
supported-environment, field-CWV, or final-acceptance requirements.

`FINAL-WEB-008` now has current-source truth-registry and public-smoke
evidence. The smoke report found no stale public claims and all 22 checked
claims publishable. The row remains open because its FINAL-WEB-001–007 and
ACCEPT-009/010 dependencies and final release acceptance are not complete.

No checklist checkbox changed. The score remains **239 checked / 41 open /
280 total (85.4%)**. No Production, provider, customer, legal, payment,
registry, or AppSec state changed.
