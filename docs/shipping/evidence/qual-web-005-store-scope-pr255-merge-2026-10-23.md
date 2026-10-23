# QUAL-WEB-005 deletion store scope boundary merged · 2026-10-23

Web PR #255 merged normally into `main` as merge commit
`5c48971efdc3aeb55f1fc391a9db5f9a78b84bb4`, preserving source commit
`17517f80c48689d19501de64e9d63755e15b9872`. The account-deletion PostgreSQL
store now rejects a valid hosted kind that is outside the claimed job's
`requestedKinds` before opening a database transaction. This prevents a
direct adapter caller from performing an out-of-scope destructive operation
that the higher-level worker would only detect afterward.

## Verification

- Focused account-deletion, hold, inventory, execution, and route contracts
  passed **24/24**.
- `pnpm typecheck` passed.
- `pnpm build` passed and generated **49/49** routes.
- The new regression confirms an out-of-scope kind fails before any database
  call.
- `git diff --check` passed.

## Hosted and release boundary

The required hosted jobs were not executed: private-runner run
`39976992891` and Verify Web run `39976992591` failed within seconds with
zero steps and no runner execution. GitGuardian and Vercel Preview Comments
passed; no hosted source qualification result is claimed. No database,
customer, provider, Production, deployment, or deletion operation was run.

This advances QUAL-WEB-005 implementation only. The row remains open for
isolated authenticated deletion E2E, legal/retention and customer-held
decisions, hosted/browser/field evidence, independent review, and final
acceptance. The score remains **244 checked / 36 open / 280 total (87.1%)**.
Nothing was deleted or overwritten.
