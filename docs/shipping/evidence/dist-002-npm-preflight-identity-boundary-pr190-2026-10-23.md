# DIST-002 / DIST-003 npm preflight identity boundary · 2026-10-23

The CLI source branch `codex/dist002-npm-preflight-20261023` carries normal
commit `9e793fd84b74d1ba873de8011033d1898cbb0eb2` and PR #190:
`https://github.com/Top-Notchh-Solutions/verglos-cli/pull/190`.

The release publisher now parses a successful npm registry preflight response
and requires its exact `name` and `version` to match the validated archive
manifest before treating the package as already published. Malformed JSON and
mismatched identities fail closed; the publisher does not proceed to a publish
decision from an unbound `200` response.

Focused verification passed **17/17**:

```text
node --test scripts/publish-public-package.test.mjs \
  scripts/publish-workflow-contract.test.mjs \
  scripts/verify-release-artifacts.test.mjs \
  scripts/verify-release-tag.test.mjs
git diff --check
```

This is repository-owned implementation evidence only. The NPM token remains
configured as an owner-managed Actions secret, but this OIDC publication path
does not consume it. No tag, npm publication, provider/Production action, or
release sign-off occurred. Keep `DIST-002` and `DIST-003` unchecked for their
actual trusted publication/attestation and final release conditions. Nothing
was deleted or overwritten.
