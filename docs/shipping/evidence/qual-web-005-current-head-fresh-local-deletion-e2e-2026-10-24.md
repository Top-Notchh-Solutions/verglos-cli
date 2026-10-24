# QUAL-WEB-005 current-head fresh local deletion E2E · 2026-10-24

## Controlled execution

- Web implementation source: `58fe7e3cc557adb9fafc4bc766fa6afe743fa3a2`;
  the same implementation is present on merged Web `origin/main`
  `d8f415b486b57ab6fa3885d734a4904e11ac435a`.
- Runtime: Node `v26.4.0`, `postgres:16-alpine`, fresh container
  `verglos-qual-web-005-current-20261024`, database `verglos_test` on loopback
  port `55440`.
- Database setup: the reviewed local empty-database bootstrap was explicitly
  confirmed; `pnpm db:migrate` applied **43** migrations successfully. No
  remote Neon URL, Production database, customer record, or provider
  credential was used.
- Test command: the isolated loopback `verglos_test` endpoint was supplied
  through the `TEST_DATABASE_URL` test variable with `NODE_ENV` set to `test`,
  then Node's serial test runner executed
  `src/lib/qual/account-deletion-jobs.integration.test.ts` and
  `src/app/api/v1/account/deletion/route.integration.test.ts`.

## Result

The bounded deletion integration run passed **2/2**, with **0 failures**,
**0 skips**, and **0 cancellations**:

- The authenticated route test verified unauthenticated `401`, cross-origin
  `403`, malformed confirmation `400`, digest registration/idempotency,
  deletion-request `202`/idempotency, worker completion, and retention of the
  customer-held digest.
- The worker integration verified the migrated schema, user-scope enforcement,
  lease/fence behavior, legal-hold blocking, idempotent support deletion,
  bounded hosted-kind deletion, and terminal receipt behavior.
- Fixtures are synthetic and bounded to the isolated database; no real
  customer data was created or touched.

## Shipping disposition

This is current local authenticated non-Production implementation evidence for
`QUAL-WEB-005`. It does not prove Production deletion, legal/customer-held
record disposition, consent inventory, restore/rollback acceptance,
independent review, field evidence, or final release approval. Keep the row
open for those declared boundaries. The authoritative tracker remains
**245 checked / 35 open / 280 total (87.5%)**, partitioned as **13
AppSec-dependent / 22 non-AppSec**. Nothing was deleted from repositories,
databases outside this fresh disposable container, or the shipping ledger.
