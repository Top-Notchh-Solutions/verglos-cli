# QUAL-CLI-006 · trusted-root Sigstore validation boundary · 2026-10-22

## Implementation

CLI commit `b115446dc670d2d2dbfca803a51a7d908615020c` fixes a real
qualification-boundary defect in `scripts/verify-standard-validation.mjs`.
When the validator is configured with a Sigstore trusted root, the previous
implementation still required the unrelated offline public-key fixture
`sigstore.pub`. Trusted-root verification instead requires the trusted root,
certificate identity, and OIDC issuer; the public key is required only for the
offline key-verification mode. The validator now selects the required fixture
set by mode and preserves artifact-root confinement.

PR #164 merged normally as
`84a72398d584b8c4522868e65a15f716d08363b3`; the source branch remains
preserved. No squash, rebase, branch deletion, database, provider, release,
publication, deployment, or customer operation occurred.

## Verification

- Focused standard-validation/release contract suite: **18/18**.
- New regression: trusted-root mode passes without `sigstore.pub` and emits
  the bounded trusted-root, identity, and issuer arguments.
- Workspace typecheck: **14/14** tasks.
- Workspace build: **8/8** tasks.
- Full CLI test graph: **13/13** tasks, zero failures.
- Merged-head private verifier: CLI **311/313** with 2 explicit skips, Web
  **951/981** with 30 explicit skips, composed substrates **75/75**, and all
  **12/12** story mappings executed with zero failures.
- GitHub status at merge: macOS Node 22 passed; remaining platform,
  standard-validation, in-toto, and self-scan jobs were queued or in progress
  and are not claimed as passed here.

## Boundary

This is repository-owned validation-contract evidence only. It does not prove
trusted keyless Fulcio/Rekor identity, protected publication, legal/license
clearance, provider-side release action, independent review, customer
acceptance, or final release approval. Keep `QUAL-CLI-006` unchecked and keep
the shipping score at **239 checked / 41 open / 280 total (85.4%)**.

The verifier used `env -u TEST_DATABASE_URL`; the owner-supplied remote Neon
URL was not sourced or contacted.
