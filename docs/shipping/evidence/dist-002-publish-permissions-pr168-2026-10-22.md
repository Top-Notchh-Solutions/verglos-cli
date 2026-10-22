# DIST-002 publish-workflow permissions hardening · 2026-10-22

## Scope

This packet records code-side release-workflow hardening for `DIST-002`. It
does not claim legal/license approval, protected-environment approval,
trusted-publisher configuration, npm publication, immutable attestation,
provider action, customer acceptance, independent review, or final release
sign-off.

## Source and implementation

- Implementation repository: public `verglos-cli`.
- Source commit: `4bcb4d26364bd8541678acf93d3388095d7c96c0`.
- Branch: `codex/dist-002-explicit-workflow-permissions-20261022`.
- Pull request: CLI PR #168,
  `https://github.com/Top-Notchh-Solutions/verglos-cli/pull/168`.
- `.github/workflows/publish.yml` now declares `actions: read`,
  `contents: read`, and `id-token: write`; all other listed GitHub token
  permissions are explicitly `none`.
- `scripts/publish-workflow-contract.test.mjs` fails if a non-OIDC write
  permission or an enabled mutation permission is introduced.

## Local verification

- Focused release contract suite: **13/13**.
- `pnpm typecheck`: **14/14** Turbo tasks.
- `pnpm test`: **13/13** Turbo tasks, zero failures, with the two existing
  documented Hunt Docker integration skips.
- `pnpm build`: **8/8** Turbo tasks.
- `git diff --check`: passed.

## Hosted and publication boundary

CLI PR #168 was pushed normally and automatic hosted qualification was
observed running under self-scan `39828880395`, standard validation
`39828880653`, and platform matrix `39828880497`. Their final conclusions
were not available when this packet was written; no manual rerun was issued.

No npm tag, registry publication, trusted-publisher configuration change,
legal decision, provider action, Production mutation, database operation,
customer data operation, or release sign-off occurred. No files, branches, or
records were deleted. `DIST-002` remains unchecked for the unresolved
license/legal review entries, protected/trusted publication approval,
immutable publication/attestation, and final acceptance.

The live score remains **239 checked / 41 open / 280 total (85.4%)**.
