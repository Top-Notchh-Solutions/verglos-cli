# CLI authorization unique-collision boundary hardening · 2026-10-24

- **Implementation source:** Web PR #294 merged normally as
  `f5544a85857b8d2ebe911e0265ebec5afd55f53d` from implementation commit
  `44fbc58d7495906e5408fa2398d1796b89a1120f`; no squash or branch deletion
  was used.
- **Production change:** `/api/v1/cli-auth/start` now retries only when
  PostgreSQL reports SQLSTATE `23505` for a user-code collision. Database
  outages and unrelated constraint failures fail fast with the existing
  bounded `500` response instead of being hidden behind five retries.
- **Verification:** The CLI-auth route contract, unique-constraint helper
  tests, and organization conflict contract passed; Web TypeScript typecheck
  passed; `git diff --check` passed.
- **Production receipt:** Vercel deployment
  `dpl_GUmcRvJ9c5ykdJEpVTNQBCvhAunj` reached `READY` with target
  `production`. Read-only fetches returned HTTP **200** for six declared paths
  on `verglos.com` (**6/6**) and HTTP **308** canonical redirects for all six
  on `www.verglos.com` (**6/6**). The exact deployment hostname returned
  Vercel SSO **302** for all six paths; no protection bypass was used.
- **Hosted budget boundary:** GitHub-hosted Verify Web and private-runner jobs
  failed before repository steps because the account Actions budget/runners
  are blocked. No rerun was started; local verification is the recorded code
  evidence.
- **Acceptance boundary:** This is production CLI-auth implementation and
  provider/Production runtime evidence. It does not prove human/field review,
  independent/AppSec review, customer/recipient acceptance, or final release
  sign-off. No checkbox changed; score remains **246 checked / 34 open / 280
  total (87.9%)**, split **13 AppSec-dependent / 21 non-AppSec**.
- **Safety:** No files, branches, database rows, provider resources, or
  customer data were deleted or overwritten.
