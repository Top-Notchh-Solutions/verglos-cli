# QUAL-WEB-006 authenticated organization dashboard — 2026-10-18

## Scope

This is a protected existing-session qualification of the authenticated owner
dashboard at `https://verglos.com/orgs/top-notchh-solutions/home`. It covers
the merged Web PR #197 canonical metadata fix and does not claim a human
screen-reader study, field Core Web Vitals, large-dataset qualification, or
AppSec/Hunt review.

## Implementation under test

- Web PR: [#197](https://github.com/anuragyadav-git/verglos-web/pull/197).
- Implementation commits: `81e3008` and `69f5217`.
- Normal merge commit: `9162995d0091a6abe21a88e2427bb0fe31a53123`.
- Production deployment: `dpl_ErANLsiYEScGfeoD8mCnvkVxZvR4`, Ready, aliased to
  `https://verglos.com` and `https://www.verglos.com`.
- The fix adds a bounded canonical URL for valid organization slugs and a
  safe `/orgs` fallback for traversal-shaped or oversized route values.

## Browser qualification

The existing authenticated owner page was reused; no tab or window was opened.

- Desktop Lighthouse: Accessibility **100**, Best Practices **100**, SEO
  **100**, Agentic Browsing **100**; **52 passed / 0 failed**.
- Mobile Lighthouse: Accessibility **100**, Best Practices **100**, SEO
  **100**, Agentic Browsing **100**; **52 passed / 0 failed**.
- Production desktop performance trace on Fast 4G, CPU 1x: LCP **506 ms**,
  CLS **0.00**; field/CrUX data unavailable for this page.
- The pre-fix authenticated audit had SEO 92 solely because the canonical link
  was missing; the post-merge audit no longer reports that failure.

The browser tool retained raw reports in its temporary paths:

- Desktop Lighthouse: `/var/folders/5x/jdz3zj4s12d4yllcvg17qq540000gn/T/chrome-devtools-mcp-r2cwnY/report.json`
- Mobile Lighthouse: `/var/folders/5x/jdz3zj4s12d4yllcvg17qq540000gn/T/chrome-devtools-mcp-RSp9O0/report.json`

## Gate disposition

This closes the observed canonical metadata defect but does not close
`QUAL-WEB-006`. Human screen-reader, large-dataset browser, complete field-CWV,
and the remaining acceptance contract are still open. No backlog checkbox
changed.

Live score: **232 checked / 48 open / 280 total (82.9%)**.
