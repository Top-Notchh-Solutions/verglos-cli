# GitHub App server-side exchange qualification — 2026-10-07

## Implementation

Web PR #154 exact head `096de93087d886d55432fe23484ca9937d1f8347` changes the
GitHub installation route so the browser submits only an installation ID and
bounded repository/project selections. The server now signs a short-lived App
JWT from `VERGLOS_GITHUB_APP_ID` and
`VERGLOS_GITHUB_APP_PRIVATE_KEY`, exchanges it with GitHub, derives account,
least-privilege permissions, and repository identities from provider responses,
and encrypts the returned installation token with its expiry. GitHub delivery
refreshes expired or unknown-expiry tokens through the same exchange and
persists the encrypted replacement. GitLab keeps its existing provider-token
path.

## Verification

- Focused SCM/GitHub tests: **24/24**.
- Full Web test command: **846 passed / 22 environment-gated skips / 0 failed**.
- Typecheck, `pnpm db:check`, 29-migration ordering, negative-boundary **2/2**,
  production build **38/38 pages**, and `git diff --check`: pass.
- Hosted Verify run **37643258692**: success.
- Vercel Preview Comments: success.

## Limits and disposition

This is implementation and local/hosted CI evidence. No GitHub App credential,
authorized organization installation, live webhook delivery, provider token
refresh against GitHub, deployment cutover, or independent review was performed.
TEAM-WEB-006, GITHUB-WEB-001..004, and the related hosted/acceptance gates remain
open. No checkbox changed; the authoritative count remains **218 checked / 62
unchecked / 280 total (77.9%)**.

No production, provider, payment, database, migration, deployment, credential,
customer-state, or browser-state write occurred.
