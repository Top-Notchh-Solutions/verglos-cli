# DIST-001 packed-files allowlist hardening — 2026-10-19

## Disposition

Implementation and package-surface qualification progress only. Keep
`DIST-001` unchecked. The private-ledger score remains **239 checked / 41 open
/ 280 total (85.4%)**.

## Product change

Repository: `Top-Notchh-Solutions/verglos-cli`.

Review base: `72190acae81b454a4a88a0ea8d222c8981ac9a3f`.

Normal, separate commits:

- `48a2baa0` — `fix(cli): enforce packed files allowlist`
- `edfb5ec0` — `test(cli): cover unexpected packed members`

The packed-package audit now rejects every archive member that is not covered
by the manifest's exact `files` declarations, while allowing only the npm
package metadata files that npm adds or the packer explicitly carries. This
closes a real gap where forbidden-path checks and entrypoint checks could pass
while an undeclared private file was still present in an archive.

## Verification actually run

- Package-surface and pack regression: **9/9 passed, 0 failed, 0 skipped**.
- Workspace build: **8/8 tasks passed**.
- Public pack: **7 archives created**.
- Packed-manifest audit: passed for all **7** archives.
- Clean consumer: installed all **7** archives, imported all libraries,
  executed `Verglos 2.0.0-alpha.1`, confirmed no implicit external-engine
  installation, and executed the signed `a1-utf8-contains` fixture through
  the bounded restricted-process runtime with an isolated Pro capability
  fixture.
- `git diff --check`: passed.

The cross-platform optional-package metadata used for the local license
qualification was temporary setup in the disposable worktree and was removed
before commit. Generated archives were written only under `/tmp` and were not
published or copied into the repository.

## Boundary and remaining contract

No npm registry, publisher identity, signing provider, deployment, provider,
customer, or Production state changed. This proves the package/archive
boundary only; it does not establish trusted publication, legal clearance,
release approval, immutable attestation, rollback acceptance, or final
customer acceptance. Keep `DIST-001` unchecked until its dependent LOCAL,
HUNT, RECORD, and final-release contracts are satisfied.
