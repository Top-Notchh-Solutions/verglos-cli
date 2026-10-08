# DIST-006 rollback rehearsal boundary completeness · 2026-10-09

## Scope

- Backlog: `DIST-006`
- Public repository: `verglos-cli`
- Source PR: `#87`
- Source head: `0cbefab1cc1dca4a7b92d5d12e5e44a2d2011259`
- Merge commit: `8bea4be2fa18533eafd088122be769e942965626`

## Change

The local `release rollback-rehearsal` manifest previously allowed a partial
operation set, even though the rehearsal was intended to cover all five
release boundaries. The parser now requires exactly one operation for each of:

- npm package;
- engine manifest;
- Hunt feed;
- signing identity;
- Web deployment.

Duplicate or missing boundary kinds fail closed before any rollback decision is
evaluated. Approval, immutable-reference, replacement-identity, and
historical-record preservation rules remain enforced by the shared decision
contract.

## Verification

- focused rollback suite: **5/5 passed**;
- full CLI package test command completed with all reported test groups passing;
- CLI typecheck: passed;
- CLI build: passed;
- public-boundary audit: passed;
- package/release contract tests: **11/11 passed**;
- hosted Verglos self-scan: passed;
- hosted in-toto release binding: passed;
- hosted platform matrix: all nine Ubuntu/macOS/Windows × Node 20/22/24 cells
  passed.

## Boundary and disposition

This is a local, fixture-shaped rehearsal and parser hardening change. It did
not execute npm/registry, engine-feed, Hunt-feed, signing, Web deployment,
database, payment, or production operations. It does not prove authenticated
provider rollback, protected publishing, legal clearance, trusted release
identity, operational audit/recovery, or independent review.

`DIST-006` remains unchecked. The authoritative private backlog remains
**218 checked / 62 unchecked / 280 total (77.9%)**.
