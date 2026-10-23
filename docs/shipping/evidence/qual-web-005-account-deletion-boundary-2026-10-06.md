# QUAL-WEB-005 account-deletion request boundary — 2026-10-06

## Evidence

- Web PR #139 (`077a7526b7a39af29cb0a1c9b2865b27cbe0af87`) merged as
  `317102f29d9f6008cc65a53ecc193cae8bc902eb`.
- Hosted verification run `37468093583` passed typecheck, the full configured
  Web test suite, negative-boundary and truth-registry tests, schema and
  migration checks, production build, public-boundary audit, dependency audit,
  CycloneDX SBOM, license inventory/tests, tracked-secret guard, and evidence
  upload. Vercel preview and GitGuardian also passed.
- Local focused route contract passed 2/2; local `pnpm typecheck`,
  `pnpm db:check`, `pnpm db:migrations:check` (25 ordered migrations), and
  `git diff --check` passed.

## Scope and limits

The merged code adds an additive `account_deletion_requests` request ledger and
an authenticated, same-origin, explicit-confirmation boundary with a bounded
hosted-data kind allowlist, private no-store responses, and idempotent pending
requests. It deliberately does not delete the Clerk user or hosted data. A
separately reviewed worker must enforce legal holds and customer-held records
before any deletion. No production migration, database read/write, or customer
data access occurred.

QUAL-WEB-005 remains unchecked. This is runtime-boundary progress, not full
privacy/deletion/retention qualification.
