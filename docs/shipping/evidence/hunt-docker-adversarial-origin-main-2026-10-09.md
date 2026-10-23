# HUNT-011 pinned Docker adversarial requalification — 2026-10-09

## Scope

- Repository: `verglos-cli`
- Exact source: `origin/main` / `8bea4be2fa18533eafd088122be769e942965626`
- Host: macOS arm64
- Node: `v26.4.0`
- Docker image: `postgres:15-alpine`
- Image digest: `sha256:2bf082886c059b4cf5af3f9e8d3a8916c35699062899061c13bc32d5921c631a`
- Command: `pnpm --filter @verglos/hunt test`
- Evidence wrapper: `node scripts/hunt-adversarial-evidence.mjs .artifacts/hunt-adversarial-20261009`

## Result

The locked workspace was installed with `pnpm install --frozen-lockfile` in an
isolated detached worktree. The pinned adversarial suite then completed with:

- pass: **60**
- skipped: **1**
- failed: **0**
- exit code: **0**

The single skip is the documented macOS namespace limitation. The run used the
repository's pinned image and digest and did not contact a provider or modify
production state.

## Boundary and remaining gate

This is current-head local Docker qualification only. It is not independent
security review, trusted recipe provenance, production activation, customer
authorization, or final Hunt acceptance. `HUNT-011`, `QUAL-CLI-004`, and the
dependent Hunt rows remain unchecked until their complete external gates exist.

No production, database, migration, payment, provider, deployment, registry,
signing, customer, or release write occurred. The initial dependency-missing
attempt (`tsc: command not found`) was an environment setup failure and is not
included in the result above.
