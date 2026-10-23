# ENT-CLI-001 current-head implementation qualification — 2026-10-22

## Scope

This packet records a fresh qualification of the private-runner CLI from the
clean detached CLI source at the current merged head. It is implementation
evidence only and does not close `ENT-CLI-001`.

## Exact source and verification

- CLI source: `72190acae81b454a4a88a0ea8d222c8981ac9a3f`
- Worktree: `/private/tmp/verglos-cli-ent-current-20261022`
- Installation: `pnpm install --frozen-lockfile` passed.
- Workspace build: `pnpm exec turbo run build --force` passed **8/8**.
- Workspace typecheck: `pnpm exec turbo run typecheck --force` passed **14/14**.
- CLI package typecheck: `pnpm --filter verglos typecheck` passed.
- CLI package test process: `pnpm --filter verglos test` exited **0** with no
  failure; runner, projection, signing, rollback, and standard-record
  contract groups completed in the run.
- `git diff --check`: passed; the detached worktree remained clean.

The qualification covers the current signed-job, tenant/runner/target-bound,
GET-only polling, replay, malformed-result, least-evidence projection, and
bounded failure-handling implementation already described by the prior
runner packets.

## Acceptance boundary

The implementation run does not establish an operational enrollment credential
exchange, an authorized enterprise runner performing a real bounded job,
cross-platform operational acceptance, independent review, or enterprise
customer acceptance. `ENT-CLI-001` remains unchecked. No production,
customer, provider, registry, database, payment, or AppSec state changed.
