# QUAL-CLI-006 artifact qualification continuation — 2026-10-07

## Exact source and boundary

The disposable worktree tested CLI origin/main commit
`6bde945c60ac34351c02a70f6e7a2cb24f98ae1d`. No public repository or release
tag was changed, and no npm publication or registry credential was used.

The initial local install used the default macOS-only optional dependency set;
the license inventory correctly failed closed because the lockfile contains
all esbuild platform packages but their manifests were not installed. The CI
workflow's existing ephemeral `supportedArchitectures` configuration was then
applied only in the disposable worktree, followed by a forced frozen-lockfile
install. This installed 254 packages and allowed the inventory to evaluate all
locked platform metadata.

## Completed checks

- Package-content audit: passed for all 6 public packages.
- Forced build/typecheck: 16/16 Turbo tasks passed.
- License inventory `--check`: passed after the all-platform dependency
  install; generated notices successfully.
- Public pack: 6 npm archives created.
- Packed-manifest audit: passed for 6 archives.
- Clean consumer: installed all 6 archives, imported all libraries, ran
  `verglos --version` as `2.0.0-alpha.1`, and confirmed no external engine was
  installed implicitly.
- Upgrade/rollback: `1.8.3 -> 2.0.0-alpha.1 -> 1.8.3` passed in a disposable
  consumer.

## Open qualification boundary

The official `in-toto-verify` step was not completed because the local
`in-toto==3.0.0` environment installation was interrupted while downloading
its cryptography dependency. No in-toto result is claimed. Trusted
keyless/Sigstore identity, legal clearance, protected publishing, immutable
publication, and final release-candidate approval remain open. QUAL-CLI-006
therefore remains unchecked.

No production, database, migration, deployment, payment, provider, registry
publication, or credential mutation occurred.
