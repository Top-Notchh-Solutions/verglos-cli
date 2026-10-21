# DIST-002 Sigstore 5 remediation check — 2026-10-21

## Scope

This packet records a disposable dependency-remediation experiment against CLI
commit `72190acae81b454a4a88a0ea8d222c8981ac9a3f`. It was performed in a
temporary detached worktree and removed afterward. No CLI source branch,
registry, publication, protected environment, provider, customer, legal, or
Production state changed.

## Upstream check

The current published `sigstore` version was **5.0.0**. Its declared engine is
`^22.22.2 || ^24.15.0 || >=26.0.0`, while the CLI repository contract remains
Node `>=20`. The Sigstore 5 signing path still declares `make-fetch-happen`
through `@sigstore/sign`, so it is not an automatic license-blocker removal
and would narrow the supported Node contract.

## Disposable qualification

The experiment temporarily changed only the detached worktree's CLI dependency
to exact `sigstore@5.0.0`, materialized the documented cross-platform optional
packages, and ran:

- `pnpm install --frozen-lockfile`: passed.
- `pnpm build`: **8/8 Turbo tasks passed**.
- `node --test scripts/license-inventory.test.mjs`: **6/6 passed**.
- `node scripts/license-inventory.mjs --check`: completed with a complete
  inventory of **258** lockfile package versions.
- `node scripts/license-inventory.mjs --require-clear`: exited **2**, still
  reporting **7** review blockers:
  `benchmark@1.0.0` bundled by `fast-uri@3.1.7` with a nested-license conflict,
  plus BlueOak review for `glob@13.0.6`, `lru-cache@11.5.2`,
  `minimatch@10.2.6`, `minipass@7.1.3`, `minipass-flush@1.0.7`, and
  `path-scurry@2.0.2`.

The inventory itself remains complete and deterministic; the strict gate
refuses unresolved legal review rather than treating the newer dependency as
clearance.

## Disposition

Do not merge the Sigstore 5 experiment. It does not clear DIST-002, and it
would violate the current Node support floor without a separate compatibility
decision. Keep the existing CLI source and fail-closed license gate unchanged.
DIST-002 remains open for legal/license clearance, protected trusted publisher
approval, DIST-001 completion, and an actual immutable publication/attestation.
