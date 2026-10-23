# PLAN-WEB-013 hosted method response contract — 2026-10-07

- **Repository:** `verglos-web`, PR #149
- **Commit:** `520d40a` (`fix(web): validate hosted payment methods`)
- **Implementation:** The checkout client now parses the server order response
  before opening Razorpay Checkout. It requires an INR order, bounded amount
  and duration, cadence/test-mode fields, and a non-empty unique hosted method
  list. QR, cardless EMI, bank transfer, and eMandate are rejected as
  non-hosted methods; UPI, cards, netbanking, wallets, EMI, and Pay Later are
  accepted when returned by the server catalog.
- **Verification:** Focused payment/route tests **16/16 pass**; Web
  typecheck and `git diff --check` pass. The full configured Web command also
  passes: pretest **42/48** with 6 environment-gated skips, followed by
  **850/872** with 22 environment-gated skips and 0 failures. Node `v26.4.0`
  emitted the existing workspace Node 22 engine warning.
- **Additional checks:** `pnpm db:check` passed with no migration drift;
  `pnpm build` compiled successfully and generated all 40 pages. The build
  emitted the existing Node 22 engine warning and multiple-lockfile workspace
  root warning; production runtime validation was skipped outside a production
  deployment.
- **Hosted PR result:** At exact head `520d40aa740bcf7dfb79cd7711a66d20555b7908`,
  Web `typecheck-and-schema`, Vercel, Vercel Preview Comments, and GitGuardian
  all passed. The PR remains open because provider lifecycle and production
  reconciliation are separate release gates.

This is code-side PLAN-WEB-013 progress only. It does not prove provider
account configuration, payment lifecycle, production reconciliation, or
PLAN-WEB-014/015 acceptance; no provider or production operation occurred.
