# FINAL-WEB-007/008 current Production multi-browser receipt · 2026-10-24

## Deployment and scope

Vercel Production deployment `dpl_Aw8Coq1UJV2XPKDpN8s8RemXhgmu` is READY and
serves `https://verglos.com`, `https://www.verglos.com`, and
`https://verglos-web.vercel.app`. The deployed Web source is commit
`21f9cfbd559d2b06c328d985ef4615430643c0ed` (PR #280 implementation).

The read-only capture used `https://verglos.com`, reduced motion, desktop
`1440x900`, and mobile `390x844` across `/`, `/docs`, `/detectors`, `/proof`,
`/verify`, and `/checkout`: **12 measurements per engine / 36 total**.
Production HTTP checks also returned 200 for all six pages, `/llms.txt`,
`/robots.txt`, and `/sitemap.xml`.

## Results

| Browser | Measurements | Axe violations | Keyboard failures | INP gaps | Max LCP / FCP / INP / TTFB / CLS | Qualification |
| --- | ---: | ---: | ---: | ---: | --- | --- |
| Chromium | 12 | 0 | 0 | 0 | 1096 / 1096 / 48 / 407 / 0 | PASS |
| Firefox | 12 | 0 | 0 | 0 | 830 / 830 / 32 / 372 / 0 | PASS |
| WebKit | 12 | 0 | 0 | 0 | 1400 / 1400 / 32 / 296 / 0 | PASS |

Every measurement passed responsive layout, canonical metadata, crawlability,
reduced-motion, keyboard, and strict performance checks. The three bounded
capture receipts are:

- `final-web-007-production-current-chromium-2026-10-24.json`
- `final-web-007-production-current-firefox-2026-10-24.json`
- `final-web-007-production-current-webkit-2026-10-24.json`

The additive acceptance bundle contains **282** hashed evidence files, passed
secret scanning, and verified with zero mismatches. Its manifest digest is
recorded in the active goal and shipping ledgers.

## Boundary

This advances current Production automated browser/provider evidence for
FINAL-WEB-007 and FINAL-WEB-008. It is not human screen-reader or field-CWV
evidence, customer/recipient acceptance, independent AppSec/Hunt review, or
final release/go-no-go sign-off. No login, payment, webhook, database write,
customer repository, publication, deletion, or GitHub Actions run occurred.
No backlog checkbox changed; score remains **245 checked / 35 open / 280 total
(87.5%)**, partitioned as **13 AppSec-dependent / 22 non-AppSec** rows.
