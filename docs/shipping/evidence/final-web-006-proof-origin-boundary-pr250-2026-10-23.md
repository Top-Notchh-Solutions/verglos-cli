# FINAL-WEB-006 · public proof origin boundary · 2026-10-23

- **Source:** Web PR #250, exact pushed head `cb7d0952253c5dbccae54fc956c85795d344737d`.
- **Implementation:** `src/lib/truth-registry/public-proof-assets.ts` now
  accepts proof links only from the approved public `github.com` and
  `verglos.com` origins, while retaining HTTPS, credential, and query-string
  rejection. A hostile lookalike host is covered by regression test.
- **Verification:** proof/page tests **5/5**, public-release smoke **8/8**,
  executable smoke **18 routes / 32 claims / 2 proof assets / 0 issues**,
  typecheck, production build **49/49 routes**, serial Web **897 passed / 24
  explicit skips / 0 failed**, and `git diff --check` passed. Local Node
  26.4.0 emitted only the expected package Node 22.x engine warning.
- **Hosted boundary:** Verify run `39852377777` and private runner run
  `39852377869` failed before repository steps; every job reported runner id
  `0` and zero steps. PR #250 remains open. No rerun, bypass, merge-around,
  deployment, provider, database, customer, legal, Production, publication,
  or release-sign-off action occurred.
- **Disposition:** This is code-side FINAL-WEB-006 progress. Keep the row
  unchecked for the acceptance bundle, ACCEPT-003/009 dependencies, and final
  acceptance. No files were deleted. Score remains **239 checked / 41 open /
  280 total (85.4%)**.
