# PLAN-WEB-014 provider tokenization feature boundary

Date: 2026-10-10
Status: provider unblock evidence; no acceptance claim

## Observed account state

- The authenticated Razorpay Test Mode Subscriptions page showed the existing
  Pro monthly subscription inventory and no supported immediate charge, renewal,
  delivery replay, or out-of-order control.
- Subscription payment settings showed ordinary Card support. The current
  hosted recurring attempts still stopped at the card-tokenization/OTP boundary;
  an ordinary captured one-off Card payment does not prove recurring mandate
  authorization.
- No provider setting, subscription, payment, webhook, or application row was
  changed during this inspection.

## Authoritative provider requirement

Razorpay's official saved-card documentation states that card tokenization is
an on-demand feature, requires a Support request for account activation, and
may take several working days to enable. Source:
https://razorpay.com/docs/payments/payment-methods/cards/features/saved-cards/

This explains why ordinary Test Mode Cards can capture while the recurring
subscription flow still cannot produce the required tokenization/mandate
authorization artifact.

## Disposition

`PLAN-WEB-014` and Gate 4 remain open. The required unblock is either:

1. the account owner obtains the provider-supported tokenization/recurring-card
   Test Mode enablement and fixture procedure, then produces signed webhook and
   payment-to-ledger-to-license reconciliation; or
2. Razorpay provides a supported Test Mode renewal/delivery control that yields
   the same evidence.

Codex must not guess OTPs, call undocumented provider endpoints, synthesize
   webhook events, edit isolated rows, or treat one-off Card capture as
   recurring acceptance. Review owner remains the Verglos release owner with
   the Razorpay Test Mode account owner; review date: 2026-10-17 IST.

Score remains **223 checked / 57 unchecked / 280 total (79.6%)**.
