# Web negative-boundary and public-truth registry qualification — 2026-10-06

Repository under test: `verglos-web`, current clean source tree.

## Commands and results

- `pnpm test:negative-boundary` — 2 tests, 2 passed, 0 failed, exit 0.
  The suite verifies malformed/guessed tenant identifiers do not reach a
  data-bearing route and protected organization denials are non-cacheable.
- `pnpm test:truth-registry` — 25 tests, 25 passed, 0 failed, exit 0.
  The suite verifies exact-match pricing/capability publication, correction or
  removal of drifted/unshipped claims, pinned engine attribution, compliance
  status, metric bounds, and mixed-batch refusal when any claim is unsafe.

The Node engine emitted the repository's existing Node 22.x compatibility
warning while running under Node 26.4.0; it did not affect either exit status.
This is qualification evidence only. No production write, deployment, public
copy change, or backlog checkbox was inferred from these tests.
