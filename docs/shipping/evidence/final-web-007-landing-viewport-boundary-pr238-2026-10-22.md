# FINAL-WEB-007 landing viewport boundary · 2026-10-22

- **Defect found:** Hosted Web PR #237 exposed that the landing qualifier sent
  desktop and mobile measurements for the same path through the generic
  dashboard duplicate-path guard, causing the complete six-path capture
  contract to fail even though the two viewports are valid distinct evidence.
- **Implementation:** Web commit `5a22c46` qualifies each landing measurement
  independently while retaining landing-specific duplicate path/viewport and
  required-coverage checks. PR [#238](https://github.com/anuragyadav-git/verglos-web/pull/238)
  merged normally as `67f8f89be193dff7053d0abd946b288301bf2b87`; the source
  branch remains preserved.
- **Verification:** Landing release qualification passed **4/4**, Web
  typecheck passed, direct Web tests passed **895/919** with 24 expected skips
  and 0 failures. Merged-head verification at Web merge `67f8f89b…` passed
  CLI **311/313** with 2 skips, Web **951/981** with 30 skips, composed
  substrates **75/75**, and all **12/12** stories with zero failures.
- **Hosted status:** PR #238 checks were queued or in progress at the final
  status read and are not claimed as passed here.
- **Boundary:** `env -u TEST_DATABASE_URL` was used. No database, provider,
  customer, publication, deployment, browser-human, field-CWV, legal,
  independent-review, or final-release operation occurred. No file, branch,
  record, deployment, provider, customer, database, or release artifact was
  deleted or changed.
- **Disposition:** This advances the source qualification contract only. Keep
  `FINAL-WEB-007` unchecked for browser-produced six-path capture, human
  screen-reader evidence, supported-environment/field-CWV evidence, and final
  acceptance. Score remains **239 checked / 41 open / 280 total (85.4%)**.
- **Merged-head evidence:**
  `evidence/acceptance-stories-verification-2026-10-22-pr164-pr165-pr166-pr237-pr238.json`.

