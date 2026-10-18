# TEAM-WEB-006 SCM provider transport boundary — 2026-10-18

## Scope

This packet records a public implementation slice for bounded GitHub/GitLab
provider transport. It is not live provider cutover, delivery completion,
customer acceptance, or independent AppSec evidence.

## Public source and deployment

- Repository: `anuragyadav-git/verglos-web`
- Pull request: #199
- Normal merge commit: `dd5f3883f1e06027a8c14c8b1afcd1742bd87a29`
- Merge parents: `27b6f73414e2df0499a268898474b774dc45a550` and
  `a259277146ff83d696f6e0cc8b151f5f1ab0dab4`
- Implementation commit: `a7fe6b7` (`fix(web): bound SCM provider delivery requests`)
- Regression-test commit: `a259277` (`test(web): cover bounded SCM provider transport`)
- Production deployment: Vercel reports `READY` for the merged `main` commit
  at `verglos-jsuhywoaf-anuragyadav20062002s-projects.vercel.app`.
- `origin/main` was verified at the normal merge commit.

The merge preserves the implementation and test commits; no squash, rebase,
force-push, empty, duplicate, or artificial commit was used.

## Implementation

`sendScmProviderRequest` now gives each provider request a bounded ten-second
timeout, relays caller cancellation, rejects redirects, sends only the
existing redacted request, cancels the response body without retaining it, and
returns only bounded status, request-ID, and retry-after metadata. The cron
route delegates transport to this boundary instead of calling `fetch` directly.

## Verification

Executed in the clean PR worktree:

- `pnpm install --frozen-lockfile` — passed.
- `pnpm exec tsc --noEmit` — passed.
- `node --import tsx --test src/lib/organizations/scm-check-providers.test.ts` — **7/7 passed**.
- `node --import tsx --test src/lib/organizations/scm-route-contract.test.ts src/lib/organizations/scm-delivery-runner.test.ts src/lib/organizations/scm-delivery-worker.test.ts` — **14/14 passed**.
- Protected PR checks, including Vercel and GitGuardian, passed before the
  normal merge.

The focused transport tests cover redirect refusal, body cancellation,
bounded retry-after/request-ID projection, timeout validation, and the route's
delegation contract.

## Acceptance mapping and remaining work

This advances the implementation and failure-boundary portion of
`TEAM-WEB-006`. The row remains unchecked for live provider delivery evidence,
operational cutover/reconciliation, and its complete acceptance contract.
`TEAM-CLI-001` and `TEAM-CLI-002` remain open upstream. Hunt/AppSec rows remain
on their separate hold and are not treated as a substitute for SCM evidence.

## Privacy boundary

No provider token, response body, webhook payload, customer source, secret,
private key, or browser cookie is included in this packet.

