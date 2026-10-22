# FINAL-WEB-003 catalog allowance display — PR #250 — 2026-10-23

## Implementation

Web source commit `2b3084f` completes the public plan-term projection for the canonical server catalog. `publicVerificationRequestsPerMonth` and `managedExecutionRunsPerMonth` now flow through the shared public truth type and are displayed in the homepage plan cards and the documentation catalog table. Unset and contracted values remain explicitly `Not set in public catalog` or `Contracted`; no overage schedule is invented.

## Local verification

- Truth registry: **35/35 passed**.
- Public release smoke tests: **7/7 passed**.
- Executable public smoke: **18 routes / 22 claims / 2 proof assets / 0 issues**.
- Typecheck passed.
- Production build generated **49/49 routes**.
- Serial Web suite: **897 passed / 24 explicit skips / 0 failures** across 921 tests.

## Hosted boundary

PR #250 is open at `https://github.com/anuragyadav-git/verglos-web/pull/250`. Required run `39849797930` failed before repository steps for isolated PostgreSQL and Ubuntu/Windows/macOS protocol jobs; all had `runner_id: null`, no runner name, and zero steps. Required type/schema run `39849797894` failed with the same zero-step/no-runner boundary. GitGuardian and Preview Comments passed; Vercel was pending at capture. No rerun, bypass, database, provider, customer, Production, or deployment action was performed. Nothing was deleted.

`FINAL-WEB-003` remains unchecked for its dependency on FINAL-WEB-001 acceptance, hosted/independent evidence where required, and final release acceptance. The score remains **239 checked / 41 open / 280 total (85.4%)**.
