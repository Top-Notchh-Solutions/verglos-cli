# Razorpay production method preflight — 2026-10-07

## Read-only result

- Vercel Production environment values were pulled into a disposable local
  file through the linked project; no secret value was printed or retained.
- The selected `RAZORPAY_KEY_ID` had a live-key prefix.
- Razorpay Node SDK `payments.fetchPaymentMethods()` returned HTTP **401** with
  code `BAD_REQUEST_ERROR`.
- Only the redacted status/code were retained; no provider response body,
  account identifier, key, or payment identifier was recorded.

## Boundary and disposition

This was a read-only provider preflight. It created no order, payment, refund,
webhook, entitlement, database, deployment, or configuration mutation. The
production account-enabled method set remains unknown, so no value for
`RAZORPAY_ENABLED_PAYMENT_METHODS` may be guessed and no production hosted
checkout cutover may be promoted from this result. The deployment at
`8b843da` failed before build because that variable is absent.

A subsequent automatic Production deployment from Web main `2e86514` failed at
the same `pnpm config:check` stage with the same missing-variable message. This
confirms the blocker is current on the merged mainline, not limited to the
earlier deployment.

After Web PR #154 merged, the automatic Production deployment from exact main
`1498837` (`verglos-aqnwzuqu5-anuragyadav20062002s-projects.vercel.app`) again
failed before build at `pnpm config:check` with the same two runtime-config
errors. No production configuration or deployment promotion was attempted.
