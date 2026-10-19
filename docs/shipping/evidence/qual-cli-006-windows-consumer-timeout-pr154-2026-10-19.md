# QUAL-CLI-006 Windows consumer qualification repair — 2026-10-19

## Scope

This packet records a real code-side qualification repair for `QUAL-CLI-006`.
It does not close the backlog row and does not authorize publication, signing,
customer-source use, production mutation, or AppSec/Hunt execution.

## Source and merge

- Repository: `Top-Notchh-Solutions/verglos-cli`
- Pull request: #154
- Branch: `codex/qual-cli-006-sigstore-root-20261019`
- Separate implementation commit:
  `ebe061dca685fa8718bf1af02a1e0156c5e9fe17`
- Separate regression commit:
  `bd0b46af8160cd816ecbba2024ba85836a658481`
- Normal merge commit: `ab30be78cacce4cdb161a91cce70ca7cd0e46666`
- Merge mode: normal merge; no squash, rebase, or force-push

## Defect and original logic

The prior Windows Node 22 hosted job failed while installing the seven clean
public package archives in the consumer qualification. The bounded subprocess
timeout was 180 seconds on every platform, and the Windows `npm.cmd`/filesystem
compatibility layer exceeded that bound. The fix preserves the same archive
set, install flags, lock-free clean consumer, and verification flow while using
a platform-specific bounded timeout: 180 seconds on Linux/macOS and 300
seconds on Windows. The timeout selection is isolated in
`scripts/clean-consumer-runtime.mjs` and covered by a focused regression test.

## Verification

- Focused local contract tests: **13/13 passed**.
- Local typecheck: **14/14 passed**.
- `git diff --check`: passed.
- Hosted platform matrix run: **39254555360**.
- Hosted platform matrix: **10/10 jobs passed**:
  Ubuntu Node 20/22/24, macOS Node 20/22/24, and Windows Node 20/22/24.
- The formerly failing Windows Node 22 job `118066431208` passed clean
  consumer installation, upgrade/rollback qualification, release rollback
  rehearsal, typecheck, and tests.
- Official standard/provenance validators: run `39254555279`, passed.
- Verglos self-scan: run `39254555454`, passed.
- Official in-toto release binding: job `118066430746`, passed.

## Boundary and disposition

No npm publication, registry/tag mutation, signing-provider operation,
customer repository, production database, or AppSec/Hunt operation occurred.
The implementation repair advances the code-side qualification only.

`QUAL-CLI-006` remains unchecked because its full contract still requires
trusted keyless publication identity, protected publisher approval, legal
clearance, independent AppSec review, and final acceptance. Score remains
**239 checked / 41 open / 280 total (85.4%)**.
