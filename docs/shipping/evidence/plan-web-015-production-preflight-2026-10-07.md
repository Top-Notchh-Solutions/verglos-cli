# PLAN-WEB-015 production preflight — 2026-10-07

## Read-only observations

- Vercel project: `anuragyadav20062002s-projects/verglos-web`.
- Latest attempted production deployment: commit `1498837`, deployment
  `dpl_H2eqnEqCY96yAAPphch9S2dvUKeK`, status **Error**.
- Vercel build logs show the failure occurred before the Next build in
  `pnpm config:check`:
  `RAZORPAY_ENABLED_PAYMENT_METHODS is required` and
  `RAZORPAY_ENABLED_PAYMENT_METHODS is required in production`.
- Production environment-name inventory does not contain
  `RAZORPAY_ENABLED_PAYMENT_METHODS`.
- The live `/checkout` response still contains the legacy `Show UPI QR code`
  surface and `upi_qr`; it does not contain the current hosted-order CTA.

## Disposition

`PLAN-WEB-015` remains open. The current main hosted-order implementation is
not live, and the account-enabled production method set cannot be inferred
from the missing variable or from the old QR page. Do not guess a method list,
change production pricing, or deploy a configuration based on the Test Mode
observation.

The production database credential was exposed earlier and is treated as
compromised under `R-041`; no further production database read was performed
in this batch. Required next operation is credential rotation, Vercel secret
refresh/redeploy, old-credential revocation, and bounded read-only verification
with the operation-specific backup/restore/reconciliation preflight.

No provider, database, deployment, environment-variable, payment, or customer
state write occurred. No backlog checkbox changed.
