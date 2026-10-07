# QUAL-WEB-005 durable hold authority substrate — 2026-10-07

## Batch boundary

- **Repository:** `verglos-web`
- **PR:** [#153](https://github.com/anuragyadav-git/verglos-web/pull/153)
- **Head:** `adf9a23b395a2c35208bd7d9cfcc7973300c2827`
- **Previous head:** `718aadcaa384dcfd8a5fc4789c3b62c23c9e3858`
- **Backlog:** `QUAL-WEB-005` attempted; remains unchecked.
- **Production state:** migration `0029_account_deletion_holds.sql` is not applied; no production/database/provider/payment/deployment write, deletion, or browser mutation occurred.

## Implemented substrate

The PR adds a durable `account_deletion_holds` schema with typed hold kinds,
bounded reasons and actor identity, optional request binding, expiry rules,
customer-deletion finite-expiry enforcement, and explicit release fields. It
adds pure admission, release, active-hold, and aggregate-hold decisions plus
relations and focused tests. The migration adds tables and indexes only; it
does not create a worker or execute deletion.

## Verification

- New hold tests: **3/3 pass**.
- Combined deletion/inventory/qualification focus: **25/25 pass**.
- Configured serial suite: **846 pass / 22 explicit skips / 0 fail**.
- `pnpm typecheck`: pass.
- `pnpm db:check`: pass.
- `pnpm db:migrations:check`: pass; **30 ordered migrations**.
- `git diff --check`: pass.
- `VERCEL_ENV=preview NODE_ENV=production pnpm build`: pass; **38 pages**.
- Node limitation remains: host Node 26.4 versus repository Node 22.x baseline.

## Acceptance boundary

This is still a substrate, not `QUAL-WEB-005` acceptance. A bounded
user-scoped worker, claim/retry/idempotency, transactional per-kind deletion,
row-count reconciliation, terminal audit receipt, customer-held digest
registration/proof, restore rehearsal, and authenticated non-production E2E
remain required. Hosted checks for the new head were in progress at capture.
