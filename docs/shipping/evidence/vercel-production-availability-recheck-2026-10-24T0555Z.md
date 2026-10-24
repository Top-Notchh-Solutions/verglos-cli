# Vercel Production availability recheck — 2026-10-24T05:55:49Z

## Observed deployment

- Deployment: `dpl_L3iuaiDqh6oNwoKeW5Cx6mRd73Hc`
- URL: `https://verglos-83kpfv16x-anuragyadav20062002s-projects.vercel.app`
- Target/status: Production / `READY`
- Created: `2026-10-24T05:50:47Z`
- Aliases observed: `https://verglos.com`, `https://www.verglos.com`,
  `https://verglos-web.vercel.app`
- Vercel build configuration reported `pnpm config:check && pnpm build` and
  Node `24.x`; deployed route lambdas reported Node `22.x`.

## Read-only public route result

Direct GET requests from the workstation returned HTTP 200 for every route:

| Route | Status |
| --- | ---: |
| `/` | 200 |
| `/robots.txt` | 200 |
| `/sitemap.xml` | 200 |
| `/llms.txt` | 200 |
| `/proof` | 200 |

The check used the existing deployment and made no deployment, migration,
provider, payment, customer, or authenticated state change. No GitHub Actions
run was started by this check.

## Boundary

This is read-only public Production availability evidence for the current Web
surface. It is not authenticated dashboard evidence, human screen-reader or
field-CWV evidence, customer/recipient acceptance, provider publication,
independent review, AppSec/Hunt review, or final release/go-no-go sign-off.
No backlog checkbox changes.
