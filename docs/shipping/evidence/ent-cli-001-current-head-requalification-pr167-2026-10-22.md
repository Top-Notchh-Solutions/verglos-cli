# ENT-CLI-001 exact merged-head private-runner requalification · 2026-10-22

## Scope and source identity

This packet refreshes the repository-owned private-runner qualification after
the current public CLI merge. It does not claim operational enrollment,
enterprise-runner execution, customer acceptance, or independent review.

- CLI exact merged head: `db3510356ecd6c6e430d7dcb3b9354e514d777ee`
- Web exact merged head: `02f5aba95c4172255cc522730c6ffecc1598cbda`
- Relevant CLI surfaces: `packages/shared/src/private-runner.ts`,
  `packages/cli/src/private-runner-client.ts`, runner commands, and bounded
  credential/replay state.
- Relevant Web surfaces: private-runner enrollment, job lease, result upload,
  transport, route-contract, and workflow qualification code.

## Verification

- `pnpm --filter @verglos/shared test`: **460/460 passed**, 0 failed, 0
  skipped.
- `pnpm --filter verglos test`: **311/313 passed**, 0 failed, 2 documented
  skips.
- `pnpm --filter verglos typecheck`: exit 0.
- `pnpm --filter verglos build`: exit 0.
- Web `pnpm test:private-runner`: **26/26 passed**, 0 failed.
- Web `pnpm typecheck`: exit 0.
- `git diff --check`: passed on both clean exact-head worktrees.

The covered boundaries include signed short-lived jobs, exact signature bytes,
tenant/runner/target binding, GET-only polling, local replay persistence and
mode-0600 permissions, malformed response refusal, bounded response time and
size, least-evidence result projection, fixed result upload route, malformed
acknowledgement refusal, runner credential separation, lease scope, and
cross-tenant/cross-runner replay refusal. No raw source or arbitrary command
field crosses the protocol.

## Remaining contract and disposition

`ENT-CLI-001` remains unchecked. The missing artifacts are an authorized
operational enrollment credential exchange, approved enterprise/recipient
runner execution and result reconciliation, operational acceptance of that
deployed runner, any required independent review, and authorized enterprise
acceptance. No provider, Production, customer, database, deployment, or
credential operation occurred; nothing was deleted.

Score remains **239 checked / 41 open / 280 total (85.4%)**. Evidence is
private and is not added to the public CLI or Web repositories.
