# PLAN-WEB-014 · provider Cardless EMI binding · 2026-10-10

## Scope

This batch addresses one concrete Gate 4 implementation gap in the hosted
order webhook path. The Razorpay Test Mode account's read-only payment
inventory contained a captured `cardless_emi` payment attached to a paid
order whose signed checkout notes bound the canonical hosted `emi` method.
The Web handler previously compared the provider value literally and would
reject that captured payment as method-mismatched.

`cardless_emi` is not added as a new checkout method. The checkout remains
bound to canonical `emi`; only this observed provider representation is
canonicalized during signed order-payment binding.

## Implementation

- Web branch: `fix/razorpay-emi-provider-binding`
- Commit: `210d880`
- PR: Web #172
- Added `isRazorpayPaymentMethodBound` with the single safe mapping
  `cardless_emi -> emi`.
- Unbound methods, including `upi_qr`, remain rejected.

## Verification

- Provider observation: 32 Test Mode payment rows were read without mutation;
  one captured `cardless_emi` order payment matched the canonical monthly
  amount/currency and an order snapshot containing `emi`.
- Focused payment-method/webhook tests: **25/25 passed**.
- Full Web serial suite: **900 total / 876 passed / 24 explicit skips / 0
  failures**.
- Typecheck: passed.
- Production build: passed; 47 routes generated.
- Hosted Vercel preview check: passed.
- GitGuardian: passed.
- Hosted `typecheck-and-schema` could not start because the GitHub runner hit
  Docker Hub's unauthenticated `postgres:15-alpine` pull-rate limit during
  service-container initialization; no repository test ran in that job. The
  failed job was rerun once and hit the same external limit.

## Boundary and disposition

No database, payment, entitlement, account, customer, provider, or Production
state write occurred. This repair is not a complete Gate 4 pass and does not
close `PLAN-WEB-011`, `PLAN-WEB-012`, `PLAN-WEB-014`, or `PLAN-WEB-015`.
The backlog remains **219 checked / 61 unchecked / 280 total (78.2%)**.

