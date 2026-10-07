# PLAN-WEB-013 hosted method binding · 2026-10-07

- **Source:** Web PR #149 commits `67fb7e2` and `3f4a7aa`.
- **Implementation:** New hosted orders bind the server-selected hosted
  payment-method set into the HMAC-signed Razorpay checkout notes. Webhook
  snapshot parsing validates that the set is non-empty, unique, hosted-only,
  and bounded before accepting the signed snapshot; captured and failed
  provider payments for new orders must also report a method in that set.
- **Compatibility:** QR and subscription snapshots retain their existing
  canonical signature shape; legacy order notes without the new optional field
  remain readable. New order creation always supplies the explicit hosted set.
- **Verification:** Focused checkout/webhook/payload tests pass **15/15**;
  Web typecheck, production build (40 pages), `pnpm db:check`, and
  `git diff --check` pass. Existing Node 22 engine and multiple-lockfile
  warnings remain environmental only.
- **Limitation:** This is code-side binding evidence only. PLAN-WEB-013,
  PLAN-WEB-014, and PLAN-WEB-015 remain open pending provider lifecycle,
  all-enabled-method, deployment, and reconciliation evidence.
- **Boundary:** No browser, provider, payment, production, database,
  migration, deployment, or credential operation occurred.
