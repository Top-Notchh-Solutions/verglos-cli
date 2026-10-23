# DIST-001 current-head archive-member qualification · 2026-10-22

## Scope

This packet records a real CLI implementation batch in the clean worktree
`/private/tmp/verglos-cli-ent-current-20261022`. It hardens the packed-public
manifest audit so an npm archive cannot pass by containing a symlink, hard
link, device, FIFO, or other non-regular tar member. Directories remain
allowed; only regular files contribute to the manifest file-surface audit.

Implementation commit:

- CLI branch: `codex/dist-003-checksum-generation-20261022`
- CLI commit: `e44ce8a673fb1d9119a3231f896d0f86a00cdc3c`
- Parent implementation: `5072204f9164c0f2b2e846dde98ee2a1c8d7bf89`
- Changed source: `scripts/check-packed-manifests.mjs`
- Regression: `scripts/check-packed-manifests.test.mjs`
- Workflow wiring: `.github/workflows/self-scan.yml` and
  `.github/workflows/publish.yml`

## Qualification

The clean CLI checkout was built with `pnpm exec turbo run build --force`:

- build: **8/8** tasks passed;
- focused archive/package suite: **9/9** passed;
- broader release contract suite: **37/37** passed;
- `git diff --check`: passed.

The qualification setup used `pnpm install --frozen-lockfile --force` so all
254 lockfile package entries, including incompatible optional platform
packages, were present for the repository's license/notice generation. This
changed only ignored dependency-install state; no lockfile or source file was
changed.

The real pack-and-consumer run used a disposable directory and passed:

```text
node scripts/pack-public-packages.mjs <disposable-directory>
packed manifest audit passed for 7 npm archives
clean consumer installed 7 archives, imported all libraries, executed Verglos 2.0.0-alpha.1, confirmed no external engine installation, and executed signed a1-utf8-contains through the bounded restricted-process runtime with an isolated Pro capability fixture
```

The regression fixture proves both rejection of a symlink archive member and
acceptance of seven regular public archives. The clean consumer proves the
published package boundary remains installable and executable after the
stricter member-type audit.

## Boundary and disposition

This is implementation and local artifact qualification for `DIST-001`; it is
not final row acceptance. The row remains unchecked for its declared
LOCAL/HUNT/RECORD dependencies and final legal/release qualification. No npm
publication, tag, provider, Production, database, entitlement, customer,
recipient, legal, or AppSec state changed. The source worktree was clean after
commit. AppSec-held HUNT rows and `QUAL-CLI-004` are unaffected.

## Evidence mapping

- Backlog row: `DIST-001`.
- Acceptance mapping: public package contents/front door, exact `verglos` CLI
  entry point, regular archive members, explicit optional-engine behavior, and
  clean-consumer install/runtime boundary.
- Private tracker: `docs/shipping/VERGLOS_V1_BACKLOG.md`,
  `EXECUTION_LEDGER.md`, `TRACEABILITY.md`, `DECISIONS.md`,
  `RELEASE_GATES.md`, and `STATUS.md`.
- Current score after this batch: **239 checked / 41 open / 280 total
  (85.4%)**. No checkbox changed.
