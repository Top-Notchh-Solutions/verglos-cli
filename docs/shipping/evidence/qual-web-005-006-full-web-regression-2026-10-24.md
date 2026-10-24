# QUAL-WEB-005/006 full Web regression — 2026-10-24

- **Source:** Web worktree commit `7307ae5e0cea18e6d0803aa179fafcc2a0ce36f8`
  (the checked-out source is an ancestor of the Web `origin/main` head).
- **Command:** `node --import tsx --test --test-concurrency=1` from the Web
  worktree. With no file arguments, Node executed the repository’s complete
  test discovery set.
- **Result:** **1,195** tests discovered; **1,155 passed**, **40 explicitly
  skipped**, **0 failed**, **0 cancelled**, and **0 todo**. The run completed
  in **18.6 seconds**.
- **Coverage boundary:** The run includes the privacy/deletion route,
  deletion worker/hold/inventory/store contracts, customer-held digest
  contracts, dashboard and public release contracts, and the broader Web
  implementation suite. Skips remain explicit for unavailable disposable
  database/provider-dependent integration cases.
- **Disposition:** Local regression evidence only. No Production deletion,
  customer data access, provider action, database mutation, human/field
  acceptance, independent review, or final release sign-off occurred. Keep
  QUAL-WEB-005 and QUAL-WEB-006 unchecked; no backlog checkbox changed.
