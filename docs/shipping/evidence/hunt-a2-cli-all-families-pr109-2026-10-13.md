# A2 all-family public CLI execution — PR #109 — 2026-10-13

## Scope

This packet records the public-safe implementation slice for the signed CLI
execution path. It is evidence for the approved active goal and the
`FINAL_V1_FEATURE_COVERAGE_MATRIX_2026-10-13.md`; it is not a Hunt acceptance
or release approval.

## Source and change

- Repository: `Top-Notchh-Solutions/verglos-cli`
- Pull request: [#109](https://github.com/Top-Notchh-Solutions/verglos-cli/pull/109)
- Source commit: `eec7174e7c2af2ec5e88511f8160052f75117822`
- Merge commit on public `main`: `16fdafd814e0ee2d161243cf53d86a425075800e`
- Public `main` observed after merge: `16fdafd814e0ee2d161243cf53d86a425075800e`
- Public branch history was preserved and merged with a regular merge commit;
  no squash or force-push was used for this PR.

## What was implemented

The public CLI test now executes each of the seven signed A2 reference recipe
families through the public `hunt --execute` path and the pinned Docker
adapter:

1. SQL/NoSQL injection
2. command injection
3. path traversal
4. SSRF
5. Agent/MCP boundary
6. safe XSS
7. authorization/tenant boundary

For every family the test asserts completed execution, authorization,
catalogue identity, bounded Docker assurance metadata, a confirmed verdict,
and redacted evidence. The harness is sanitized reference code; it does not
represent arbitrary customer-code acceptance or an autonomous AI attacker.

## Verification

- Focused all-family test: 1/1 passing; seven family executions completed.
- Local dependency build, package build, and typecheck passed before push.
- `git diff --check` passed.
- Protected self-scan passed.
- Protected in-toto release binding passed.
- Ubuntu Node 20/22/24 passed.
- macOS Node 20/22/24 passed.
- Windows Node 20/22/24 passed.

## Acceptance boundary

This closes a public technical test slice only. `HUNT-008` remains open for
approved supported-rule scope, provenance/licensing and release treatment,
complete target-code acceptance, hosted entitlement evidence, Linux/Docker
host qualification, independent AppSec review, and final release evidence.
`HUNT-009` through `HUNT-011` remain downstream or separately gated. No
private source, secret, provider, database, entitlement, Production, npm, or
customer-data state was written.

The private score remains **228 checked / 52 unchecked / 280 total (81.4%)**;
no checkbox changes from this packet.
