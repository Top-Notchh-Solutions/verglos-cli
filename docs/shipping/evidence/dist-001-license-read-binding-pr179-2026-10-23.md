# DIST-001 package license-read binding — PR #179 — 2026-10-23

CLI PR #179 source commit `d6101b2a92554e06a1441e7f021989e6352676f6`
binds repository and staged package `LICENSE` reads to bounded regular-file
handles. The package manifest audit and public packer each have source
regressions proving that pathname-bound license reads are not used.

The PR merged normally into CLI `main` as
`a833a9ff12a3d44994fecdb95cea5a1787ba1c00`; no squash and no branch deletion
were used. Hosted checks were green: self-scan `39864475179`, standard
validation `39864475229`, and platform matrix `39864475133` with all nine
Ubuntu/macOS/Windows × Node 20/22/24 cells plus in-toto.

Local verification passed the targeted boundary tests **19/20** and CLI
typecheck; the one local pack-generation test is blocked by this machine's
missing optional `@esbuild/*@0.28.1` package manifests in the installed
dependency metadata. A frozen `pnpm install` confirmed the lockfile was
already current and did not alter source or lockfiles. `git diff --check`
passed.

This is implementation and hosted qualification evidence only. `DIST-001`
remains unchecked for its dependent product surfaces, final license/release
qualification, independent review where required, and final acceptance. No
tag, npm publication, provider, Production, customer, or release-sign-off
event occurred. Nothing was deleted or overwritten. The live score remains
**244 checked / 36 open / 280 total (87.1%)**.
