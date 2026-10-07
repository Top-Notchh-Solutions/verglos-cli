# Web migration bootstrap guard — 2026-10-07

## Scope

- Web worktree: `verglos-web/.worktrees/web-plan-013`.
- PR: #149, pushed exact head `e46299a`.
- Batch boundary: preserve the applied Drizzle journal and make the historical
  pre-Drizzle baseline explicit and fail-closed.

## Implementation

- `scripts/db-migrate.ts` now performs a read-only inventory before invoking
  Drizzle. It requires either existing migration history or the required
  `users` + `licenses` legacy baseline, and refuses partial or unknown schemas.
- `scripts/legacy-baseline.sql` contains only the reviewed additive baseline
  for `users`, `licenses`, `activations`, `reports`, and `heartbeats`.
- An empty database is bootstrapped only for a local, explicit two-variable
  opt-in. CI and production cannot use that path. No numbered migration was
  edited and the journal remains unchanged.
- `docs/deployment-runbook.md` documents the baseline boundary and current
  31-migration source set.
- The final safety correction counts every non-system schema, not only
  `public`, before classifying a database as empty. This prevents a database
  containing custom-schema tables from entering the local bootstrap path.

## Verification

- Focused migration/guard/audit tests: **12 passed / 0 failed / 0 skipped**.
- Full serial Web suite: **878 tests, 855 passed, 23 explicit skips, 0 failed**.
- `pnpm exec tsc --noEmit`: passed.
- `pnpm db:check`: passed.
- `pnpm db:migrations:check`: **31 ordered migrations** verified.
- `pnpm build`: passed; 40 static pages/routes generated. Existing Node 22
  engine warning was emitted on Node `v26.4.0`.
- Public-boundary audit and `git diff --check`: passed.
- SBOM: CycloneDX 1.6, 414 components and 415 dependency-graph entries;
  license inventory completed with its existing manual-review findings.
- Disposable Docker `postgres:15` rehearsal: default invocation exited 1 and
  left **0** public tables; explicit local opt-in applied all **31** migrations
  and left all **5** baseline tables present. The container was removed.
- After the non-system-schema correction, typecheck, focused migration/guard/
  audit tests (**12/12**), ordered migration check, and diff checks passed on
  both PR #149 (`e46299a`, 31 migrations) and PR #153 (`47af6fa`, 35
  migrations).

## Boundary and disposition

- No production database inspection/write, migration, deployment, payment,
  provider configuration, browser mutation, or credential operation occurred.
- This closes the opaque fresh-empty-database failure mode and supplies a
  repeatable local bootstrap rehearsal. It does not authorize production
  migration or close `QUAL-WEB-005`, `PLAN-WEB-011`–`015`, or R-041.
- No backlog checkbox changed; authoritative count remains **218 checked / 62
  unchecked / 280 total (77.8571%, 77.9%)**.

## Merge-candidate port

The same guard was ported cleanly to Web PR #153, the 35-migration deletion
candidate, at exact pushed head `47af6fa`. Its focused migration/guard/audit
tests pass **12/12**, typecheck, `db:check`, and `db:migrations:check` verify
**35 ordered migrations**, and its serial suite passes **850/873 with 23
explicit skips and 0 failures**. A fresh Docker `postgres:15` rehearsal again
left zero public tables on default refusal and applied all 35 migrations plus
the five baseline tables only under explicit local opt-in. PR #153 remains
open and must not be merged/deployed until its independent privacy, migration,
restore/rollback, and release gates are accepted.

PR #149 was subsequently merged as `8b843da` after its hosted typecheck/schema,
Vercel, and Preview Comments checks passed. This merge advances the code-side
checkout/migration implementation only; payment lifecycle, production
reconciliation, and release gates remain open.
