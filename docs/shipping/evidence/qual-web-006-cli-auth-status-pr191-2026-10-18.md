# QUAL-WEB-006 CLI authorization status announcements — 2026-10-18

## Implementation

Web PR #191, assigned to `anuragyadav-git`, merged normally into `main` as
`ed7febf0340a7d238fbc47bd53bc5a4a7f84bfb9`. The two implementation commits
remain separate:

- `356cd31b4370a1c1b3b01a701a8226d0eca9737d` — marks successful CLI
  authorization as a polite live region and authorization failure as an alert;
- `038f2a996b1fec5118420191615b40cadb31a6b4` — adds focused source-contract
  regression assertions for both announcements.

The fix changes only assistive-technology announcement semantics. It does not
change authentication, authorization, code normalization, token exchange,
redirect, or error-message behavior.

## Verification

- Focused CLI-auth tests: **2/2 passed**, 0 failed, 0 skipped;
- `pnpm typecheck`: passed in the disposable Web worktree;
- `git diff --check`: passed;
- Hosted `typecheck-and-schema`: passed;
- Hosted Vercel deployment: passed;
- Hosted Vercel Preview Comments: passed;
- GitGuardian Security Checks: passed.

The disposable worktree was based on Web `origin/main` at
`e91dc73146a9da093b6f5d85b1863ca73ed4f1e1`. The local host used Node
`v26.4.0` and pnpm `10.34.5` while the repository declares Node `22.x`; the
hosted workflow ran the declared CI setup and passed.

## Acceptance boundary

This advances the technical accessibility of the security-layer CLI
authorization handoff. It does not establish human screen-reader acceptance,
paid/customer-state coverage, provider cutover, large-dataset or field-CWV
evidence, or final independent acceptance. The backlog remains **232 checked /
48 open / 280 total (82.9%)**; no checkbox changed.

No production, provider, registry, database, payment, entitlement, customer,
or account state was changed.

