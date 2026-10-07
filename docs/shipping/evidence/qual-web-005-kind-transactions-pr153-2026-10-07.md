# QUAL-WEB-005 per-kind deletion transactions · 2026-10-07

## Batch boundary

Web PR #153 adds source-only migration `0033_account_deletion_kind_operations`
and a lease-fenced PostgreSQL operation boundary. Each hosted kind is deleted
only within the user-owned personal organization or license scope, with a
durable request/kind idempotency row and deleted-row count written in the same
transaction. The global worker gate remains fail-closed because the complete
supporting ownership/retention inventory is not yet qualified.

## Evidence

- Exact head: `9476e5d018c9ab18bd09fa6bec4f89e2ff353e92`.
- PR #153: open, `CLEAN`, not merged:
  https://github.com/anuragyadav-git/verglos-web/pull/153
- Hosted workflow `37563632682`, job `112606299085`: passed.
- Hosted checks: typecheck, serial suite, negative-boundary/truth checks,
  schema and ordered-migration validation, production build, public-boundary,
  dependency/SBOM/license checks, tracked-secret guard, Vercel, GitGuardian,
  and Preview Comments.
- Local focused qualification: 29/29; disposable PostgreSQL integration: 1/1;
  typecheck; Drizzle check; 34 ordered migrations; negative boundary 2/2;
  truth registry 25/25; serial 846 pass / 23 explicit skips / 0 fail / 869;
  production build 38 routes; diff check.
- Docker disposable Postgres was stopped after verification.

## Remaining acceptance boundary

`QUAL-WEB-005` remains unchecked. Supporting user/license/billing/telemetry/
retention dispositions, complete data-graph reconciliation, runtime worker
invocation, restore/rollback rehearsal, and authenticated non-production E2E
remain required. No production migration, deletion, database/provider write,
payment, deployment, or browser mutation occurred.

Authoritative backlog: **218 checked / 62 unchecked / 280 total**.
