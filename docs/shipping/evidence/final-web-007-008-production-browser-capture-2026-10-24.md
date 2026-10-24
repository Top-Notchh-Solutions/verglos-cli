# FINAL-WEB-007/008 production browser capture — 2026-10-24

- **Execution:** Ran the existing `capture:landing-release` Playwright
  capture against `https://verglos.com` with Chromium, followed by the
  existing `qualify:landing-release` validator.
- **Observed result:** **12/12** measurements passed across `/`, `/docs`,
  `/detectors`, `/proof`, `/verify`, and `/checkout`, at desktop and mobile
  viewports. Qualification status was `passed`; source issues and decision
  gaps were empty.
- **Checks:** Accessibility findings **0**; all observed INP values present;
  keyboard operability, landmarks, reduced-motion, responsive layout,
  canonical metadata, crawlability, and required performance observations
  passed for every measurement. Maximum observed values were LCP **708 ms**,
  INP **48 ms**, FCP **708 ms**, TTFB **296.4 ms**, and CLS **0**.
- **HTTP boundary:** `robots.txt` returned 200 and the sitemap returned 200
  with 8 URLs. This was a read-only browser capture; no login, account
  deletion, payment, provider, database, deployment, customer, or release
  action occurred.
- **Raw receipt:**
  `docs/shipping/evidence/qual-web-006-final-web-007-008-production-browser-capture-2026-10-24.json`
  SHA-256:
  `4bfe0a04231371c5a78d5a5ffa80f3fd91e918d0405480d2a0cf87d682020982`.
- **Disposition:** This advances hosted browser and public-surface evidence
  only. It does not create authenticated browser, human screen-reader/field
  CWV, independent review, provider lifecycle, recipient/customer acceptance,
  or final go/no-go evidence. No backlog checkbox changed.
