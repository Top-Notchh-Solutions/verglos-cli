# QUAL-WEB-005 bounded worker contract — 2026-10-07

## Batch boundary

- **Repository:** `verglos-web`
- **PR:** [#153](https://github.com/anuragyadav-git/verglos-web/pull/153)
- **Head:** `aef06b70f1b16d2c4ade4edd43d236b80a0d0b19`
- **Previous head:** `4c5966f7b6dfbe18b33ce61f6ce3705b7eaad026`
- **Backlog:** `QUAL-WEB-005` attempted; remains unchecked.
- **Production state:** no production/database/provider/payment/deployment write, migration, deletion, or browser mutation occurred.

## Implemented substrate

The PR adds a bounded user-scoped worker orchestration contract. It claims a
fenced job, uses the claimed request scope, refuses stale inventory and active
holds before deletion, calls a per-kind idempotent transactional adapter,
rechecks held digests, reconciles the post-delete snapshot through the
existing execution gate, and requires a fenced terminal audit receipt. Adapter
failures map to a stable non-sensitive retry code; lease loss cannot claim
success.

The store interface is intentionally the integration boundary. No production
adapter, queue route, cron schedule, destructive SQL, or deletion execution
was added by this batch.

## Verification

- Worker/deletion/inventory/hold/digest focus: **31/31 pass**.
- Negative-boundary suite: **2/2 pass**.
- Configured serial suite: **846 pass / 22 explicit skips / 0 fail**.
- `pnpm typecheck`: pass.
- `git diff --check`: pass.
- `VERCEL_ENV=preview NODE_ENV=production pnpm build`: pass; **38 pages**.
- Node limitation remains: host Node 26.4 versus repository Node 22.x baseline.

## Acceptance boundary

This remains a worker contract, not `QUAL-WEB-005` acceptance. The missing
operational adapter must still implement bounded claims and retries,
transactional per-kind deletion, row-count reconciliation, terminal audit
receipt persistence, restore/rollback rehearsal, authenticated non-production
E2E, and a reviewed production migration/preflight. Hosted workflow
`37560432960` was in progress at capture.
