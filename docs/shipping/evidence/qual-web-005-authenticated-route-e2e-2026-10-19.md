# QUAL-WEB-005 authenticated deletion route E2E — 2026-10-19

## Scope

This is an owner-authorized, disposable local qualification of the Web
account-deletion request, customer-held digest, worker, migration, and cron
contract paths. It uses no Production database, customer data, provider
credential, or browser session. It does not claim legal approval, consent
inventory approval, Production migration authorization, or final acceptance.

- Repository: `anuragyadav-git/verglos-web`
- Exact source merge: `0719074d5a6f83198f5e36c0eeb064f2a12e1b1b`
- Worktree: `/private/tmp/verglos-web-qual-web-005-route-e2e-20261019`
- Host: Darwin `25.5.0`, `arm64`
- Docker: client/server `29.7.2`, Linux `arm64`
- Node: `v22.23.3`
- pnpm: `10.34.5`
- PostgreSQL image: `mirror.gcr.io/library/postgres:15-alpine`
- Image digest: `sha256:f7d23353e1b15400d22ebe31189f4d314b87a4c129cc400c8c2d8d4ca127bf81`

## Commands and results

The disposable database was started on Docker Desktop with an empty
`verglos_test` database and trust authentication bound only to local port
`55438`. The reviewed local bootstrap confirmation and `pnpm db:migrate`
applied all **42** ordered migrations. The container was removed after the
run and no database state was retained.

The following focused test command passed **5/5, 0 failed, 0 skipped**:

```text
pnpm exec tsx --test \
  src/lib/account-deletion-cron-workflow.test.ts \
  src/app/api/cron/account-deletion/route-contract.test.ts \
  src/lib/qual/account-deletion-jobs.integration.test.ts \
  src/app/api/v1/account/deletion/route.integration.test.ts
```

The passing cases covered the authenticated cron trigger, hard batch and
malformed-scope bounds, authenticated request/digest registration and
idempotency, one bounded deletion worker execution, held-digest preservation,
lease and legal-hold behavior, approval-gated supporting deletion, and
transaction rollback behavior.

Additional checks passed:

- `pnpm typecheck`
- `pnpm db:check`
- `pnpm db:migrations:check` — 42 ordered migrations
- `git diff --check`
- Docker container cleanup — named disposable container removed

## Evidence integrity

The raw local logs remain outside the public repositories. SHA-256 hashes:

| Artifact | SHA-256 |
| --- | --- |
| Docker pull log | `b761d3dc8b280a3757bd8d7b21590ade249d7389036a7af60de92b3761aab1d6` |
| Migration log | `d93fdcc3521b3cfa5e2c960231d0c0035498371fb22f4118d8ea49e68fbe6e3d` |
| Focused E2E/TAP log | `edb4fe74806c47e420d0b389aecec179f8f3a9c74019155735e3fcf99b4cdf07` |
| Typecheck log | `0657e8f16419403f17f509d5eaa8e3cf02f17eb06f3b02fdf4a29d453708214e` |
| Drizzle schema log | `e6b76492db951aa6f1a46b5330d7b920a688a253f0a0f1317bf9c696abc23e01` |
| Migration-order log | `2bfdea115c2bab0399845e9980c236281a7c3ec916a12f4eca839c5d98850ea4` |
| Container-stop log | `8c4eb62f47e8a2a478215aa45db47731aa92d55e0fa37822623d4132c177b32b` |

## Disposition

This is a substantive authenticated isolated qualification advance. It does
not close `QUAL-WEB-005`, whose remaining criteria are the authorized
non-production/customer-held-record and consent decisions, Production
migration authorization, restore/rollback acceptance, reconciliation, and
independent end-to-end acceptance. No AppSec/Hunt checkbox changed;
`TEAM-CLI-001` is checked. The shipping score remains **235 checked / 45 open /
280 total (83.9%)**.
