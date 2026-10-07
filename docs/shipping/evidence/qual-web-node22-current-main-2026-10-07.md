# Web current-main Node 22 qualification — 2026-10-07

- **Scope:** Supporting runtime and database-harness qualification; no source
  change and no backlog checkbox closure.
- **Code:** Exact Web `origin/main`
  `14988371cdae94d66d068b49d07cc31f0b26c5ea`.
- **Runtime:** Docker image
  `node:22-bookworm-slim@sha256:c3de60bf2f9dd0ac6370e6117950ff62d6e339527e7472301c9c78a017978392`,
  reporting Node `v22.23.3`; pnpm `10.34.5`.
- **Isolation:** Disposable PostgreSQL 15 image
  `sha256:2bf082886c059b4cf5af3f9e8d3a8916c35699062899061c13bc32d5921c631a`.
  The serial fixture suite ran first against the empty database; the explicit
  local bootstrap and migration checks ran afterward. The database and
  worktree were removed after completion.
- **Verification:** Locked install passed. `pnpm test:serial` passed the
  pretest **49/49** and main suite **879/880**, with **0 failures** and one
  explicit environment-gated skip. The reviewed empty-database bootstrap and
  all **37** migrations passed; `pnpm db:check`, migration ordering,
  negative-boundary **2/2**, truth registry **25/25**, and `pnpm typecheck`
  passed.
- **Disposition:** This is current-main Node 22 and disposable-database
  evidence only. No provider, payment, production database, deployment,
  credential, migration, or customer-state operation occurred. Production
  reconciliation, provider lifecycle, build/deploy acceptance, and the
  remaining product gates stay open. Backlog remains **218 checked / 62
  unchecked / 280 total (77.9%)**.

