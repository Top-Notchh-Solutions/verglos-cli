# PLAN-WEB-013 hosted Razorpay checkout code-side evidence

Date: 2026-10-07

## Scope and boundary

- Repository: `verglos-web`
- Branch: `feat/web-plan-013-hosted-checkout`
- Commit: `eb7e55a36ea3ecc51503c6f9f18a15158ebea323`
- Pull request: Web PR #149, open and mergeable at capture time
- Backlog scope: PLAN-WEB-013 implementation progress; PLAN-WEB-014 and PLAN-WEB-015 remain open
- No production database, provider, payment, deployment, migration, price, or entitlement write occurred.

## Implementation evidence

- Added catalog-gated Razorpay hosted order creation for the Pro plan and monthly/annual server-derived offer.
- Added provider-bound, private, read-only order status polling; it cannot grant entitlement.
- Added `order` checkout snapshots and webhook handling for `payment.captured` and order-scoped `payment.failed` events.
- Entitlement remains behind verified webhook signature, provider order binding, signed commercial snapshot, immutable payment identity, and the billing ledger.
- Added a partial unique index preventing two successful payment rows for one hosted order while allowing failed attempts.
- Hosted methods are declared by `RAZORPAY_ENABLED_PAYMENT_METHODS`; UPI, cards, netbanking, and wallets are exposed only when declared. QR is no longer the default and requires explicit `upi_qr` configuration.

## Verification

- Focused billing/webhook/route tests: 19 passed, 0 failed.
- Configured Web suite: 872 total, 850 passed, 22 explicit environment-gated skips, 0 failed.
- TypeScript: passed.
- Next production build: passed; 40 static pages generated and new order routes present.
- Drizzle schema check: passed.
- Migration ordering: 31 migrations verified.
- `git diff --check`: passed.
- Docker prerequisite: Docker Server 29.7.2, 2 containers, 18 images.
- Chrome DevTools prerequisite: Chrome 154.0.8037.98, loopback debugging endpoint reachable.
- Public diff scan found no credentials, payment secrets, database URLs, private fixtures, or customer data.
- Local execution used Node 26.4.0 while the package declares Node 22.x; Node 22 hosted verification remains required.

## Hosted and external state

- GitGuardian: passed.
- Web PR #149 `typecheck-and-schema`: queued at capture time.
- Vercel preview: pending at capture time.
- No Razorpay account capability configuration was read. No sandbox payment, refund, renewal, provider retry, replay, or out-of-order runtime evidence was obtained.
- The existing authenticated browser page showed the old live-looking QR flow; it was not scanned or paid and is not qualification evidence.
- R-041 remains open; no production access was used.

## Acceptance status

This is code-side implementation evidence, not acceptance of PLAN-WEB-013, PLAN-WEB-014, or PLAN-WEB-015. The payment gate remains open until every enabled Razorpay method is qualified in isolated test mode with private redacted lifecycle evidence and production/catalog reconciliation is separately reviewed.
