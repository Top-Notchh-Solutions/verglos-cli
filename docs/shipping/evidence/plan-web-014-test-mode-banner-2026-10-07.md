# PLAN-WEB-014 Test Mode pre-checkout label — 2026-10-07

## Scope

- Repository: `verglos-web`
- PR: **#155**, current head `6b0c4f980a779c7597067738d1dd379dc8a6d97c`
- Change: the server derives only a boolean Razorpay test/live mode from the
  configured key IDs; the client shows `Razorpay test mode — no real payment
  will be charged.` before opening hosted Checkout. Public/server key drift
  returns live/unknown rather than a misleading Test Mode label.
- No key material, provider identifiers, or payment data are serialized or
  recorded by the new helper.

## Verification

- Host focused payment/config suite: **33 passed / 1 existing environment
  skip / 0 failed**.
- Pinned Node 22 focused Razorpay/payment-method suite: **13 passed / 1
  existing environment skip / 0 failed**.
- Pinned Node 22 typecheck: passed.
- Preview build: compiled successfully and generated **43 pages**.
- Hosted Verify passed (`37659362013`), GitGuardian passed, Vercel Preview
  Comments passed, and mergeability was clean. PR #155 merged to Web main as
  `f00b7225ae0c0b8f518e404828aa6247c97dd322`.

## Boundary

This is code-side Test Mode disclosure evidence only. It does not qualify a
Razorpay method or payment lifecycle and does not authorize production
configuration. The merge triggered automatic production deployment
`dpl_Btjq8knubUab1ENgF7CEtzdUFV7G`, which failed closed in
`pnpm config:check` because production lacks
`RAZORPAY_ENABLED_PAYMENT_METHODS`; no promotion or production
configuration change was made. A read-only live check remained HTTP 200 but
still served the legacy QR-only checkout. No provider, payment, database,
migration, or customer-state write occurred. `PLAN-WEB-014/015` remain open.
