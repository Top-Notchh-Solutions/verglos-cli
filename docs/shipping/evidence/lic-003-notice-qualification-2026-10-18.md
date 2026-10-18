# LIC-003 generated third-party notice qualification — 2026-10-18

## Scope

This packet qualifies the deterministic notice generator on the public CLI
positioning worktree at implementation commit
`8da4617d34196be2c9fcd86c166259ef82984f28`, preserved by regular merge
`50bcab42eadfa8796d86d1f7a8aaee3010c65647`. The merge changes only the CLI
package description; it does not change `pnpm-lock.yaml` or the dependency
archive surface used by the earlier package qualification.

The temporary cross-platform `pnpm.supportedArchitectures` setup was applied
only in the disposable worktree so every lockfile platform entry was
materialized. It was not a public source change. No npm publication, tag,
provider, database, customer, or Production operation occurred.

## Commands and results

- `pnpm install --frozen-lockfile` — exit **0**, pnpm `9.15.9`.
- `node --test scripts/generate-third-party-notices.test.mjs scripts/license-inventory.test.mjs scripts/pack-public-packages.test.mjs scripts/verify-clean-consumer.test.mjs scripts/verify-release-artifacts.test.mjs` — **18 passed / 0 failed / 0 skipped**, exit **0**.
- `node scripts/license-inventory.mjs --check` — exit **0**; **250 package entries**, **254 versions**, and **7 review blockers** retained in the machine-readable inventory. The blockers are `benchmark@1.0.0`, `glob@13.0.6`, `lru-cache@11.5.2`, `minimatch@10.2.6`, `minipass@7.1.3`, `minipass-flush@1.0.7`, and `path-scurry@2.0.2`.
- `node scripts/generate-third-party-notices.mjs` — exit **0**; deterministic output size **393,143 bytes**, SHA-256 `e0e492c2a5f418d19a87feb68b8dea2b91483a93a6da848c1eda9c1549416371`.
- `git diff --check` — passed for the public implementation worktree after the temporary setup was removed.

## Acceptance mapping

The generated notice begins with the required non-endorsement disclaimer,
preserves upstream source identity and available license text, marks missing
installed license text for upstream follow-up, retains the nested
`benchmark` review blocker, and retains the Blue Oak license text. The
generator and release verifier therefore fail closed without hiding or
reclassifying unresolved inventory entries.

The owner/company disposition in
`docs/shipping/legal/legal-company-decision-2026-10-18.md` supplies the
scoped attribution, redistribution, trademark, and release conditions. The
notice artifact itself is not legal advice and does not authorize npm
publication. `LIC-003` is checked for its notice-generation contract;
`DIST-001`–`DIST-003`, trusted publication, and final acceptance remain open
under their own dependencies.

## Privacy and limitations

The output is generated from the public dependency graph and contains no
customer source, credentials, provider payloads, or private tracker data. The
seven retained blockers remain release-visible; this packet does not claim
that they are permissively licensed, that a nested component is excluded, or
that a final archive is approved for publication.
