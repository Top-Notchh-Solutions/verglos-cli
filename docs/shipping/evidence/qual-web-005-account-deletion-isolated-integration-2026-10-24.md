# QUAL-WEB-005 isolated account-deletion integration receipt

Date: 2026-10-24

## Scope

This packet records the real account-deletion route and worker lifecycle run
against the isolated local PostgreSQL `verglos_test` fixture. It is private
qualification evidence only; it is not a Production deletion, customer
acceptance, legal disposition, or independent review.

## Source and environment

- Implementation repository: `anuragyadav-git/verglos-web`
- Implementation commit: `7307ae5e0cea18e6d0803aa179fafcc2a0ce36f8`
- Merged source containing that commit: `257e1cc8e0b467d16966433033589111f62f56f0`
- Test container: `verglos-qual-web-005-current-20261024`
- Database scope: local `verglos_test` on `127.0.0.1:55440`
- No Production, provider, payment, customer, or hosted database endpoint was used.

## Command and result

```text
node --import tsx --test \
  src/lib/qual/account-deletion-jobs.integration.test.ts \
  src/app/api/v1/account/deletion/route.integration.test.ts
```

The runner received the isolated local fixture through the test database
environment variables; their values are intentionally omitted from this
private packet.

Result:

- tests: **2**
- passed: **2**
- failed: **0**
- skipped: **0**
- cancelled: **0**
- todo: **0**
- duration: **528.393833 ms**

The route test covered authenticated request handling, origin and malformed
input rejection, digest idempotency, pending-request idempotency, bounded
requested kinds, worker completion, and held-digest preservation. The worker
test covered user scope, idempotency, lease pairing, legal-hold blocking,
approval boundaries, and rollback/retry behavior.

After the run, read-only fixture checks returned zero residual rows for the
test clerk identity and the six worker request IDs. The integration test also
performs its own cleanup in `finally` blocks.

## Boundary and disposition

This advances the isolated implementation/qualification evidence for
`QUAL-WEB-005`. Keep the backlog row unchecked for destructive account-deletion
acceptance, legal/customer-held-record disposition, restore/rollback
acceptance, row reconciliation, independent review, and final acceptance.
