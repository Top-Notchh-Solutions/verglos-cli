# QUAL-WEB-005 customer-held digest registration route · 2026-10-07

## Result

Web PR #153 exact head `03d60e99ccf895b3122c4ae6641c3d12b44169bf` adds the
authenticated `/api/v1/account/customer-held-digests` boundary. An account
may register only its own canonical `sha256:<64 lowercase hex>` identity for
the fixed `signed_vgl` record kind, and may list only its own registered
identities. POST requires same-origin, Clerk authentication, a bounded JSON
body, strict schema validation, and idempotent `(user, digest)` persistence.

The route stores no customer-held record bytes, file content, metadata, or
provider credentials. It returns `private, no-store` responses and maps
invalid identities to bounded errors. Legal and contract holds remain outside
this user route; no ordinary account can self-authorize a legal hold.

## Verification

- Focused route/hold/digest/worker tests: **11/11 pass**.
- Full serial Web suite: **870 total / 847 pass / 23 explicit skips / 0 fail**.
- Typecheck, Drizzle schema check, ordered **35-migration** check, negative
  boundary **2/2**, and production build: pass.
- Hosted Verify workflow `37608270504`: pass; Vercel Preview Comments: pass.
- PR #153: open, non-draft, clean/mergeable at the exact head above.

## Acceptance boundary

This is implementation and qualification progress only. `QUAL-WEB-005`
remains unchecked because authenticated non-production deletion E2E, executed
legal/customer-held disposition decisions, consent inventory, production
migration authorization, row-count reconciliation, restore/RPO and deployment
rollback acceptance, and independent end-to-end review remain open. No
production/database/provider/payment/deployment write, migration, deletion, or
browser mutation occurred.

Authoritative private backlog at capture: **218 checked / 62 unchecked / 280
total (77.9%)**. No checkbox changed.
