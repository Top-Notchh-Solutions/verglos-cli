# DIST-006 rollback handle recheck · 2026-10-23

CLI PR #191 merged normally into `main` as
`5f6e2cdea77b678ba82ac6117eb61284b82e0d4f`, preserving implementation commit
`f46fb8c9ed575e89b1a4f708f019f0f044c60b63`. No squash or branch deletion was
used.

The rollback-plan reader now rechecks the opened regular-file handle after
reading. It rejects a changed file identity, changed size, short read, or
non-regular final handle. This closes the remaining read-time replacement and
truncation boundary for rollback references and rehearsal manifests.

Verification passed:

- focused rollback suite: **8/8**;
- CLI package typecheck;
- CLI package test target, with only the existing explicit Hunt Docker skips;
- `git diff --check`.

Hosted validation began after merge and was still running at capture; it is
not claimed as green here. No provider, registry, signing, Hunt-feed, web
deployment, tag, customer, or release action occurred. Keep `DIST-006`
unchecked for authenticated provider rollback/revocation and final release
acceptance. Nothing was deleted or overwritten.
