# Policy-exception duplicate-error boundary hardening · 2026-10-24

- **Implementation source:** Web PR #292 merged normally as
  `a7d817a1a868eaec6cdf1d7cea3469307266c5c8` from implementation commit
  `434e4e3ad03513981ef559a8e2031917bafb56d5`; no squash or branch deletion
  was used.
- **Production change:** Exception creation and approval-decision routes now
  classify a duplicate write only when PostgreSQL reports SQLSTATE `23505`.
  Unrelated database failures no longer become false client-conflict `409`
  responses merely because an error message contains “unique” or “duplicate”.
- **Verification:** Focused policy/constraint/route contracts passed **21/21**;
  Web TypeScript typecheck passed; `git diff --check` passed.
- **Production receipt:** Vercel deployment
  `dpl_2dxNo38ynNqvCWM9DW1eqH6z9NdM` reached `READY` with target
  `production`. Read-only fetches returned HTTP **200** for six declared paths
  on `verglos.com` (**6/6**) and HTTP **308** canonical redirects for all six
  on `www.verglos.com` (**6/6**). The exact deployment hostname returned
  Vercel SSO **302** for all six paths; no protection bypass was used.
- **Hosted budget boundary:** GitHub-hosted Verify Web and private-runner jobs
  failed before repository steps because the account Actions budget/runners
  are blocked. No rerun was started; local verification is the recorded code
  evidence.
- **Acceptance boundary:** This is production policy/approval implementation
  and provider/Production runtime evidence. It does not prove human/field
  review, independent/AppSec review, customer/recipient acceptance, or final
  release sign-off. No checkbox changed; score remains **246 checked / 34 open /
  280 total (87.9%)**, split **13 AppSec-dependent / 21 non-AppSec**.
- **Safety:** No files, branches, database rows, provider resources, or
  customer data were deleted or overwritten.
