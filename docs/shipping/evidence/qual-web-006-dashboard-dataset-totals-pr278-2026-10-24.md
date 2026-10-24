# QUAL-WEB-006 dashboard dataset-total binding · 2026-10-24

Web PR #278 merged normally as `11b4f5c717c4b127655b53a15f029c693fb1fdcd`
from implementation commit `0da1d132ab79349c264b96f8118aabf6c04880f1`.

The authenticated dashboard now exposes real tenant-scoped dataset totals for
bounded views that intentionally render a limited slice. The shared
`DatasetSummary` projection emits `data-verglos-dataset-total` from server
`count(*)` results and visibly reports `N shown · M total` when a page is
bounded. The merged pages covered by this slice are Home applications, Audit
export availability, Policy versions, and Client workspaces. Existing
paginated Applications, Findings, Releases, Monitoring, and Records views keep
their existing server-reported pagination total contract.

Local verification passed:

- `pnpm exec tsc --noEmit`
- focused dashboard qualification/boundary contracts: **14/14**
- `pnpm test:serial`: **904 passed / 24 designed database-dependent skips / 0 failures / 928 total**
- `pnpm build`: **49/49** generated routes
- `git diff --check`

The merged commit produced a READY Vercel Production deployment at
`verglos-bzjg1c6p6-anuragyadav20062002s-projects.vercel.app`, target
`production`, bound to GitHub commit `11b4f5c717c4b127655b53a15f029c693fb1fdcd`.
Bounded read-only requests to `https://verglos.com/`,
`https://www.verglos.com/`, `/proof`, `/checkout`, `/llms.txt`, `/robots.txt`,
and `/sitemap.xml` returned HTTP **200**. No authenticated dashboard request,
database write, payment/provider transaction, customer repository, customer
data, publication, deletion, or final npm release occurred. GitHub Actions
checks were not used as qualification evidence because the account budget is
blocked; verification was local plus the Vercel provider build.

This advances QUAL-WEB-006 implementation and honest browser-observable data
coverage only. It does not close the row: the complete 13-route 100-row
capture, local/field CWV acceptance, human screen-reader review, independent
review, and final acceptance remain open. No checkbox changed; score remains
**245 checked / 35 open / 280 total (87.5%)**.
