# SCM delivery lease/concurrency hardening · 2026-10-24

- **Implementation source:** Web PR #289 merged normally as
  `f7719d505e5b855d10514dbc4eabfa5289e8d950`; source branch was preserved and
  no squash or deletion was used.
- **Production change:** The authenticated SCM cron worker now processes
  claimed deliveries through a bounded four-lane worker pool, with a hard
  concurrency ceiling of eight. The Production route uses a 240-second lease
  for its 300-second function limit, leaving room for token exchange and the
  ten-second provider transport timeout. One batch abort signal is shared by
  all lanes, and lease-fenced acknowledgements remain the only persistence
  path.
- **Verification:** Focused SCM/provider/runner/worker/route contracts passed
  **31/31**; Web TypeScript typecheck passed; `git diff --check` passed.
- **Hosted boundary:** GitHub Actions runs for the PR were canceled before
  repository steps because the account Actions budget is blocked. Vercel
  accepted the post-merge Production deployment
  `dpl_Baw6JFHyNxrLfaL3viryXxWMcNcG`, but it was still `QUEUED` at capture;
  no Ready Production receipt is claimed here.
- **Acceptance boundary:** This is real provider-delivery implementation
  evidence. It does not create a live provider installation, customer or
  recipient acceptance, independent review, AppSec/Hunt review, or final
  release sign-off. No checkbox changed; score remains **246 checked / 34 open /
  280 total (87.9%)**, split **13 AppSec-dependent / 21 non-AppSec**.
- **Safety:** No files, branches, database rows, provider resources, or
  customer data were deleted or overwritten.
