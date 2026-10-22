# ENT-CLI-001 private-runner lifetime boundary · 2026-10-22

- **CLI implementation:** Commit `1965e3eb` adds a hard 30-minute maximum
  lifetime to shared private-runner job admission and rejects a signed job
  whose expiry exceeds that ceiling. PR [#166](https://github.com/Top-Notchh-Solutions/verglos-cli/pull/166)
  merged normally as `1d7844bd0fcfa4415e2c9462f9b5fb5293326915`; the source
  branch remains preserved.
- **Web implementation:** Commit `bafac8a` adds the same 30-minute maximum to
  the signed private-runner transport schema and regression coverage. PR
  [#237](https://github.com/anuragyadav-git/verglos-web/pull/237) merged
  normally as `baf59ca9b6cb12bffa44eca53bc4645fba92ced3`; the source branch
  remains preserved.
- **Verification:** CLI shared tests passed, CLI typecheck passed **14/14**,
  full CLI tests passed **13/13**, and CLI build passed **8/8**. Web focused
  transport tests passed **4/4**, Web typecheck passed, and the direct Web
  suite passed **895/919** with 24 expected skips and 0 failures. Merged-head
  verification against the two merge commits passed CLI **311/313** with 2
  skips, Web **951/981** with 30 skips, composed substrates **75/75**, and
  all **12/12** stories with zero failures.
- **Hosted status:** PR checks were queued or in progress at the merge/status
  read and are not claimed as passed here.
- **Boundary:** `env -u TEST_DATABASE_URL` was used for local verification.
  The remote value in `verglos-web/.env.test.local` was not used. No database,
  provider, customer, publication, deployment, legal, independent-review,
  browser-human, field-CWV, or final-release operation occurred. No file,
  branch, record, deployment, provider, customer, database, or release
  artifact was deleted or changed.
- **Disposition:** This advances the code-owned runner boundary only. Keep
  `ENT-CLI-001` unchecked for provider qualification, customer/recipient
  acceptance, independent review, and final release sign-off. Score remains
  **239 checked / 41 open / 280 total (85.4%)**.
- **Merged-head evidence:**
  `evidence/acceptance-stories-verification-2026-10-22-pr164-pr165-pr166-pr237.json`.

