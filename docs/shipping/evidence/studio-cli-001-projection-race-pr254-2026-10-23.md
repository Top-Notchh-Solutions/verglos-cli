# STUDIO-CLI-001 duplicate projection reservation race · 2026-10-23

## Implementation

- **Web source commit:** `c290c9f`
- **Pull request:** Web PR #254
- **Branch:** `codex/studio-cli-001-read-custody-binding-20261023` (preserved)
- **Contract change:** When two identical client-projection uploads race on
  the custody uniqueness constraint, the losing request now releases its
  already-reserved allowance instead of committing duplicate usage. If the
  compensating release cannot be confirmed, the route returns bounded
  service-unavailable rather than claiming idempotent success.
- **Regression:** The route test proves the race response is idempotent, the
  duplicate reservation is released, and no commit occurs for the losing
  request.

## Verification

- New race-path route regression: passed.
- Studio projection/workspace contracts: **21/21 passed**.
- Negative-boundary contracts: **8/8 passed**.
- Full Web test suite: **900 passed / 24 explicit skips / 0 failures**.
- Typecheck: passed.
- `git diff --check`: passed.
- GitGuardian Security Checks: passed.
- Vercel Preview Comments: passed.
- Continuation focused Studio/client-projection/usage suite: **27/27 passed**.
- Continuation `pnpm build`: passed; static generation completed **49/49**
  routes.

## Hosted boundary

Web Verify run `39899676684` and Private runner qualification run
`39899676731` failed before repository steps. GitHub API reports
`runner_id: 0` and an empty runner name for every failed job; no source,
typecheck, database, or repository step ran in those workflows. PR #254
remains open and unmerged pending the repository's hosted runner/account gate.

This is implementation evidence only. Keep `STUDIO-CLI-001` unchecked for
hosted/audit qualification, authorized independent recipient/customer
acceptance, and final release decision. No database migration, provider,
Production, customer, deployment, registry publication, tag, or release
action occurred. Nothing was deleted or overwritten. The live score remains
**244 checked / 36 open / 280 total (87.1%)**.
