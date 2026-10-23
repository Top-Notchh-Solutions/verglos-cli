# Current Production landing browser qualification · 2026-10-24

## Deployment and boundary

- Origin: `https://verglos.com`.
- Current Vercel Production deployment: `dpl_2ij33gVtBZwcYSkwhY2g6uRAcfk1`.
- Merged Web source: `5c52423231e286b8e176535b8d97e14fa52bbb03`.
- Capture source: local Playwright Chromium plus Axe against the live public
  deployment; no login, payment, webhook, database, account, customer, or
  release write was performed.
- Raw bounded capture: `.local-evidence/verglos-production-landing-capture-2026-10-24-v2.json`.
  SHA-256: `07a079082e0c2f14f59bc03d437435e6641009bb41cbeea09dd743764867ff56`.

## Result

The browser capture covered all six required public landing paths at desktop
and mobile (**12/12**). Qualification passed with zero source issues and zero
decision gaps:

- Axe accessibility findings: **0**.
- Keyboard-operability failures: **0**.
- Responsive-layout failures: **0**.
- Reduced-motion failures: **0**.
- `robots.txt`: HTTP **200**; `sitemap.xml`: HTTP **200**, **8** URLs.
- Maximum observed LCP **792 ms**, INP **48 ms**, FCP **792 ms**, TTFB
  **271.4 ms**, and CLS **0**.

This is current automated hosted implementation evidence for FINAL-WEB-007/008.
It does not substitute for a human screen-reader observation, field-CWV data,
independent review, customer/recipient acceptance, AppSec/Hunt, or final
release sign-off. No backlog checkbox changed.
