# FINAL-WEB-007/008 Production landing multi-browser receipt · 2026-10-24

The current public Production alias `https://verglos.com` was exercised by the
existing Web release qualification harness. This was a read-only browser
capture; it did not authenticate, write application data, invoke payment, or
change provider state.

## Result

All three browser engines completed the six required public paths at desktop
and mobile sizes: **12/12 measurements per browser, 36/36 total**.

| Browser | Measurements | Axe violations | Keyboard failures | Responsive failures | Metadata/crawl failures | INP observed |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Chromium | 12/12 | 0 | 0 | 0 | 0 | 12/12 |
| Firefox | 12/12 | 0 | 0 | 0 | 0 | 12/12 |
| WebKit | 12/12 | 0 | 0 | 0 | 0 | 12/12 |

Required paths: `/`, `/docs`, `/detectors`, `/proof`, `/verify`, and
`/checkout`; each was exercised at desktop and mobile viewports. The harness
qualification returned `status: passed` for each capture, with no source
issues or coverage gaps.

## Byte-bound captures

- Chromium: `final-web-007-008-production-landing-multibrowser-2026-10-24-chromium.json`; SHA-256 `sha256:dd1570098f02709cb52d1336b3fd9324f13451007711b3b07827fd1cab91e3c7`
- Firefox: `final-web-007-008-production-landing-multibrowser-2026-10-24-firefox.json`; SHA-256 `sha256:5e660de8bd3aee73ebdff33eee6eff843543ee0a4cd92c34c2303a07f1750f1a`
- WebKit: `final-web-007-008-production-landing-multibrowser-2026-10-24-webkit.json`; SHA-256 `sha256:d732b21db08ba34b6d9cbbcb91af098e0ae87f6bffc7424a8b2328e91cc27f92`

Capture timestamps were `2026-10-24T05:09:51.267Z` (Chromium),
`2026-10-24T05:10:27.299Z` (Firefox), and `2026-10-24T05:11:11.373Z`
(WebKit). The previously inspected Vercel Production deployment was
`dpl_7xFLAALkYPWAiDj8foH1qdq2Caza`, serving the merged Web candidate
`cb266b83406bbfffbd5ab02189556e60973a63a6`.

## Boundary

This is automated hosted browser/provider evidence. It does not substitute for
human screen-reader review, real-user field-CWV evidence, customer/recipient
acceptance, independent review, AppSec/Hunt review, or final release sign-off.
`FINAL-WEB-007` and `FINAL-WEB-008` remain unchecked; the score remains
**245 checked / 35 open / 280 total (87.5%)**.
