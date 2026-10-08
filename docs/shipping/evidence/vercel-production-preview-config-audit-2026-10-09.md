# Vercel production/Preview configuration audit — 2026-10-09

## Read-only scope

- Project: `verglos-web`
- Vercel project ID: `prj_ssnvOaAkJ2WUdTWFj6XjAAxSOmqg`
- Commands: `vercel whoami`, `vercel project inspect`,
  `vercel env ls --format json` with metadata-only projection, and
  `vercel list --json` with secret values omitted.
- No environment variable value was read, printed, added, updated, or removed.

## Deployment state

- Latest production deployment: READY, source SHA
  `be4289f838b4cd53ed243979bfd7623262b69636`.
- Latest Preview deployment for the merged guard: READY, source SHA
  `37796165c42654f43eaca44eb6a363657e22298d`.
- The production deployment follows the merged Web PR #170.

## Environment metadata findings

- Production `DATABASE_URL` exists as an encrypted variable and has an
  `updatedAt` metadata timestamp of `2026-10-08T08:06:02.138Z`, after its
  original creation metadata and before the latest production deployment.
- This timestamp is evidence that the Vercel value was updated; it does not
  prove the target database identity, old-credential revocation, backup,
  restore, or application-data reconciliation.
- `RAZORPAY_ENABLED_PAYMENT_METHODS` is present for Production only.
- `DATABASE_URL` is present for Production only; there is no Preview
  `DATABASE_URL` in the metadata list.
- `VERGLOS_PREVIEW_DATABASE_ISOLATED` is absent from the Vercel project.
- Preview Razorpay key/webhook variables exist, but Preview has no enabled
  payment-method catalog, so the new runtime guard keeps Preview payments
  disabled rather than allowing an unverified database target.

## Disposition

This is read-only configuration/deployment evidence. It supports that the
production secret was updated and the merged guard is deployed, but it does
not close R-041, PLAN-WEB-014/015, or the payment lifecycle gate. A separately
verified disposable Preview database, migrated schema, webhook target, and
provider Test Mode lifecycle are still required. No production, database,
migration, payment, provider, entitlement, account, or deployment write was
performed by this audit.
