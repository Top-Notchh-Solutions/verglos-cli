# GitHub App identity contract evidence · 2026-10-06

## Scope

Web branch `feat/github-app-org-contract`, commits `afb48dc` and `a496608`, merged
to Web `main` as `1b2a623` through PR #144. This
batch implements the code-side substrate for GITHUB-WEB-001..003:

- immutable GitHub account, installation, and repository IDs;
- bounded multi-repository installation admission;
- least-privilege Checks/metadata permission validation;
- signed App JWT and bounded installation-token request helpers;
- token expiry/refresh validation;
- active/suspended/revoked lifecycle transitions;
- delivery-ID replay binding;
- tenant-scoped persistence and redacted webhook/check metadata.

## Local verification

- `pnpm typecheck` passed.
- Focused GitHub/SCM tests: 16 passed, 0 failed.
- `pnpm test`: 862 total, 840 passed, 22 explicit environment-gated skips, 0 failed.
- `pnpm db:check` passed.
- `pnpm db:migrations:check` verified 27 ordered PostgreSQL migrations.
- `pnpm build` passed before commit.
- `node scripts/check-public-boundary.mjs` passed.
- `pnpm licenses:test`, `pnpm sbom:check`, and negative-boundary checks passed before commit.
- `git diff --check` passed.
- Hosted `pnpm audit --audit-level=high` passed after the lockfile override was
  raised from `sharp >=0.35.4` to `sharp >=0.35.5` for CVE-2026-96889.

## Hosted state

PR #144 is pushed to `anuragyadav-git/verglos-web`. Vercel deployment, Vercel
Preview Comments, GitGuardian, and hosted type/schema all passed. Hosted run
`37486358263` completed in 2m48s; repository warnings were limited to the
existing GitHub Actions Node 20 and Ubuntu image migration annotations.

## Boundary

This is implementation and regression evidence only. No GitHub App was
installed or reauthorized, no provider token exchange or live permission
check was performed, no GitHub organization cutover was executed, no
production migration/deployment/database write occurred, and no customer or
release acceptance is claimed. GITHUB-WEB-001..004 remain unchecked.
