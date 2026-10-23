# PLAN-WEB-012 · Final V1 lifecycle reconciliation — 2026-10-11

## Contract decision

The old open wording treated automatic recurring subscription renewal as a
customer-facing requirement. The Final V1 contract now defines paid access as
one-time Cards-only prepaid fixed-term billing with customer-initiated manual
renewal. Existing subscription code remains a compatibility boundary only; it
is not an advertised V1 purchase or renewal path.

## Accepted lifecycle evidence

The current Final V1 lifecycle record
`plan-web-014-preview-prepaid-cards-lifecycle-2026-10-11.md` proves, in
isolated Preview/Test Mode:

- canonical server-owned card capture with signed provider delivery;
- failed hosted-order rows with no license or entitlement grant;
- signed full and partial refund delivery with monotonic refund watermarks;
- a second customer-initiated one-time order that starts at the prior paid
  term boundary;
- payment→ledger→license reconciliation without duplicate grants; and
- no Production payment, database, entitlement, account, or customer-data
  write.

The fresh disposable Docker PostgreSQL integration passed **6/6** with zero
failures or skips. The focused payment suite passed **29/29**, with one
explicit environment-gated skip and zero failures. Those tests cover replay,
out-of-order identity handling, retry, expiry projection, refund monotonicity,
and exactly-once behavior. Existing isolated signed subscription cancellation/
replay evidence remains a compatibility-boundary check, not a recurring V1
promise.

## Acceptance decision

`PLAN-WEB-012` is accepted under the Final V1 prepaid/manual-renewal contract.
Automatic provider renewal/charge evidence is intentionally not required for
V1 and must not be represented as a shipped customer capability. Production
Cards-only contract evidence is tracked separately by PLAN-WEB-015.

No secret, database URL, raw provider payload, payment identifier, card data,
OTP, or customer identity is retained here.
