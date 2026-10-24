# QUAL-WEB-005 deletion retry clock hardening · 2026-10-24

- **Implementation source:** Web PR #290 merged normally as
  `5ff54cd4f4d3258455327d333c9ab9d673fbbd07`; no squash or branch deletion was
  used.
- **Production change:** The bounded account-deletion batch continues to use
  one selection clock for its due-job query, while each candidate uses a fresh
  production clock for retry scheduling. Deterministic injected clocks remain
  unchanged for replay and tests, so a late failure in a long batch cannot
  schedule its retry in the past.
- **Verification:** Account-deletion and authenticated cron contracts passed
  **11/11**; Web TypeScript typecheck passed; `git diff --check` passed.
- **Hosted boundary:** The post-merge Vercel Production deployment
  `dpl_FP1b4KkeeVep6Ece1TF8rG5BzsCf` reached `READY`. Read-only public fetches
  returned HTTP **200** for six paths on `verglos.com` (**6/6**) and HTTP
  **308** canonical redirects for all six on `www.verglos.com` (**6/6**). The
  exact deployment hostname returned Vercel SSO **302** under deployment
  protection; no bypass was used.
- **Acceptance boundary:** This is real privacy/deletion implementation and
  provider/Production evidence. It does not perform destructive customer
  deletion, restore/rollback acceptance, independent review, customer-held
  record disposition, AppSec/Hunt review, or final release sign-off. No
  checkbox changed; score remains **246 checked / 34 open / 280 total
  (87.9%)**, split **13 AppSec-dependent / 21 non-AppSec**.
- **Safety:** No files, branches, database rows, provider resources, or
  customer data were deleted or overwritten.
