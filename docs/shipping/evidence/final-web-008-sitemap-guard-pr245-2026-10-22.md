# FINAL-WEB-008 private sitemap-route guard · 2026-10-22

## Scope

This packet records a code-side release-smoke improvement on the Web branch
for the public sitemap/private-route boundary. It does not claim a merged
release, hosted qualification, customer acceptance, legal approval, provider
action, field performance, independent review, or final sign-off.

## Source and implementation

- Web branch: `codex/public-sitemap-private-route-guard-20261022`.
- Source commits: `caecce539d3e18704af86f73b40730a1ad1076fb` and latest
  `d9519e32bfbadb98ca4c06158de83f0b7bdf2450`.
- Pull request: Web PR #245,
  `https://github.com/anuragyadav-git/verglos-web/pull/245`.
- `scripts/public-release-smoke.ts` now rejects private-route tokens in
  `src/app/sitemap.ts` for `/account`, `/checkout`, `/login`, `/activate`,
  `/cli-auth`, `/handoff`, and `/reports`, and requires all eight intended
  indexable sitemap entries.
- `scripts/public-release-smoke.test.ts` proves that adding `/reports` to a
  temporary sitemap source copy fails the audit and that removing
  `/docs/hunt` fails the audit.

## Local verification

- `node --import tsx --test scripts/public-release-smoke.test.ts`: **9/9**.
- `pnpm public:release-smoke`: **18 routes / 22 claims / 2 proof assets /
  0 issues**.
- `pnpm typecheck`: passed.
- `git diff --check`: passed.

## Hosted boundary

PR #245 was not merged. Hosted Verify matrix run `39828119421` and
type/schema run `39828119618` did not execute repository steps: GitHub
annotations report that the jobs were not started because recent account
payments failed or the spending limit must be increased. Every job had
`runner_id: 0`, an empty runner name, and zero steps. The earlier runs
`39827008774` and `39827008777` were blocked by the same condition. Vercel
deployment `CmmH1SuX9v6HjwbfRugnyjmQ9WXQ`, Vercel Preview Comments, and
GitGuardian completed successfully.

The failed hosted jobs are an account-billing gate, not a code/test failure.
Do not merge or bypass the hosted checks. After the owner repairs GitHub
Actions billing/spending-limit state, rerun PR #245 once and reassess.

No secrets, customer data, provider, Production, database, migration,
publication, deployment mutation, or release-sign-off operation occurred.
No file, branch, deployment, or record was deleted. `FINAL-WEB-008` remains
unchecked and the score remains **239 checked / 41 open / 280 total (85.4%)**.
