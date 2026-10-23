# STUDIO-CLI-001 clean-head custody qualification — 2026-10-21

## Scope

This packet records a fresh clean-worktree qualification of the current Web
Studio custody, client-handoff, recipient-acknowledgement, entitlement, and
tenant-boundary implementation. It is implementation evidence only. It does
not assert a paid entitlement, a provider payment, customer consent, or
recipient acceptance.

## Implementation identity

- Repository: `verglos-web`
- Exact source commit: `62a54b52043143758fe01c6d5854c5204c17c549`
- Worktree: detached clean worktree at `/private/tmp/verglos-web-studio-qual-20261021`
- Runtime: Node `v26.4.0`, pnpm `10.34.5`; the package declares Node `22.x`
- Product code was not changed by this qualification batch.

## Commands and results

- `pnpm install --frozen-lockfile`: passed; lockfile resolution was clean.
- Focused Studio custody/handoff/entitlement suite: **99 passed, 0 failed,
  0 skipped**. The run covered client projection admission and refusal,
  tenant/client leakage, workspace route contracts, handoff issuance,
  acknowledgement, replay/expiry/recipient mismatch, public handoff page,
  Studio composition, allowance refusal/overage/downgrade, organization
  entitlement, and usage-ledger boundaries.
- `pnpm exec tsc --noEmit`: passed.
- `pnpm build`: passed; Next generated **49/49** pages and all declared
  Studio/handoff API routes compiled. The build used the isolated worktree so
  the unrelated dirty parent checkout could not affect module resolution.
- `pnpm db:check`: passed (`Everything's fine`).
- `pnpm db:migrations:check`: passed; **43** ordered PostgreSQL migrations
  verified.
- `git diff --check`: passed; worktree remained clean.

The route-level PostgreSQL custody integration remains represented by the
prior disposable-database evidence in
`studio-cli-001-projection-allowance-pr224-2026-10-19.md`; this packet does
not relabel the pure focused run as hosted database evidence.

## Acceptance mapping and boundary

The current code-side contract is qualified: the server requires the active
Studio `white_label_report` capability before workspace, handoff, or upload
admission; projections remain allowlisted and digest-bound; usage reserves
and releases fail closed; handoff acknowledgement is single-use and returns
only a bounded digest; tenant and recipient boundaries are covered.

`STUDIO-CLI-001` remains unchecked. The missing acceptance artifacts are still
an approved numeric paid/non-production hosted-record allowance bound to the
real qualification organization and an authorized Studio recipient/customer
acknowledgement with hosted/audit evidence. Local or synthetic tests cannot
substitute for those artifacts.

No Production, provider, payment, entitlement, customer, recipient, database,
credential, source, or AppSec state changed. No secrets, raw source, raw
findings, acknowledgement token, or customer data were retained.
