# QUAL-WEB-005 digest-registration/deletion lock qualification · 2026-10-22

## Source and promotion

- **Repository:** `anuragyadav-git/verglos-web`
- **Implementation commit:** `bac88808473cf90730810347d5ced0c2df8b4699`
- **Pull request:** [#230](https://github.com/anuragyadav-git/verglos-web/pull/230)
- **Merge commit:** `38635e52bb2ce9db5b1804986c12ef9d7b897f15`
- **Source branch:** `codex/studio-entitlement-recipient-20261019`; preserved after merge.

## Implementation

The customer-held digest registration route now uses the same user-scoped
PostgreSQL advisory transaction lock as the deletion request and reviewed
worker. It preserves idempotent duplicate registration, but rejects a new
digest mutation after an account deletion request is pending. Deletion request
creation takes the same lock, so the two boundaries cannot race through an
inconsistent customer-held digest snapshot.

## Verification

- Focused privacy/deletion contracts: **15/15 passed**.
- Full Web suite: **893 passed**, **24 explicit skips**, **0 failures**.
- Web typecheck: passed.
- `git diff --check`: passed.
- Hosted Verify run `39767070146`: success at the implementation commit.
- Hosted Private runner qualification run `39767070242`: success at the implementation commit.
- The owner-provided `.env.test.local` target resolves to a remote Neon
  database rather than an isolated local `verglos_test` database. The
  destructive deletion integration test was therefore not run, and no
  database connection or database write was made from this qualification.

## Boundary and disposition

This is substantive QUAL-WEB-005 implementation and hosted CI evidence. No
customer, Production, provider, legal, restore/rollback, reconciliation, or
independent acceptance evidence was fabricated; no deletion was executed.
Keep `QUAL-WEB-005` unchecked until its complete row contract is satisfied.
The live checklist remains **239 checked / 41 open / 280 total (85.4%)**.
