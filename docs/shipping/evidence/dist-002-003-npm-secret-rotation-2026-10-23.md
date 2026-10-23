# DIST-002/003 npm CI secret rotation observation · 2026-10-23

## Scope

This packet records the owner-controlled GitHub Actions secret rotation for
the public CLI repository. It records no token value and does not claim that
the npm account has the required organization/package permission.

## Observed action

- Repository: `Top-Notchh-Solutions/verglos-cli`
- Secret name: `NPM_TOKEN`
- Owner command: `gh secret set NPM_TOKEN --repo Top-Notchh-Solutions/verglos-cli`
- GitHub CLI result: `Set Actions secret NPM_TOKEN`
- Read-back: `gh secret list --repo Top-Notchh-Solutions/verglos-cli` showed
  `NPM_TOKEN` with timestamp `2026-10-23T01:15:03Z`.

## Boundary and disposition

No workflow was dispatched, no tag was created, and no registry write occurred
as part of this rotation. The effective npm organization/package permission is
not inferred from the presence of a GitHub secret; it must be observed during
an explicitly authorized release attempt. Public publication remains paused
until the whole shipping goal is complete. The earlier alpha.4 partial state
remains five of seven packages, with `@verglos/hunt` absent and the unscoped
CLI not attempted. Nothing was deleted.

