# DIST-002 stable publication dist-tag correction · 2026-10-23

CLI PR [#187](https://github.com/Top-Notchh-Solutions/verglos-cli/pull/187)
merged normally into `main` at merge commit
`f310e8a0b46acb6042fab2172766fa5d27812678` at
`2026-10-23T01:46:57Z`. Source commit: `cf796c78`
(`fix(release): publish stable packages on latest tag`). No squash or branch
deletion was used.

The stable-only publish workflow now passes npm's `latest` dist-tag to all
seven public package publication commands. It no longer routes a stable V1
version through the prerelease `alpha` channel. The workflow contract test
asserts exactly seven stable publish commands and rejects `alpha` in those
commands.

Verification:

- `node --test scripts/publish-workflow-contract.test.mjs`: **2/2 passed**
- `git diff --check`: passed
- Hosted PR checks: all passed, including standard/provenance validators,
  Verglos self-scan, in-toto, and Ubuntu/macOS/Windows Node 20/22/24.

No tag, release workflow dispatch, npm registry write, deployment, package
version, or final release decision occurred. `VERGLOS_FINAL_RELEASE_READY`
remains unset. `DIST-002`/`DIST-003` remain open for the complete final
publication and provenance contract. The live score remains **244 checked /
36 open / 280 total (87.1%)**. Nothing was deleted.
