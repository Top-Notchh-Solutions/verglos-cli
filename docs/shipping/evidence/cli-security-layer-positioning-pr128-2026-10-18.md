# CLI security-layer positioning evidence — 2026-10-18

## Public implementation

- Repository: `Top-Notchh-Solutions/verglos-cli`
- PR: [#128](https://github.com/Top-Notchh-Solutions/verglos-cli/pull/128)
- Assignee: `anuragyadav-git`
- Public implementation commit: `8da4617d`
- Normal merge commit: `50bcab42eadfa8796d86d1f7a8aaee3010c65647`
- Verified `origin/main`: `50bcab42eadfa8796d86d1f7a8aaee3010c65647`
- Baseline reviewed for the slice: `fa77496b43d040fe8be977315078502e9e85b947`

The CLI now presents Verglos as the **local-first security decision layer
between code changes and release** in the Commander root help, package
metadata, root README, and package README. The text keeps source privacy,
explicit approved/trusted/bounded Hunt execution, and qualification gating
visible; it does not claim AppSec approval, hosted entitlement, customer
acceptance, or release readiness.

## Verification

In a clean disposable worktree based on public `origin/main`:

- `pnpm install --frozen-lockfile`: passed.
- `pnpm build`: passed, **8/8** workspace build tasks.
- `pnpm typecheck`: passed, **14/14** typecheck/build tasks.
- `pnpm --filter verglos test`: passed with exit code **0**; the existing
  A2 Docker qualification remains an explicit environment-gated skip.
- `node scripts/check-public-boundary.mjs`: passed.
- `git diff --check`: passed.

The first CLI test invocation was stopped by the repository's required
workspace build order (`@verglos/shared` and dependent package `dist` output
were not yet present). After the normal root `pnpm build`, the same command
passed; no source workaround was added.

Hosted PR run `39060504633` passed the self-scan, in-toto binding, all Ubuntu
and macOS matrix jobs, and Windows Node 22/24. Windows Node 20 was still in
progress in the Typecheck step when the normal merge completed; it is not
recorded as green here.

## Acceptance boundary

This is a real public implementation slice for cross-surface product
positioning. It does not check FINAL-WEB-004, whose complete command/docs
truth contract remains open, and it does not check any AppSec-held,
provider, customer, legal, hosted, field, release, or final-acceptance row.
The independent Hunt AppSec review remains last. Score remains **230 checked /
50 open / 280 total (82.1%)**.

## Public/private boundary

Only public-safe CLI source, package metadata, tests, and READMEs were changed
in the public PR. This private evidence packet contains no credentials,
customer source, private deployment data, or raw reviewer material.
