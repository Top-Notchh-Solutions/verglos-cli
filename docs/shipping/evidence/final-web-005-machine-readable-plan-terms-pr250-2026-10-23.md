# FINAL-WEB-005 · machine-readable plan terms · 2026-10-23

## Row and implementation mapping

- **Row:** `FINAL-WEB-005` · metadata/structured data/llms truth pass.
- **Implementation repository:** `verglos-web`.
- **Source branch:** `codex/final-web-003-allowance-display-20261023`.
- **PR:** [#250](https://github.com/anuragyadav-git/verglos-web/pull/250).
- **Implementation commit:** `00996a657510d958e4840ebe40065dbef838edc4`.
- **Preceding catalog projection commit:** `2b3084faeaaf527013a9e31f143a3384f5b918e2`.

The public truth module now derives the monthly/annual billing display and
all machine-readable plan terms from the canonical `PLAN_CATALOG`. `/llms.txt`
now emits every plan's status, billing, capability summary, seats,
applications, records/month, client workspaces, hosted retention, public
verification requests/month, managed execution runs/month, and explicit
`No overage schedule published` wording. Homepage `SoftwareApplication`
JSON-LD carries the same bounded terms as structured `PropertyValue` entries.
Inactive and contracted plans remain explicitly unavailable/contracted; no
price or overage is invented.

## Local verification

All commands ran in the clean Web worktree at the implementation commit:

- `git diff --check` — passed.
- `pnpm run test:truth-registry` — **36 passed / 0 failed**.
- `pnpm run test:public-release-smoke` — **7 passed / 0 failed**.
- `pnpm run public:release-smoke` — **18 routes / 22 claims / 2 proof assets / 0 issues**.
- `pnpm typecheck` — passed.
- `pnpm build` — passed; Next generated **49/49 routes**.
- `pnpm run test:serial` — **897 passed / 24 explicit skips / 0 failed** out of 921.

The local package declares Node `22.x`; the available local runtime was
Node `26.4.0`, and pnpm reported that engine warning without a test failure.

## Hosted boundary and disposition

After the commit was pushed, the required PR checks were not executable:

- Verify Web run `39850836465` failed with the `typecheck-and-schema` job
  reporting **zero steps**.
- Private runner qualification run `39850836344` had Ubuntu, Windows, and
  PostgreSQL jobs fail with **zero steps**; the macOS cell was still queued at
  capture. No repository step executed.
- GitGuardian passed; Vercel Preview Comments passed; Vercel was pending at
  capture.

No rerun, bypass, merge-around, deployment, provider action, database,
customer, legal, Production, or release-sign-off state was performed. No
files were deleted.

`FINAL-WEB-005` remains unchecked because its `FINAL-WEB-001` dependency,
required hosted/independent evidence, and final acceptance are not complete.
The implementation is recorded as code-side progress; the private score
remains **239 checked / 41 open / 280 total (85.4%)**.
