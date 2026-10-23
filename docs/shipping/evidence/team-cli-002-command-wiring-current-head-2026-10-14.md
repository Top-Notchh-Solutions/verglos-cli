# TEAM-CLI-002 command-wiring recheck — 2026-10-14

## Scope

This packet records the code-side CLI command-wiring evidence for `TEAM-CLI-002`.
It does not close the row: signed organization-policy activation,
hosted SCM/provider integration, and the row's complete end-to-end acceptance
remain open.

## Exact source and evidence

- Public CLI merge: `ba6c75b4e1d11b59f1e6e7bf13edc3c4be02b13a`
- Command wiring: `packages/cli/src/index.ts` binds
  `ci --check-payload`, `--record-manifest-digest`, `--record-url`, and
  `--commit` to `executeCiCheckPayload`; missing options fail before execution.
- Projection implementation: `packages/cli/src/ci-check-payload.ts` reads a
  bounded regular local Release Decision and emits only the source-free
  subject, decision, policy identity/digest, record manifest digest/HTTPS URL,
  commit, summary, and payload digest.
- Contract implementation: `packages/shared/src/ci-check-payload.ts` rejects
  malformed commits, manifest digests, unsafe URLs, invalid subjects, and
  subject/evaluation digest mismatches; delivery comparison is digest-based
  and returns `noop` for identical payloads.
- Focused CLI coverage: `packages/cli/src/ci-check-payload.test.ts` covers
  successful source-free projection, fail-closed invalid/symlink input, and
  the bounded machine-readable `verglos ci` process path.
- Public usage: the exact CLI README documents the command and states that it
  reads the local decision without uploading source or contacting a provider.
- Hosted technical context: GitHub Actions run `38550747564` passed the exact
  merge's supported platform matrix and in-toto binding; this is technical
  evidence, not live SCM/provider evidence.

## Acceptance boundary

The earlier backlog wording that listed “CLI command wiring” as missing is
stale for this exact public head. The code-side wiring is present and
source-free. `TEAM-CLI-002` remains unchecked for its dependency on the
signed organization-policy fetch/cache path, live provider/SCM integration,
and complete end-to-end acceptance. No provider request, repository
installation, source upload, deployment, npm operation, or production state
changed.
