# STUDIO-CLI-001 current merged-head recheck — 2026-10-14

## Sources

- CLI exact public merge: `ba6c75b4e1d11b59f1e6e7bf13edc3c4be02b13a` in
  `/private/tmp/verglos-cli-qual-006`;
- Web exact public merge: `a54d70dfacfaf9506b1336b788d9cd86c9ca74d7` in
  `/private/tmp/verglos-web-qual-006`;
- host: macOS arm64, Node `v26.4.0`, pnpm `9.15.9`.

## Verification

- shared client-projection contract:
  `pnpm exec node --import tsx --test src/client-projection.test.ts` —
  **4 passed / 0 failed**;
- CLI client projection and record-project contracts — **5 passed / 0 failed**;
- full CLI package test command — exit **0**;
- Web client/tenant/receipt/Studio contracts — **62 passed / 1 explicit
  database integration skip / 0 failed**;
- Web typecheck — passed.

The tested projection remains allowlisted, organization/workspace/record bound,
approval-bound, digest-bound, and fail-closed for cross-tenant, private,
unknown, nested, drifted, and expired inputs. The Web receipt boundary keeps
private projections tenant scoped and verifies stored digests. The database
integration skip is retained because no test database was supplied to this
disposable worktree.

## Acceptance boundary

This is current-head code and contract evidence only. `STUDIO-CLI-001` remains
unchecked pending an independent observation that the hosted recipient sees
only the approved redacted projection and a real authorized Studio
recipient/customer acceptance run. Local owner approval, source tests, and a
synthetic projection cannot substitute for those observations.

No hosted recipient, customer, Production, provider, entitlement, database,
public deployment, npm, or browser state was changed. No checkbox changed; the
score remains **228 checked / 52 unchecked / 280 total (81.4%)**. `LIC-002` is
the next dependency-ready row after this externally parked item.
