# DIST-002 final-release readiness gate · 2026-10-23

## Implementation

- Repository: `verglos-cli`
- Pull request: [#186](https://github.com/Top-Notchh-Solutions/verglos-cli/pull/186)
- Branch: `codex/dist003-release-alpha3-20261023`
- Commit: `447237fa` (`fix(release): require final shipping readiness`)

The protected publish job now requires the repository variable
`VERGLOS_FINAL_RELEASE_READY=true` before any npm publication step can run.
The variable is intentionally not set while the private shipping goal has
open rows. The existing stable-tag-only, protected-environment, immutable-tag,
OIDC, and no-long-lived-token controls remain in place.

## Verification and boundary

- `node --test scripts/publish-workflow-contract.test.mjs`: **2/2 passed**
- `git diff --check`: passed
- PR #186 hosted checks: queued at observation; no hosted pass or merge is
  claimed.
- No tag, workflow dispatch, registry write, deployment, or package version was
  created. Nothing was deleted.

This gate makes the owner's “release only after whole shipping completion”
policy executable in the public workflow. `DIST-002`/`DIST-003` remain open.

