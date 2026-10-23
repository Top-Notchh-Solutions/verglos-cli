# DIST-003 verified release-notes sidecar · 2026-10-23

CLI PR [#188](https://github.com/Top-Notchh-Solutions/verglos-cli/pull/188)
merged normally into `main` at merge commit
`1369384fcdf579fce41c172139b0858f07698869` at
`2026-10-23T02:04:21Z`. Source commit: `51b60b8d`. No squash or
branch deletion was used.

The release workflow now generates `RELEASE_NOTES.md` from the seven packed
public archives and binds it to the exact release tag, source commit, and
package versions. The sidecar is included in upload, `SHA256SUMS`, and
`RELEASE_METADATA.json`; the strict artifact verifier validates its release
binding before publication.

Verification:

- Release-contract suite: **53/53 passed**
- `git diff --check`: passed
- Hosted PR checks: all passed, including standard/provenance validators,
  Verglos self-scan, in-toto, and Ubuntu/macOS/Windows Node 20/22/24.

No tag, release workflow dispatch, npm registry write, deployment, package
version, or final release decision occurred. `VERGLOS_FINAL_RELEASE_READY`
remains unset. `DIST-002`/`DIST-003` remain open for complete final
publication, provenance, and acceptance. The live score remains **244 checked /
36 open / 280 total (87.1%)**. Nothing was deleted.
