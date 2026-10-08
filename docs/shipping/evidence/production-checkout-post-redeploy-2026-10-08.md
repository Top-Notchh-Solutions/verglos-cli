# Production checkout post-redeploy smoke — 2026-10-08

- **Target:** `https://verglos.com/checkout`
- **Observed at:** `2026-10-08T07:15:21Z`
- **Deployment evidence:** Production deployment `dpl_EGSLPvvtccxcfK9BbPfmJzwEXY5Y` completed with `pnpm config:check` and the Next.js build passing, then aliased to `https://verglos.com`. The route returned HTTP `200` and rendered the hosted-checkout implementation from Web main `f00b722`, including the server-projected method list.
- **Chrome DevTools:** The connected debug session rendered the Pro monthly INR catalog `₹2,809.43`, hosted methods `UPI · Cards · Netbanking · Wallets · EMI · Pay Later`, and the `Continue to secure payment` action.
- **Network:** `/checkout` returned `200`; Razorpay checkout script and hosted assets loaded successfully. No order-creation request, payment, webhook, entitlement grant, or database write was made.
- **Console:** No warning or error messages were present in the captured page console.
- **Mode boundary:** The initial production page did not display the test-mode banner. This is consistent with a production live-key runtime and means this route must not be used for Test Mode payment qualification. Test-mode lifecycle work remains isolated to Preview/staging.
- **Disposition:** This is production deployment and rendered-surface smoke evidence only. It does not close `PLAN-WEB-011`, `PLAN-WEB-012`, `PLAN-WEB-013`, `PLAN-WEB-014`, `PLAN-WEB-015`, or R-041. No checkbox changed.
- **Safety:** No payment was submitted, no QR was scanned, no production price was changed, no provider configuration was mutated, and no secret or payment identifier was retained.
