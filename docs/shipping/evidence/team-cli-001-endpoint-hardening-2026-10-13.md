# TEAM-CLI-001 endpoint hardening — 2026-10-13

## Implementation

Public CLI PR #95 merged as
`d989b88a1855adc3bf54c6f2856c5b90ddca41f2` from source commit
`bb0bd755`. The organization-policy client now accepts only bounded relative
policy paths for caller-supplied endpoints. Absolute external origins,
protocol-relative paths, backslashes, query/fragment-bearing paths, control
characters, and oversized values fail closed before a request is attempted.

## Verification

- `pnpm build`: 8/8 package builds passed.
- `pnpm --filter verglos test`: complete CLI process suite exited 0.
- Regression case: an external endpoint returned
  `unsafe-policy-endpoint`, made zero fetch calls, and attached no credential.
- Protected PR checks: in-toto binding passed; the required cross-platform
  matrix was configured for macOS/Ubuntu/Windows with Node 20/22/24.
- Public-boundary check: the PR contained only the two CLI source/test files;
  no private shipping docs, evidence, environment files, or credentials.

## Acceptance boundary

This closes a code-side transport-hardening gap only. `TEAM-CLI-001` remains
unchecked pending the hosted organization-policy signer/trust root, mapped
paid/non-production tenant, authorized repository installation and binding,
published policy row, and live signed fetch/cache/offline/cross-tenant
evidence. No production, database, provider, entitlement, repository, or
customer write occurred.

## Score

**228 checked / 52 unchecked / 280 total (81.4%)**. No checkbox changed.
