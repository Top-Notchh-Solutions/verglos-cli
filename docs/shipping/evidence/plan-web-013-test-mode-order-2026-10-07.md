# PLAN-WEB-013 test-mode hosted order probe · 2026-10-07

## Result

The Razorpay test account credentials from the existing test environment were
validated without printing secrets. A bounded provider probe created exactly
one test-mode order using the canonical Pro monthly offer: **INR 280,943**,
30 entitlement days, and catalog version `2026-10-02.0`. A follow-up read of
the same provider order returned HTTP 200 and confirmed `status=created`, the
exact amount, and `INR` currency.

The order notes contained the complete signed checkout binding: checkout,
user, plan, cadence, currency, amount, entitlement duration, catalog version,
and checkout signature fields. The provider order identifier is not retained
here; only its digest prefix was observed privately. The test account's
read-only payment listing returned one observed `netbanking` payment; this is
observed history, not proof that every account method is enabled.

The focused Web billing/configuration suite passed **38/38** on Web PR #149
head `db68157da039d8aab939818f9023f867028e4432`, covering method catalog
fail-closed behavior, QR separation, catalog-gated order creation, webhook
signature/binding, capture/failure/refund/idempotency/replay semantics, and
runtime configuration.

## Boundary

This is test-mode order-creation and binding evidence only. No payment was
authorized or captured; no webhook or entitlement grant was generated; no
production database, provider configuration, deployment, migration, or
customer state was changed. Provider account-enabled-method discovery,
success/failure/refund/renewal/cancellation and out-of-order lifecycle
qualification remain open for PLAN-WEB-013/014/015.

Backlog at capture: **218 checked / 62 unchecked / 280 total (77.9%)**.

## Hosted display probe

Using the approved Chrome CDP session, two bounded test-mode orders opened the
Razorpay hosted Checkout UI successfully (`checkoutOpened=true`) and were
closed without submission. The provider UI rendered in a child execution
context, but no stable method labels were exposed to the bounded CDP text
projection; therefore this is checkout-open evidence only and not method-list
evidence. No card, UPI, netbanking, wallet, EMI, QR, payment, or capture was
claimed from this probe.

## Direct hosted-method observation

A later test-mode checkout target was attached through Chrome CDP's browser
target protocol and inspected without selecting a method. Its radio-label
projection returned these selectable hosted methods: `upi`, `card`,
`netbanking`, `wallet`, `emi`, and `pay later`. No QR radio was present in
that projection. This is direct test-account UI evidence of the methods
exposed by that checkout instance, not lifecycle qualification; no method was
selected and no payment was submitted.
