# Razorpay method preflight — 2026-10-07

## Provider result

The official Razorpay Node SDK's `payments.fetchPaymentMethods()` lookup was
attempted with the repository's test-mode credentials from `.env.test.local`.
The provider returned HTTP **401**, `BAD_REQUEST_ERROR`, with description
`Authentication failed`. No secret, response payload, account identifier, or
payment identifier was retained. The lookup is read-only and created no
order, payment, refund, webhook, entitlement, or database mutation.

This leaves the account-enabled test method set **unknown**. It is not valid to
infer cards, UPI, netbanking, wallets, EMI, or any other method from provider
documentation or from the local method catalog. The earlier uncaptured test
order proves only the previously recorded order-creation result; it does not
resolve this method-account authentication gap.

## Implementation-side result

Against Web PR #149 exact head `db68157da039d8aab939818f9023f867028e4432`,
the baseline payment suite passed **27/28**, with one explicit environment-
gated ledger skip and zero failures when no global method override was set.
An explicit isolated catalog check exposed five hosted methods:
`upi`, `card`, `netbanking`, `wallet`, and `emi`. This confirms the intended
all-enabled-method configuration path and does not qualify those methods with
Razorpay.

PLAN-WEB-013/014/015 remain open pending valid test-account method evidence and
the complete provider lifecycle matrix. No production operation, deployment,
database write, or live-key fallback occurred.
