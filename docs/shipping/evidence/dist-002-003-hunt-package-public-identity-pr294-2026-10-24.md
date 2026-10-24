# DIST-002 / DIST-003 Hunt package public identity fix — 2026-10-24

## Source change

PR [#294](https://github.com/Top-Notchh-Solutions/verglos-cli/pull/294) was
merged normally into `main` at merge commit
`c745a2f103e7cf950bcaef1577456dffb94c876b`. It adds the missing public package
identity metadata to `@verglos/hunt`: description, repository and directory,
homepage, bugs URL, author, and release-relevant keywords. The package remains
Apache-2.0, public-access configured, and unreleased.

## Local implementation verification

- Focused package-surface and publish-contract tests: **16/16 passed**.
- `@verglos/hunt` build: passed.
- `@verglos/hunt` test suite: passed; documented Docker integration skips remain
  explicit and are not represented as passes.
- Public package packer produced **7/7** archives.
- Packed-manifest audit: **7/7** passed.
- Package-content audit: **7/7** passed.
- Hunt archive digest:
  `sha256:a6c6b3b4e3fdfadc9cdedf64ab3f2d3a5a6a3d23dd44d649557a2e0fd7684f12`.
- Private pack output is retained at
  `.local-evidence/hunt-publish-metadata-2026-10-24/public-packages`.

## Boundary

This is implementation and package-identity evidence for DIST-002/DIST-003.
It does not claim npm publication, trusted provenance, registry acceptance,
independent review, AppSec/Hunt review, or final release sign-off. No npm
publish, tag, release, customer operation, deletion, or paid Actions run
occurred. The rows remain unchecked; the backlog score remains **245 checked /
35 open / 280 total (87.5%)**, with **13 AppSec-dependent / 22 non-AppSec**.
The additive private bundle verifies **297** files with zero mismatches,
secret scanning passed, and manifest
`sha256:dc6040a8d6397ea08fe2cbca2f70957cd0f4ea93c0c1b9e7a89954e010feb4a6`:
`acceptance-evidence-bundle-2026-10-24-dist-002-003-hunt-package-identity-v1.json`.
