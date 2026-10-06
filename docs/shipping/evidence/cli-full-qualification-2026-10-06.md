# CLI full qualification — 2026-10-06

- Source: pinned current CLI worktree at `955412516b96cc09393e78c43bf7d02b9abd05d9`.
- Command: `pnpm exec turbo run test typecheck build --force`.
- Result: **23/23 Turbo tasks successful; 0 failed**.
- Scope: all eight packages (`shared`, `attest`, `entitlement`, `hunt`, `mcp`,
  `reporter`, `scanner`, and the `verglos` CLI) across test, typecheck, and
  build tasks.
- Hunt Docker integration tests remain explicitly environment-gated. This run
  records their normal 16-test skip surface; the separate pinned Docker run
  records 55/56 pass with the macOS namespace limitation.
- The first attempt was rejected as an environment defect because the
  persistent worktree's package dependencies were absent. Dependencies were
  restored with `CI=1 pnpm install --offline --frozen-lockfile --force` in the
  disposable pinned worktree, then the exact command was rerun successfully.

This is current-source qualification evidence only. It does not close Hunt
recipe provenance, entitlement activation, provider lifecycle, customer
consent, independent review, or final release gates. No production state was
changed.
