# FINAL-WEB-008 hosted gate billing audit · 2026-10-23

- **Repository:** `anuragyadav-git/verglos-web`
- **Pull request:** #246, head `e4699b790137c5a6f2922a39e6fcb9bc1c910cc1`
- **Required runs:** Verify Web run `39833500399` and Private runner
  qualification run `39833500374`.
- **Authoritative API state:** repository Actions permissions are enabled with
  `allowed_actions: all`; the repository has `total_count: 0` self-hosted
  runners.
- **Job state:** all required jobs in both runs completed with `failure`,
  `runner_id: 0`, and an empty `runner_name`; no repository steps executed.
- **Boundary:** This confirms an account-level payment/spending-limit gate,
  not a workflow permission or source-code failure. No rerun, billing change,
  hosted bypass, deployment, provider action, or production mutation was
  performed. Nothing was deleted.
- **Next action:** account owner repairs the GitHub billing/spending limit;
  then rerun the required PR checks without changing the source commit.
- **Score:** **239 checked / 41 open / 280 total (85.4%)**. FINAL-WEB-008
  remains unchecked.
