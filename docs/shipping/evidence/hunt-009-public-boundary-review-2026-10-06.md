# HUNT-009 public-boundary review — 2026-10-06

## Result

No HUNT-009 acceptance credit is recorded. A local implementation attempt was
removed before commit because the public CLI cannot depend on the private
`@verglos/hunt` package. The public archive packer is intentionally fail-closed
for exactly this case. The alpha CLI therefore remains on its honest Pro beta
shell and exit-78 contract.

## Reviewed state

- Public CLI base: `67a132c` on local branch `feat/cli-hunt-execution-v1`.
- Previously published candidate reviewed: `0ee7348` on the unmerged
  `feat/cli-hunt-supported-recipe-execution` line. It adds
  `@verglos/hunt` to the public CLI manifest and therefore cannot be accepted
  as a public release slice.
- Private Hunt package: `packages/hunt/package.json` is `"private": true`.
- Public package guard: `scripts/pack-public-packages.mjs` rejects any public
  workspace package that declares a dependency on a private workspace package.
- No CLI source or manifest change from the rejected attempt remains tracked;
  founder-owned untracked documentation/assets were preserved and not staged.

## Verification after removal

- `pnpm --filter verglos typecheck` — passed.
- `pnpm --filter verglos test` — passed with no failures.
- `pnpm --filter verglos build` — passed.
- `node scripts/check-public-boundary.mjs` — passed.
- `git diff --check` — passed.
- `node scripts/pack-public-packages.mjs ...` — not credited: the local pnpm
  installation reports `ERR_PNPM_MISSING_PACKAGE_INDEX_FILE` for cached
  `turbo@2.10.6` while running `pnpm licenses list --json`; this is a local
  toolchain/index failure, not a bypass or a public-pack success claim.

## Gate boundary

HUNT-008/009/010/011 and QUAL-CLI-004 remain open. A functional public Hunt
command cannot be enabled until the private-runtime packaging boundary is
resolved and the independent gates for trusted publisher roots, licensed
recipe provenance, approval/entitlement wiring, bounded execution, isolation,
adversarial qualification, and review are complete. No production, provider,
database, customer, deployment, publish, or release operation occurred.
