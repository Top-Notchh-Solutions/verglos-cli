# Current Production fail-closed audit — 2026-10-09

## Scope

This is a metadata-only Production audit after the current Web branch was
deployed. It verifies deployment identity, public route boundaries, and the
presence/absence of selected environment-variable names without reading or
printing any environment values.

## Observed state

- Vercel Production latest deployment: `dpl_CvNvt9YEQLMhnEB8htL7eiCocbmG`.
- Deployment state: `READY`; target: `production`.
- Vercel deployment metadata identifies source commit `6f932d4` on
  `feat/preview-test-auth`.
- The Production environment-variable name listing includes the normal
  provider key/webhook, amount, method-catalog, database, and signing-key
  names. Values were not read.
- No Production variable named
  `RAZORPAY_PRO_MONTHLY_PLAN_ID`, `RAZORPAY_PRO_ANNUAL_PLAN_ID`, or
  `RAZORPAY_SUBSCRIPTION_TOTAL_COUNT` was listed. This supports the
  recurring-subscription fail-closed boundary; it is not provider-dashboard
  or payment-lifecycle evidence.

## Read-only smoke

- `GET https://verglos.com/` — HTTP 200.
- `GET https://verglos.com/checkout` — HTTP 200 with private no-store cache
  policy.
- `GET https://verglos.com/docs` — HTTP 200.
- `GET /api/razorpay/create-subscription` — HTTP 405.
- Public HTML for `/`, `/checkout`, and `/docs` contained no provider-key,
  Test-Mode, session-token, or database-URL marker.

## Boundary and disposition

Only read-only Vercel metadata and unauthenticated HTTP requests were used.
No environment value was revealed or changed. No Production plan ID was
added, no provider/payment request was made, and no Production database,
migration, entitlement, account, or customer-data write occurred.

This confirms the current fail-closed Production code-rollout stage. It does
not close Gate 4, Production billing/database activation, reconciliation,
monitoring, rollback/restore, or the external reviewer/legal/final-acceptance
gates. The score remains **219 checked / 61 unchecked / 280 total (78.2%)**.
