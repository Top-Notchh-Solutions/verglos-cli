# PLAN-WEB-014 — isolated Preview recurring-card boundary — 2026-10-10

## Scope

This is a private evidence record for the isolated Preview Test Mode run. It
does not authorize or describe a Production payment, Production database
write, Production entitlement grant, or live customer-data change.

## Configuration and deployment

- Preview deployment: `verglos-ksih4qu84-anuragyadav20062002s-projects.vercel.app`
- Deployment ID: `dpl_6RRRpPktiXQEW2i2wi1SWuyGBsWn`
- Build: READY; 47-page Next.js build passed.
- The Preview fixture secret was rotated and used only in the protected
  Preview browser/API session. The secret value is intentionally not stored
  here.
- Razorpay was in Test Mode. A second enabled webhook target was created for
  this exact Preview deployment, preserving the existing provider targets.
- The new target selected the 20 lifecycle events already handled by the
  application: payment authorized/failed/captured, order paid, invoice paid/
  partially paid/expired, subscription authenticated/paused/resumed/activated/
  pending/halted/charged/cancelled/completed/updated, and refund processed/
  failed/created.
- Preview checkout rendered the canonical monthly amount ₹2,809.43 and the
  application-side enabled method set was Cards-only. The hosted recurring
  provider frame still displayed provider-controlled UPI and eMandate choices;
  no non-card method was selected or claimed as qualified.

## Bounded writes and result

1. The authenticated Preview route created one canonical monthly subscription
   and returned HTTP 200 with `testMode: true` and a provider subscription ID.
2. A second isolated subscription was created only to retry the provider's
   recurring-card authorization with Razorpay's official subscription test
   card fixture. The official fixture instructions allow a random future
   expiry/CVV and a 4–10 digit success OTP.
3. The hosted frame reached the card tokenization/mandate step. The provider
   did not authorize either attempt: both provider subscriptions remained
   `created`, their invoice state was `issued`, and no captured payment or
   license grant was observed.
4. Both Test Mode subscriptions were explicitly cancelled through the
   provider API. The owner-bound Preview status route reconciled both rows as
   HTTP 202 `processing` with subscription status `cancelled`; no entitlement
   was granted.

## Acceptance impact

This advances the provider-boundary evidence and confirms that the current
Preview route, canonical pricing binding, protected webhook target, provider
status read, cancellation reconciliation, and fail-closed entitlement path
are reachable. It does **not** close PLAN-WEB-014 or PLAN-WEB-015. The missing
evidence is a provider-authorized recurring card charge followed by signed
webhook reconciliation to captured payment, active subscription, and license
binding, plus the remaining renewal/failure/expiry/refund/replay/out-of-order
and exactly-once cases.

## Reproduction boundary

Razorpay's official Test Mode documentation states that test keys produce
simulated payments, publishes the domestic and subscription card fixtures,
and requires webhook/status verification. The exact recurring authorization
still failed at the provider's card-tokenization/mandate step in this account.
This is recorded as an external provider fixture boundary, not converted into
a checked backlog item.

