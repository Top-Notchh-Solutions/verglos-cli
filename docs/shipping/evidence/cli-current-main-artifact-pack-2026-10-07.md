# CLI current-main public artifact pack preflight — 2026-10-07

## Scope

- Repository: `verglos-cli`
- Exact remote head: `7d060b2852551cc017bbb2b5f70bad22843e7273`
- Runtime: Node `26.4.0`, pnpm `9.15.9`
- Disposable worktree only; the founder checkout was not modified.

## Results

The documented cross-platform license-evidence setup was applied only in the
disposable worktree by adding `pnpm.supportedArchitectures` for the workflow's
declared OS/CPU set. `pnpm install --frozen-lockfile` then materialized the
complete 254-package lockfile graph. The exact-head build passed **8/8** and
`node scripts/pack-public-packages.mjs` passed, producing all six expected
public archives:

- `verglos-2.0.0-alpha.1.tgz`
- `verglos-entitlement-2.0.0-alpha.1.tgz`
- `verglos-mcp-2.0.0-alpha.1.tgz`
- `verglos-reporter-2.0.0-alpha.1.tgz`
- `verglos-scanner-2.0.0-alpha.1.tgz`
- `verglos-shared-2.0.0-alpha.1.tgz`

The official verifier then ran in a disposable `python:3.12-slim` Docker
container with `in-toto==3.0.0` and exited `0`:

```text
in-toto release binding verified: 6 archives with exact SHA-256 products
```

## Remaining boundary

This is official in-toto shape/binding evidence for the current archive set,
not Sigstore identity, trusted publishing, legal approval, or release
acceptance. QUAL-CLI-006 remains open for the remaining official format
validators, trusted-publishing/legal review, and independent acceptance.

No production/provider/customer/database/deployment/publication operation
occurred and no backlog checkbox changed.
