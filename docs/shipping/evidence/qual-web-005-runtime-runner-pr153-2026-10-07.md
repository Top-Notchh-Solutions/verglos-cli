# QUAL-WEB-005 runtime runner wiring · 2026-10-07

## Scope

Web PR #153 exact head `1f8571b4a146e9ef78ca9ae25c13b86f8e89665c` adds a
bounded account-deletion batch runner and authenticated Node cron route. The
runner caps a batch at 10 jobs, selects only due pending/retry/expired-running
jobs, validates the frozen seven-kind allowlist, delegates to the existing
fenced worker, and reports bounded terminal summaries. The route requires a
Bearer `CRON_SECRET`, requires `DATABASE_URL`, closes its PostgreSQL client in
`finally`, and does not disclose configuration values.

## Evidence

- Local TypeScript check passed.
- Route contract tests passed 2/2.
- Disposable PostgreSQL integration passed 1/1, including one batch invocation
  that remained blocked because the inventory gate is deliberately false.
- Negative boundary passed 2/2; truth registry passed 25/25.
- Serialized suite: 846 passed / 23 explicit skips / 0 failed / 869 total.
- Database/schema check passed; ordered migration check passed for 34
  migrations; production-semantics build passed with 38 routes, including
  `/api/cron/account-deletion`.
- Hosted Verify workflow `37563987818`, job `112607416147`, passed typecheck,
  tests, schema/migrations, build, public-boundary, dependency/SBOM/license,
  and tracked-secret checks. Vercel, GitGuardian, and Preview Comments also
  passed.

## Acceptance boundary

This is code and disposable-DB evidence only. The cron route has not been
deployed or invoked against production, no destructive production operation
occurred, and `QUAL-WEB-005` remains open. Supporting ownership/retention and
legal disposition mapping, complete row-count reconciliation, restore/rollback
rehearsal, and authenticated non-production browser E2E are still required.
The private backlog remains **218 checked / 62 unchecked / 280 total**.
