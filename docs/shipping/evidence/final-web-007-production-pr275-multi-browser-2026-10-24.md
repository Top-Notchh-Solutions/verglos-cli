# FINAL-WEB-007 production deployment and multi-browser receipt

Vercel deployment `dpl_9QR8VMPTedtaSvfNPYxgXaUKwgwG` is **READY** with target
`production`, created from the merged Web PR #275 implementation
`b344def`/merge `b17c846c1932636a55eac01895a5226fa9899a3d`. The deployment
aliases include `https://verglos.com` and `https://www.verglos.com`.

The read-only production browser capture used `https://verglos.com` and
covered `/`, `/docs`, `/detectors`, `/proof`, `/verify`, and `/checkout` at
desktop and mobile in Chromium, Firefox, and WebKit: **12 measurements per
browser / 36 total**. All three qualification reports passed with zero Axe
findings, keyboard failures, performance breaches, responsive failures,
metadata failures, or crawlability failures.

| Browser | Capture | SHA-256 |
| --- | --- | --- |
| Chromium | `final-web-007-production-pr275-chromium-2026-10-24.json` | `547e7b5e26b83ee6c9dc23fbea616d8f53ee0bb99b778310bc933063091f713c` |
| Firefox | `final-web-007-production-pr275-firefox-2026-10-24.json` | `c13647d7429619e76282e6a04a1e0a82931f0d0a4643d4a4d1ba4f2d99ca21ab` |
| WebKit | `final-web-007-production-pr275-webkit-2026-10-24.json` | `41f63ac2f4b073746ae96153a926c1fa7caf95fb40599d178ce76e0d2d16cc56` |

This is a real provider deployment and public read-only browser receipt. It
does not claim human screen-reader/field-CWV review, customer acceptance,
independent AppSec/Hunt review, or final release/go-no-go sign-off. No payment,
customer repository, or customer data was used.
