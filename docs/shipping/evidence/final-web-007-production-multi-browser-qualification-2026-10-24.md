# FINAL-WEB-007 hosted production multi-browser qualification — 2026-10-24

## Hosted deployment

The final live deployment is Vercel deployment
`dpl_6avUvwLEQVdaPRuwwSxxjrJccxku`, READY for Web merge commit
`d8f415b486b57ab6fa3885d734a4904e11ac435a`. Its aliases include
`https://verglos.com` and `https://www.verglos.com`.

The deployed source includes the checkout cadence-tab keyboard fix from PR
#270, the landing byline contrast fix from PR #271, and the fail-closed
multi-browser/INP capture refinements from PR #272. The hosted qualification
was read-only: no payment, database write, customer data, release publication,
or GitHub Actions run was used.

## Capture

- **Base URL:** `https://verglos.com`
- **Required paths:** `/`, `/docs`, `/detectors`, `/proof`, `/verify`, and
  `/checkout`.
- **Viewports:** desktop and mobile for every path.
- **Total:** 36 measurements: 3 engines × 6 paths × 2 viewports.
- **Playwright:** `1.64.1`; Chromium `156.0.8078.4`, Firefox `157.0`,
  WebKit `27.2`.
- **Commands:** `pnpm capture:landing-release -- --base-url https://verglos.com --browser <browser> --out <capture.json>` followed by
  `pnpm qualify:landing-release -- <capture.json>`.

| Browser | Capture time (UTC) | Measurements | Axe/accessibility findings | Keyboard failures | INP gaps | Max LCP / FCP / TTFB | Qualification |
| --- | --- | ---: | ---: | ---: | ---: | --- | --- |
| Chromium | `2026-10-24T00:34:14.628Z` | 12 | 0 | 0 | 0 | 1532 / 1532 / 228.1 ms | PASS |
| Firefox | `2026-10-24T00:34:17.474Z` | 12 | 0 | 0 | 0 | 610 / 610 / 297 ms | PASS |
| WebKit | `2026-10-24T00:34:23.680Z` | 12 | 0 | 0 | 0 | 1139 / 1022 / 311 ms | PASS |

All three qualification commands returned `status: passed` and `ok: true`.
Every measurement passed performance thresholds, responsive layout, canonical
metadata, crawlability, reduced-motion, and keyboard checks. Production
`robots.txt` returned HTTP 200 and the sitemap returned HTTP 200 with 8 URLs.

## Defect disposition and boundary

An earlier hosted run identified a genuine desktop contrast failure in the
landing header byline: foreground `#8a8985` on background `#272827`, ratio
4.22:1 against the WCAG AA 4.5:1 minimum. PR #271 raised the source opacity
from `/48` to `/56`; the final production packet reports zero Axe findings in
all engines.

This closes the implementation and hosted automated browser evidence slice,
but it is not an independent human screen-reader review, field Core Web Vitals
observation, customer/recipient acceptance, AppSec/Hunt review, or final
release/go-no-go sign-off. Keep the affected backlog checkboxes open until
their separately required evidence exists.
