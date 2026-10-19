# DIST-001 package allowlist hardening · 2026-10-19

## Scope

This packet records a real code-side hardening slice for `DIST-001` in the
public `verglos-cli` repository. It does not claim the distribution row is
closed: the row still depends on the open LOCAL/HUNT/RECORD product rows and
the separate legal, trusted-publication, release, and final-acceptance
contracts.

## Source and publication identity

- Repository: `Top-Notchh-Solutions/verglos-cli`
- Base: CLI `origin/main` `0823b513f2b1810ad9f6afcb8806ba46f61feedb`
- Implementation commit: `d3069413` (`fix(cli): reject unsafe package file allowlists`)
- Regression commit: `656397eb` (`test(cli): guard package file allowlist boundaries`)
- Pull request: #152, `fix(cli): harden public package file allowlists`
- Branch: `codex/ent-cli-001-qualification-20261019`
- Public/private boundary: only public audit logic and regression tests were
  pushed; no private ledger, credentials, customer source, or generated
  evidence was added to the public repository.

## Implementation

The public package audit now rejects package `files` declarations that are
absolute, traversal-shaped, glob-shaped, control-character-containing,
empty, overlong, or duplicated. The check runs before the package contents
walker resolves or reads a declared path, and the same exact-path contract is
used by the manifest surface audit. Existing public packages continue to use
their original `dist`/`fixtures` allowlists; no install hook or optional
engine behavior was changed.

## Commands and results

- `node --test scripts/package-surface-audit.test.mjs` — **6/6 pass**, 0 fail,
  0 skip.
- `node scripts/check-package-contents.mjs` — **pass** for all 7 public
  packages.
- `pnpm exec turbo run test typecheck build --force` — **23/23 tasks
  successful**, no task failures; existing environment-gated Hunt A2 tests
  remain explicit skips.
- `node scripts/pack-public-packages.mjs /tmp/verglos-dist001-pack.N80wxz` —
  produced 7 public archives.
- `node scripts/check-packed-manifests.mjs /tmp/verglos-dist001-pack.N80wxz` —
  **pass**.

The disposable command logs remain at:

- `/tmp/verglos-dist001-surface-test.log`
- `/tmp/verglos-dist001-contents-final.log`
- `/tmp/verglos-dist001-hardening-turbo.log`
- `/tmp/verglos-dist001-pack.log`
- `/tmp/verglos-dist001-manifest.log`

## Disposition

This advances the `DIST-001` implementation and qualification substrate only.
No backlog checkbox changed; the live score remains **239 checked / 41 open /
280 total (85.4%)**. No AppSec/Hunt state, npm registry state, provider state,
production state, legal decision, or customer acceptance state changed.

