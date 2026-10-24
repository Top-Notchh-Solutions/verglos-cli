# QUAL-WEB-006 dashboard interaction-harness correction · 2026-10-24

## Disposition

The dashboard browser-capture harness now performs a real visible control
interaction before reading interaction metrics. `QUAL-WEB-006` remains
unchecked: this is a code-side harness correction, not human screen-reader,
field-CWV, customer, independent-review, or final-acceptance evidence.

## Source and merge

- Web implementation commit: `204224937228dc0134cb73feb873b893005255c4`
- Web PR: [#281](https://github.com/anuragyadav-git/verglos-web/pull/281)
- Web merge commit: `91d8629cd59f239334629f39ccfebb5953671cc2`
- Changed file: `scripts/capture-dashboard-release.ts`

The harness now clicks the first visible enabled `button` or `role=button`
with Playwright's real interaction API. When no button exists, it uses a
visible same-page anchor and never intentionally navigates away. The existing
keyboard Tab/focus probe and fail-closed missing-INP behavior remain intact.

## Verification

- `pnpm test:dashboard-release`: **4/4 passed**
- `pnpm typecheck`: passed
- `git diff --check`: passed
- Direct installed Playwright WebKit probe: the runtime exposes no
  `PerformanceObserver({ type: "event" })` entries, even after a real button
  click. No FID or synthetic latency value was relabeled as INP; WebKit
  remains unclaimed for this metric.

## Boundary

No GitHub Actions run was used as evidence; the automatically queued Web PR
runs were canceled/verified absent after merge. No database, provider,
Production, payment, npm, tag, release, customer, or external-recipient
action occurred. No checkbox changed. The authoritative score remains
**245 checked / 35 open / 280 total (87.5%)**, split **13 AppSec-dependent / 22
non-AppSec**.
