# QUAL-WEB-005 fresh isolated deletion E2E · 2026-10-24

## Controlled local execution

- Web source: `791500d4dbc495312287287f692a6fc39120e3a2` (current merged head).
- Runtime: Node `v26.4.0`, `postgres:16-alpine` in a fresh local Docker
  container, database `verglos_test` on loopback port `55438`.
- Migration setup: the reviewed non-production empty-database bootstrap was
  explicitly confirmed, followed by `pnpm db:migrate`; migrations applied
  successfully. No remote Neon URL, Production database, customer record, or
  provider credential was used.
- Command: the two integration test files were run with the isolated loopback
  `verglos_test` endpoint supplied through the test-database environment and
  `NODE_ENV` set to `test`.

## Result

The bounded deletion E2E passed **2/2**, with **0 failures** and **0 skips**:

- The authenticated route test verified unauthenticated `401`, cross-origin
  `403`, malformed confirmation `400`, digest registration/idempotency,
  deletion-request `202`/idempotency, worker completion, and retention of the
  customer-held digest.
- The worker integration verified the reviewed migration schema, user-scope
  enforcement, lease/fence behavior, legal-hold blocking, idempotent support
  deletion, bounded hosted-kind deletion, and terminal receipt behavior.
- Synthetic test identities and rows were cleaned up by the test fixture; no
  real customer data was created.

## Shipping disposition

This is current local authenticated non-production deletion evidence for
`QUAL-WEB-005`. It does not claim Production deletion, legal/customer-held
record disposition, consent inventory, restore/rollback acceptance, independent
review, or final release approval. Keep the row open for those declared
contracts. The authoritative tracker remains **245 checked / 35 open / 280
total (87.5%)**. Nothing was deleted from the repositories or shipping ledger.
