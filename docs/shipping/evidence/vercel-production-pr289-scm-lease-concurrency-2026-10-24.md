# Vercel Production receipt for Web PR #289 · 2026-10-24

- **Deployment:** Vercel deployment
  `dpl_Baw6JFHyNxrLfaL3viryXxWMcNcG` for `verglos-web` reached `READY` with
  target `production` after Web PR #289 merged as
  `f7719d505e5b855d10514dbc4eabfa5289e8d950`.
- **Public production matrix:** Read-only Node fetches returned HTTP **200**
  for `/`, `/proof`, `/checkout`, `/llms.txt`, `/robots.txt`, and
  `/sitemap.xml` on `https://verglos.com` (**6/6**). The `www` hostname
  returned the expected HTTP **308** canonical redirect to `verglos.com` for
  all six paths (**6/6**); no redirect was followed for the assertion.
- **Deployment-host boundary:** The exact Vercel deployment hostname returned
  HTTP **302** to Vercel SSO for each route because deployment protection is
  enabled. No protection-bypass credential was used, so no 200 result is
  claimed for that hostname.
- **Acceptance boundary:** This is provider/Production runtime evidence for
  the merged SCM delivery hardening. It does not create a provider
  installation, database/payment/customer write, authorized recipient
  acceptance, independent/AppSec/Hunt review, or final release sign-off. No
  checkbox changed; score remains **246 checked / 34 open / 280 total
  (87.9%)**, split **13 AppSec-dependent / 21 non-AppSec**.
- **Safety:** Read-only requests only; no files, branches, database rows,
  provider resources, or customer data were deleted or overwritten.
