# FINAL-WEB-008 emitted metadata validation · 2026-10-23

- **Repository:** `verglos-web`
- **Source commit:** `e4699b790137c5a6f2922a39e6fcb9bc1c910cc1`
- **Pull request:** https://github.com/anuragyadav-git/verglos-web/pull/246
- **Branch:** `codex/final-public-surface-smoke-20261023`
- **Implementation:** `scripts/public-release-smoke.ts` now executes the
  actual Next `sitemap()` and `robots()` metadata functions. It requires the
  exact eight indexable public sitemap URLs, rejects unexpected/private URLs,
  and requires the six private-route exclusions plus the canonical sitemap
  URL. Regression tests cover both passing and fail-closed boundaries.
- **Focused tests:** `scripts/public-release-smoke.test.ts` **8/8**.
- **Public smoke:** **18 routes / 22 claims / 2 proof assets / 0 issues**.
- **Typecheck:** passed.
- **Build:** passed; **49/49** routes generated.
- **Hosted state:** PR #246 Web hosted checks failed before runner steps under
  the GitHub account payments/spending-limit condition; GitGuardian passed and
  Vercel was pending at capture. No rerun or bypass was used.
- **Boundary:** This is code-side progress only. FINAL-WEB-008 remains
  unchecked for ACCEPT-003/009/010, founder truth-freeze, required hosted
  checks, and final acceptance. No deployment, provider, customer, database,
  publication, or release-sign-off state changed. Nothing was deleted.
- **Score:** **239 checked / 41 open / 280 total (85.4%)**.
