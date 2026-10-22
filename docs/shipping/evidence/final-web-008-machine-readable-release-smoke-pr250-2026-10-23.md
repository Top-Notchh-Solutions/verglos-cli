# FINAL-WEB-008 · machine-readable release-smoke enforcement · 2026-10-23

## Row and implementation mapping

- **Row:** `FINAL-WEB-008` · final public claim sweep and release smoke.
- **Implementation repository:** `verglos-web`.
- **Source branch:** `codex/final-web-003-allowance-display-20261023`.
- **PR:** [#250](https://github.com/anuragyadav-git/verglos-web/pull/250).
- **Implementation commit:** `37c55a50fa09b4d761319f566d75ec5258c3312d`.

The public release smoke now independently checks each canonical plan's
machine-readable `/llms.txt` line and homepage JSON-LD property for billing,
status, seats, applications, records/month, client workspaces, hosted
retention, public verification requests/month, managed execution runs/month,
and explicit no-overage wording. A regression test mutates a plan line and
requires the smoke to reject the stale output.

## Exact-head verification

- `pnpm run test:public-release-smoke` — **8 passed / 0 failed**.
- `pnpm run public:release-smoke` — **18 routes / 32 claims / 2 proof assets / 0 issues**.
- `pnpm typecheck` — passed.
- `pnpm build` — passed; Next generated **49/49 routes**.
- `pnpm run test:serial` — **897 passed / 24 explicit skips / 0 failed** out of 921.
- `git diff --check` — passed.

The local package declares Node `22.x`; the available local runtime was
Node `26.4.0`, and pnpm reported that engine warning without a test failure.

## Hosted boundary and disposition

Fresh required checks for the pushed exact head were not executable:

- Verify Web run `39851784662` failed with its `typecheck-and-schema` job
  reporting **zero repository steps**.
- Private runner qualification run `39851784544` failed with zero steps on
  Ubuntu, macOS, Windows, and isolated PostgreSQL lifecycle jobs.
- GitGuardian passed; Vercel Preview Comments passed; Vercel was pending at
  capture.

No rerun, bypass, merge-around, deployment, provider action, database,
customer, legal, Production, or release-sign-off state was performed. No
files were deleted. PR #250 remains open.

This is code-side FINAL-WEB-008 progress. Keep the row unchecked for its
FINAL-WEB-001–007 dependencies, hosted/field/acceptance evidence, and final
release sign-off. The private score remains **239 checked / 41 open / 280
total (85.4%)**.
