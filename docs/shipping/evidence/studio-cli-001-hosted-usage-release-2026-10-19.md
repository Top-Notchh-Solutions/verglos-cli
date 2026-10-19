# STUDIO-CLI-001 hosted usage release hardening — 2026-10-19

## Scope

This packet records a production-logic correction in the Web hosted custody
path. It advances `STUDIO-CLI-001` but does not check the row: the row still
requires a numeric paid/non-production allowance and an authorized Studio
recipient/customer acceptance observation.

## Public implementation

- Repository: `https://github.com/anuragyadav-git/verglos-web`
- Qualification worktree base: Web `2c07237845f0e52061dc52c99c21212615390177`
- Implementation commit: `c9dd749` — `fix(web): release hosted usage after custody failure`
- Regression commit: `f26213c` — `test(web): cover hosted usage rollback`
- History: two substantive commits; no squash, rebase, force-push, empty, or
  contribution-count-only commit.

## Original logic implemented

The canonical `hosted.ingestion.records` reservation now has a deterministic
release identity and a real release operation. Both hosted receipt custody and
client-projection custody perform their insert in the scoped database
transaction boundary. If persistence fails, the insert rolls back and the
reserved allowance is released. If a raced identity conflict has a different
scope, the reservation is released; an ambiguous release fails closed as an
admission error instead of returning a misleading conflict. Exact retries and
successful inserts retain their existing commit/idempotency behavior.

The stale client-workspace comment was also corrected to describe the existing
tenant-scoped persistence and HTTP routes rather than claim that wiring was
still a future placeholder.

## Verification

- `pnpm typecheck`: passed.
- `pnpm test`: **894 passed / 24 skipped / 0 failed** out of 918 tests.
- Receipt route integration against disposable PostgreSQL 15 Alpine pinned to
  `sha256:2bf082886c059b4cf5af3f9e8d3a8916c35699062899061c13bc32d5921c631a`:
  **1/1 passed**, including failed-insert release coverage.
- Client-projection route integration against the same pinned disposable
  PostgreSQL image: **1/1 passed**, including failed-insert release coverage.
- `pnpm build`: passed; static generation completed **49/49** pages.
- `git diff --check`: passed; qualification worktree is clean.

## Boundary and disposition

No Production, billing, provider, customer, npm, registry, or AppSec state was
changed. The PostgreSQL container was disposable and removed after testing.
The implementation commits are local qualification commits and are not being
represented as a public merge or as hosted/customer acceptance.

`STUDIO-CLI-001` remains unchecked. Score remains **239 checked / 41 open /
280 total (85.4%)**. Hunt/AppSec rows remain held separately and were not
reclassified by this change.
