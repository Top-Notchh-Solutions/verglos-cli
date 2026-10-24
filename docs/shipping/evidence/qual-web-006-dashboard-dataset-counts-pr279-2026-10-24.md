# QUAL-WEB-006 dashboard dataset counts · Web PR #279 · 2026-10-24

Web PR #279 merged normally as `ab6bb6c0cc13c38d20c5296a37b48171f07db8ee`
from implementation commit `9291d0834a37d18b56e1d1df135dfb2d86f8e13a`.

The authenticated Alerts, SCM, Members, and Billing dashboards now expose
exact server-side dataset counts beside their bounded rendered slices. Alert
dispatch counts preserve the existing organization/license/project binding;
SCM, membership, invitation, subscription, and payment counts use bounded
tenant- or owner-scoped `count(*)` queries. No secret, provider payload, or
raw credential is selected by these projections.

Local verification passed:

- `pnpm exec tsc --noEmit`
- `pnpm test:dashboard-release`: **4/4**
- `pnpm test:serial`: **904 passed / 24 designed database-dependent skips / 0 failures / 928 total**
- `pnpm build`: **49/49** generated routes
- `git diff --check`

Vercel deployment `dpl_4jTk3gJtYBAG2rtx8EcqP1UKEUBA` is **READY** with target
`production` for the merged commit. Read-only requests to `/`, `/proof`,
`/checkout`, `/llms.txt`, `/robots.txt`, and `/sitemap.xml` on both
`https://verglos.com` and `https://www.verglos.com` returned HTTP **200** after
the canonical redirect where applicable. No authenticated dashboard request,
database write, payment/provider transaction, customer repository, customer
data, publication, deletion, or final npm release occurred. GitHub Actions
checks were not used as qualification evidence because the account budget is
blocked; local verification and the Vercel provider build were used.

This advances QUAL-WEB-006 implementation and provider/runtime evidence only.
It does not close the complete 13-route 100-row capture, loading/error
qualification, human/field CWV, screen-reader, independent-review, or final
acceptance requirements. No checkbox changed; score remains **245 checked / 35
open / 280 total (87.5%)**, with **13 AppSec-dependent / 22 non-AppSec** rows
open.
