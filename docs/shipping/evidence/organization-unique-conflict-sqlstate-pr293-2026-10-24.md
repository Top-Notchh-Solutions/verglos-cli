# Organization write duplicate-conflict boundary hardening · 2026-10-24

- **Implementation source:** Web PR #293 merged normally as
  `a4a048293501dedc3652aeb82bc4fc40e2e95694` from implementation commit
  `ba2bbac578802614f42987fb9eae3f6af4552f05`; no squash or branch deletion
  was used.
- **Production change:** Organization, project, client-workspace, handoff,
  SCM installation/check, policy, policy-evaluation, and exception write
  routes now classify duplicate writes only from PostgreSQL SQLSTATE `23505`.
  Database outages and unrelated constraint failures are no longer converted
  into false `409` conflict responses by matching error-message text.
- **Verification:** The ten-route unique-conflict contract passed **1/1**;
  helper and policy regression tests passed **20/20**; Web TypeScript
  typecheck passed; `git diff --check` passed.
- **Production receipt:** Vercel deployment
  `dpl_F16xyZxrYkf8AiSLcwAxbSjG8ZyS` reached `READY` with target
  `production`. Read-only fetches returned HTTP **200** for six declared paths
  on `verglos.com` (**6/6**) and HTTP **308** canonical redirects for all six
  on `www.verglos.com` (**6/6**). The exact deployment hostname returned
  Vercel SSO **302** for all six paths; no protection bypass was used.
- **Hosted budget boundary:** GitHub-hosted Verify Web and private-runner jobs
  failed before repository steps because the account Actions budget/runners
  are blocked. No rerun was started; local verification is the recorded code
  evidence.
- **Acceptance boundary:** This is production organization-write
  implementation and provider/Production runtime evidence. It does not prove
  human/field review, independent/AppSec review, customer/recipient
  acceptance, or final release sign-off. No checkbox changed; score remains
  **246 checked / 34 open / 280 total (87.9%)**, split **13 AppSec-dependent /
  21 non-AppSec**.
- **Safety:** No files, branches, database rows, provider resources, or
  customer data were deleted or overwritten.
