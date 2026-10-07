# PLAN-WEB-013 hosted Checkout retry-state hardening · 2026-10-07

- **Repository:** `verglos-web`, PR #149 `feat/web-plan-013-hosted-checkout`.
- **Code:** Exact pushed head `b78f732424a388f03a9a9740e570b0f01d7297e7`.
  Hosted Checkout now registers the provider failure event, keeps a failed
  attempt retryable, distinguishes a pre-confirmation dismissal from a
  submitted payment, and only moves to the submitted state after
  `checkout.open()` returns successfully.
- **Local verification:** Focused payment/checkout/webhook and route-contract
  tests passed **23/23**; typecheck, production build, and `git diff --check`
  passed. Node `v26.4.0` emitted the repository's existing Node 22 engine
  warning.
- **Hosted state at capture:** The branch push succeeded. Vercel was pending;
  the new exact-head Verify run had not appeared yet. Earlier hosted evidence
  at the parent head does not qualify this new commit.
- **Boundary:** No provider, payment, entitlement, database, migration,
  deployment, production, or credential mutation occurred. PLAN-WEB-013/014/
  015 remain open; no backlog checkbox changed.
