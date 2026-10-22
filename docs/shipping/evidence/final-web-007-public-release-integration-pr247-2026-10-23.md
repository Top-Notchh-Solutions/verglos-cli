# FINAL-WEB-007/008 public release integration qualification · 2026-10-23

## Source and merge history

- **Repository:** `verglos-web`
- **Pull request:** https://github.com/anuragyadav-git/verglos-web/pull/247
- **Integration head:** `d02ac18`
- **Branch:** `codex/final-web-007-release-audit-20261023`
- **Normal merge commits:** `edc7ad0` integrates PR #245 (private sitemap
  route guard); `d02ac18` integrates PR #246 (emitted metadata validation)
  with the existing PR #247 browser qualification. No squash or force push
  was used.

## Combined verification

- `pnpm test:public-release-smoke` — **10/10 passed**.
- `pnpm test:landing-release` — **4/4 passed**.
- `pnpm test` against isolated local Docker PostgreSQL — **919 passed / 2
  documented skips / 0 failures**.
- `pnpm exec tsc --noEmit` — passed.
- `pnpm db:check` — passed.
- `pnpm build` — **49/49 routes generated**.
- Existing local Chromium + axe capture on the same product source — **12/12
  measurements**, qualification passed with zero gaps and zero page failures.

The combined public smoke now exercises the route inventory, public/private
sitemap boundary, emitted sitemap URLs, robots exclusions, stale public truth,
and the landing browser qualification substrate in one source candidate.

## Boundary

This is local source integration and qualification evidence. It does not create
hosted workflow execution, Node 22 hosted verification, human screen-reader
acceptance, real-user field CWV, customer/recipient acceptance, independent
review, or final release sign-off. Keep FINAL-WEB-007 and FINAL-WEB-008
unchecked; score remains **239 checked / 41 open / 280 total (85.4%)**.
Nothing was deleted.
