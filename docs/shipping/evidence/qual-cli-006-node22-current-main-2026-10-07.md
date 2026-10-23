# QUAL-CLI-006 Node 22 current-main qualification — 2026-10-07

- **Scope:** Supporting runtime qualification for the exact CLI remote head;
  no source change and no backlog checkbox closure.
- **Code:** `verglos-cli` exact `origin/main` and worktree HEAD
  `7d060b2852551cc017bbb2b5f70bad22843e7273`.
- **Runtime:** Docker image
  `node:22-bookworm-slim@sha256:c3de60bf2f9dd0ac6370e6117950ff62d6e339527e7472301c9c78a017978392`,
  reporting Node `v22.23.3`; pnpm `9.15.9`.
- **Isolation:** Fresh container-local dependency install with platform-native
  Linux dependencies; the container used temporary `node_modules` and Turbo
  storage mounts and was removed after completion. No production, provider,
  database, deployment, payment, publication, or customer-state operation
  occurred.
- **Verification:** `CI=1 pnpm install --frozen-lockfile --prefer-offline`
  succeeded, followed by `pnpm test` (**12/12** Turbo tasks), `pnpm typecheck`
  (**13/13** tasks), and `pnpm build` (**8/8** tasks). All three commands
  exited `0`; no test failures or skips were reported by the task summary.
- **Disposition:** This removes the supported Node 22 runtime uncertainty for
  this current-source run. QUAL-CLI-006 remains open for official validator
  completeness, trusted Sigstore/publishing identity, legal/license review,
  independent acceptance, and final release approval. Backlog remains
  **218 checked / 62 unchecked / 280 total (77.9%)**.

