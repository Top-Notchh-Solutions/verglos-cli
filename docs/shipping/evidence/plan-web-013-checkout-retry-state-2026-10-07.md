# PLAN-WEB-013 hosted Checkout retry-state hardening · 2026-10-07

- **Repository:** `verglos-web`, PR #149 `feat/web-plan-013-hosted-checkout`.
- **Code:** Exact pushed head `aa34127`.
  Hosted Checkout now registers the provider failure event, keeps a failed
  attempt retryable, clears the stale order so the offer/retry screen is
  restored, distinguishes a pre-confirmation dismissal from a submitted
  payment, and only moves to the submitted state after `checkout.open()`
  returns successfully.
- **Local verification:** Focused payment/checkout/webhook and route-contract
  tests passed **27/27**; typecheck, production build, and `git diff --check`
  passed. Node `v26.4.0` emitted the repository's existing Node 22 engine
  warning.
- **Hosted:** Vercel and Vercel Preview Comments passed for `aa34127`; GitHub
  Verify run `37637158955` was in progress at capture. This is hosted code and
  deployment evidence, not provider lifecycle or entitlement evidence.
- **Boundary:** No provider, payment, entitlement, database, migration,
  deployment, production, or credential mutation occurred. PLAN-WEB-013/014/
  015 remain open; no backlog checkbox changed.
