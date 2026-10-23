# Razorpay payment-method catalog contract evidence · 2026-10-06

## Scope

Web PR #145, branch `feat/razorpay-payment-method-catalog`, commit `3ce60b8`,
merged to Web `main` as `d6ce773`. This is code-side PLAN-WEB-013 progress.

- Adds a server-side parser for `RAZORPAY_ENABLED_PAYMENT_METHODS`.
- Preserves the existing UPI QR path when the optional variable is unset.
- Advertises only methods with both provider declaration and an implemented
  checkout adapter.
- Hides cards, netbanking, and wallets until their adapters are implemented;
  malformed, duplicate, empty, or unknown declarations fail closed.
- Binds checkout method selection to the QR route and keeps provider errors
  redacted.

## Verification

- Focused payment-method/runtime/route tests: 25 passed, 0 failed.
- Full Web suite: 863 total, 841 passed, 22 explicit environment-gated skips,
  0 failed.
- `pnpm typecheck`, `pnpm build`, Drizzle check, and 27-migration ordering passed.
- Public-boundary, dependency audit, CycloneDX SBOM, license inventory tests,
  negative-boundary, and diff checks passed in hosted run `37487362873`.
- Vercel, Preview Comments, GitGuardian, and hosted type/schema all passed.

## Boundary

No Razorpay account configuration was read or changed, no payment method was
enabled, no checkout/payment/refund/renewal/replay test was run against the
provider, and no production billing action or deployment occurred. PLAN-WEB-014
and PLAN-WEB-015 remain open.
