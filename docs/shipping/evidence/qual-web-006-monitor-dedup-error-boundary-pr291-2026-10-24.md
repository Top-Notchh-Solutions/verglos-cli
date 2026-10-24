# Monitor cron deduplication/error boundary hardening · 2026-10-24

- **Implementation source:** Web PR #291 merged normally as
  `5bb6c8c34395b0b6a7ac96a8584cee25a5d82404` from implementation commit
  `3ce00711c88ee717def2769fa2b033f9b6c0ad7c`; no squash or branch deletion was
  used.
- **Production change:** The monitor cron now treats only PostgreSQL SQLSTATE
  `23505` as a concurrent unique-key deduplication race. Other database
  failures propagate to the registration error boundary instead of being
  silently counted as suppressed alerts. Successful inserts update the
  in-memory dedup set, preventing duplicate findings in one OSV response from
  dispatching more than once.
- **Verification:** Focused monitor/helper/route contracts passed **7/7**;
  Web TypeScript typecheck passed; `git diff --check` passed.
- **Production receipt:** Vercel deployment
  `dpl_CyRkRR9gBmQcQPX6XS3G4sGGx52h` reached `READY` with target
  `production`. Read-only fetches returned HTTP **200** for six declared paths
  on `verglos.com` (**6/6**) and HTTP **308** canonical redirects for all six
  on `www.verglos.com` (**6/6**). The exact deployment hostname returned
  Vercel SSO **302** for all six paths; no protection bypass was used.
- **Hosted budget boundary:** GitHub-hosted Verify Web and private-runner jobs
  failed before repository steps because the account Actions budget/runners
  are blocked. No rerun was started; local verification is the recorded code
  evidence.
- **Acceptance boundary:** This is production monitor implementation and
  provider/Production runtime evidence. It does not prove authenticated
  dashboard capture, human/field evidence, independent/AppSec review,
  customer/recipient acceptance, or final release sign-off. No checkbox
  changed; score remains **246 checked / 34 open / 280 total (87.9%)**, split
  **13 AppSec-dependent / 21 non-AppSec**.
- **Safety:** No files, branches, database rows, provider resources, or
  customer data were deleted or overwritten.
