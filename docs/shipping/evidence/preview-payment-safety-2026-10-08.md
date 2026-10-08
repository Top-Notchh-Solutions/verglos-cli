# Preview payment safety correction — 2026-10-08

- **Initial Preview deployment:** `dpl_AWjxX2yEJb1bVDvc3ATeqiA8LkTC` built
  successfully, but Vercel protection required CLI-authenticated inspection.
  Its checkout payload had no approved method set and correctly rendered the
  fail-closed unavailable state.
- **Temporary configuration test:** The documented non-secret method set was
  briefly added to Preview and a new deployment rendered the methods, but its
  payload reported `testMode: false`. The Preview environment had live-key
  runtime metadata and the local Test Mode file contained no database URL, so
  this was not a safe Test Mode qualification surface.
- **Correction:** The Preview-only `RAZORPAY_ENABLED_PAYMENT_METHODS` variable
  was removed. The temporary live-key method deployment
  `dpl_pqXMozgRUUj9wrX8wvJTa6j7ww2w` was deleted. A fresh Preview deployment
  `dpl_CHmsR3ZVBsNDngm5D3z5Bb95h9tw` built successfully and renders the
  fail-closed checkout-unavailable state.
- **Required next setup:** Before Test Mode payment qualification, provide an
  isolated non-production database for Preview and configure the Razorpay Test
  key pair/webhook secret there. Do not reuse the production database or live
  Razorpay keys.
- **Boundary:** No payment, order, webhook, entitlement, database, provider,
  production, or customer-state write occurred. No backlog checkbox changed.
