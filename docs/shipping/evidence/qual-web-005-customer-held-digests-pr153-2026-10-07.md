# QUAL-WEB-005 customer-held digest registry substrate — 2026-10-07

## Batch boundary

- **Repository:** `verglos-web`
- **PR:** [#153](https://github.com/anuragyadav-git/verglos-web/pull/153)
- **Head:** `4c5966f`
- **Previous head:** `adf9a23b395a2c35208bd7d9cfcc7973300c2827`
- **Backlog:** `QUAL-WEB-005` attempted; remains unchecked.
- **Production state:** migrations `0029` and `0030` are source-only and not applied; no production/database/provider/payment/deployment write, deletion, or browser mutation occurred.

## Implemented substrate

The PR adds `customer_held_record_digests`, a user-scoped registry that stores
only canonical `sha256:` identities for signed `.vgl` records, with duplicate
protection and no record bytes. Pure contracts normalize and validate digests,
refuse duplicates, and compare before/after snapshots so a future worker can
prove the held set is unchanged. The deletion inventory now includes the
registry table.

## Verification

- Combined deletion/inventory/hold/digest qualification focus: **28/28 pass**.
- Configured serial suite: **846 pass / 22 explicit skips / 0 fail**.
- `pnpm typecheck`: pass.
- `pnpm db:check`: pass.
- `pnpm db:migrations:check`: pass; **31 ordered migrations**.
- `git diff --check`: pass.
- `VERCEL_ENV=preview NODE_ENV=production pnpm build`: pass; **38 pages**.
- Node limitation remains: host Node 26.4 versus repository Node 22.x baseline.

## Acceptance boundary

This remains a proof substrate, not `QUAL-WEB-005` acceptance. There is still
no authenticated registry writer, bounded deletion worker, claim/retry/
idempotency path, transactional per-kind deletion, row-count reconciliation,
terminal audit receipt, restore rehearsal, or authenticated non-production E2E.
Hosted checks for the new head were pending at capture.

## Hosted result update

The exact-head hosted workflow `37559903900` later passed in **2m42s** at job
`112594573865`, including serial tests, negative boundary, truth registry,
schema/migration checks, build, public-boundary, dependency/SBOM/license, and
tracked-secret checks. Vercel, GitGuardian, and Preview Comments also passed.
PR #153 remains open and is not deletion acceptance or production migration
evidence.
