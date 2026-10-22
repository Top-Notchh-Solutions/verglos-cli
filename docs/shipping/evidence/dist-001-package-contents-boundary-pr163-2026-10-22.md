# DIST-001 package-contents boundary evidence · 2026-10-22

## Implementation

CLI implementation commit `78b41f80bb10e133ad7540b5104397186260cd48` was
promoted through PR [#163](https://github.com/Top-Notchh-Solutions/verglos-cli/pull/163)
and merged normally as `06c7897525caf499f5128ef0d98f866c17387018`. The source
branch `codex/dist-cli-001-contents-boundary-20261022` remains preserved.

The public package boundary no longer advertises the source-only `fixtures`
directory in `@verglos/shared`'s packed `files` allowlist. The package-surface
audit now verifies that every declared safe path is actually represented in the
packed archive, with focused regressions for a missing declared path and the
shared package manifest.

## Qualification

- Focused package/release contracts: **14/14**.
- Release contract suite: **40/40**.
- Package contents audit: **7 public packages passed**.
- Public-boundary audit: passed.
- Rollback rehearsal: passed across **5 provider boundaries**, preserving
  **2 historical records**.
- Forced CLI test/typecheck/build graph: **23/23** tasks passed.
- Merged-head acceptance verifier: CLI **311/313** with 2 explicit skips and
  0 failures; Web **950/980** with 30 explicit skips and 0 failures; composed
  substrates **74/74**; all **12/12** stories executed; exit 0.
- Merged-head verifier output hashes: CLI
  `a8eeda9ac7e0c4f4eb922e76eb4309ea36d7d49fc2110bef336712098ee712e5`, Web
  `1ce0f07ed92e65f592878a2580d1b581f265f7f94c8cc3d8354ec9ba83690b5c`, and
  composed `fa39c5de58ce74fd7829b909c6607c5b029f09b192722b5d2abec9a9a457a447`.

PR #163 was merged while hosted checks were still queued at the final status
read; no hosted success is claimed here. Local qualification is the evidence
for this code-side batch.

## Boundary and disposition

No `TEST_DATABASE_URL` was sourced or used, although the supplied Web
`.env.test.local` contains a test database URL. No npm publication, registry or
provider action, Production operation, customer/recipient acceptance,
legal/license clearance, trusted publication, immutable attestation, or final
release sign-off occurred. No file, branch, record, deployment, provider,
customer, database, or release artifact was deleted or changed.

Keep `DIST-001` unchecked for its remaining LOCAL/HUNT/RECORD dependencies,
trusted/protected publication, immutable attestation, legal/license clearance,
and final acceptance. Score remains **239 checked / 41 open / 280 total
(85.4%)**.
