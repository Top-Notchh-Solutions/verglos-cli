# QUAL-WEB-006 CLI authorization label fix — 2026-10-18

## Implementation

Web PR #190, assigned to `anuragyadav-git`, merged normally into `main` as
`e91dc73146a9da093b6f5d85b1863ca73ed4f1e1`. The two implementation commits
remain separate:

- `aa00b6c904e7a6609f6ca061cd5651034a693d76` — gives the CLI authorization
  handoff's user-code input an explicit accessible label and stable control id;
- `268df49280327ba78b0416d2e0076f8cc269a6b4` — adds the focused source-contract
  regression test.

The fix changes only the accessible name of the existing authorization-code
control. It does not change authentication, authorization, code normalization,
token exchange, or redirect behavior.

## Verification

- Focused CLI-auth page test: **1/1 passed**, 0 failed, 0 skipped;
- `pnpm typecheck`: passed in the disposable Web worktree;
- `git diff --check`: passed;
- Hosted `typecheck-and-schema`: passed;
- Hosted Vercel deployment: passed;
- Hosted Vercel Preview Comments: passed;
- GitGuardian Security Checks: passed.

The disposable worktree was based on Web `origin/main` at
`f7e2a1ccb308a69ecf85308a0c953a4a93dabc36`. The local host used Node
`v26.4.0` and pnpm `10.34.5` while the repository declares Node `22.x`; the
hosted workflow ran the declared CI setup and passed.

## Acceptance boundary

This closes a concrete accessible-name defect in the security-layer CLI
authorization handoff and advances the technical portion of `QUAL-WEB-006`.
It does not establish human screen-reader acceptance, paid/customer-state
coverage, large-dataset or field-CWV evidence, provider cutover, or final
independent acceptance. The backlog remains **232 checked / 48 open / 280
total (82.9%)**; no checkbox changed.

No production, provider, registry, database, payment, entitlement, customer,
or account state was changed.

