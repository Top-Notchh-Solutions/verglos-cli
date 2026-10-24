# FINAL-WEB-007/008 current-head Production Chromium capture · 2026-10-24

## Deployment and source binding

- Origin: `https://verglos.com`
- Vercel deployment: `dpl_L3iuaiDqh6oNwoKeW5Cx6mRd73Hc`
- Deployment state/target: `READY` / `production`
- Exact Web source from Vercel metadata:
  `257e1cc8e0b467d16966433033589111f62f56f0`
- Capture: local Playwright Chromium plus Axe against the live public
  deployment; no login, payment, webhook, database, account, customer, or
  release write was performed.
- Raw capture:
  `.local-evidence/verglos-production-landing-capture-2026-10-24-current-head.json`
- Raw capture SHA-256:
  `bd6490ec142d1e9b218509165db42444503c34261e8dcf883a9ae981388c1706`

## Result

The capture covered six required public paths at desktop and mobile (**12/12**)
and the fail-closed qualification returned `passed` with zero source issues
and zero decision gaps:

- Axe violations: **0**.
- Keyboard-operability failures: **0**.
- Responsive-layout failures: **0**.
- Reduced-motion failures: **0**.
- Maximum observed LCP/FCP: **892 ms / 892 ms**.
- Maximum observed INP/TTFB: **48 ms / 354 ms**.
- Maximum observed CLS: **0**.

Required paths were `/`, `/docs`, `/detectors`, `/proof`, `/verify`, and
`/checkout`, each at both desktop and mobile viewports.

## Shipping boundary

This advances automated hosted implementation evidence for `FINAL-WEB-007` and
`FINAL-WEB-008`. It does not substitute for a human screen-reader observation,
field Core Web Vitals, customer/recipient acceptance, independent review,
AppSec/Hunt review, or final release/go-no-go sign-off. No backlog checkbox
changed.
