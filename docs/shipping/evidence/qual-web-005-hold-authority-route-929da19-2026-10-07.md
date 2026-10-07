# QUAL-WEB-005 protected deletion hold authority · 2026-10-07

## Result

Web PR #153 exact head `929da1907f001c8db71df0e601e08014590fd580` adds a
protected operational boundary for durable account-deletion holds:

- `POST/GET /api/v1/admin/account-deletion/holds` requires Clerk
  authentication, `SUPER_ADMIN_EMAILS` or `SUPER_ADMIN_CLERK_IDS` identity
  admission, and (for mutation) same-origin requests.
- Activation is bounded to a target user UUID, optional user-matching deletion
  request UUID, the three reviewed hold kinds, a bounded reason, and an
  expiry that is checked by the existing pure admission contract.
- `customer_deletion_request` holds require a deletion request reference.
- `PATCH /api/v1/admin/account-deletion/holds/:holdId` requires the same
  operator boundary, a bounded release reason, and an atomic unreleased-row
  predicate so concurrent release cannot produce two terminal decisions.
- Responses are private/no-store and expose no record bytes, file content,
  provider credentials, or raw database exception details.

Ordinary authenticated users cannot create or release holds. The hold table
remains the durable authority consumed by the deletion worker.

## Verification

- Focused hold/admin/digest/worker contracts: **10/10 pass**.
- Full serial Web suite: **872 total / 849 pass / 23 explicit skips / 0 fail**.
- Typecheck, Drizzle schema check, ordered **35-migration** check, negative
  boundary **2/2**, truth registry **25/25**, SBOM, license inventory, and
  production build: pass.
- Hosted Verify workflow `37608932973`: pass; Vercel, GitGuardian, and
  Preview Comments: pass.
- PR #153: open, non-draft, clean/mergeable at the exact head above.

## Acceptance boundary

This is implementation and qualification progress only. `QUAL-WEB-005`
remains unchecked because migrations `0029`–`0034` are not applied to
production, authenticated non-production deletion E2E, legal/customer-held
disposition decisions, consent inventory, deletion row reconciliation,
restore/RPO, deployment rollback, and independent acceptance remain open. No
production/database/provider/payment/deployment write, migration, deletion, or
browser mutation occurred.

Authoritative private backlog at capture: **218 checked / 62 unchecked / 280
total (77.9%)**. No checkbox changed.
