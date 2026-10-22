# DIST-003 · release-origin metadata output boundary · 2026-10-22

## Implementation

CLI commit `7ef8f1f0d4b29766d75623884b00cd524e3d29e1` hardens
`scripts/generate-release-origin.mjs` against an unsafe output path. Before
this change, an existing `RELEASE_METADATA.json` symlink could be followed by
the generator and its target overwritten. The generator now rejects a
symlinked/non-regular metadata output and opens the output with `O_NOFOLLOW`
where supported. A regression proves the sentinel target remains unchanged.

PR #165 merged normally as
`ecda0aec8441b0afe21f9e12a476bb964bc36ccc`; the source branch remains
preserved. No squash, rebase, branch deletion, database, provider,
publication, deployment, or release operation occurred.

## Verification

- Focused release-origin, artifact, checksum, and publish-contract suite:
  **13/13**.
- Workspace typecheck: **14/14** tasks.
- Workspace build: **8/8** tasks.
- Full CLI test graph: **13/13** tasks, zero failures.
- Merged-head private verifier: CLI **311/313** with 2 explicit skips, Web
  **951/981** with 30 explicit skips, composed substrates **75/75**, and all
  **12/12** story mappings executed with zero failures.
- GitHub jobs were queued at merge/status read and are not claimed as passed.

## Boundary

This is repository-owned release-artifact safety evidence only. It does not
establish trusted publication, immutable attestation, legal/license clearance,
provider-side release action, independent review, customer acceptance, or final
release approval. Keep `DIST-003` unchecked and keep the score at **239 checked
/ 41 open / 280 total (85.4%)**.

The verifier used `env -u TEST_DATABASE_URL`; the owner-supplied remote Neon
URL was not sourced or contacted.
