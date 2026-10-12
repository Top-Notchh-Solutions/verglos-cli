# Hunt A1 recipe-family fixture catalog — public PR #97

**Date:** 2026-10-13  
**Public repository:** `Top-Notchh-Solutions/verglos-cli`  
**Merged commit:** `f207240b3370222ee8c36b0dd13029b7d5a1c4ee`  
**Private tracker:** evidence only; no backlog checkbox is closed by this record.

## What changed

The public A1 bounded worker now exposes eight deterministic built-in fixture
probes:

1. `a1-utf8-contains`
2. `a1-path-traversal`
3. `a1-command-injection`
4. `a1-ssrf-target`
5. `a1-tenant-boundary`
6. `a1-sql-injection`
7. `a1-xss-safe`
8. `a1-agent-boundary`

The last three add fixture-level shapes for the approved injection, safe-XSS,
and Agent/MCP tool-boundary scopes. They are not target-code recipes, remote
DAST, or autonomous AI agents. The SQL probe is a bounded SQL-shaped input
classifier; it does not connect to a database. The XSS probe does not launch a
browser. The Agent/MCP probe compares a requested tool with a declared
allowlist; it does not invoke a tool or access credentials.

Every catalog entry declares positive, negative, timeout, and adapter-failure
outcomes. The worker remains restricted to the exact built-in command catalog,
with no target-source access, network access, arbitrary shell, model-generated
command, or unsigned recipe execution.

## Verification

- `pnpm build` passed.
- `pnpm --filter verglos test` passed: 45 tests.
- `pnpm --filter verglos typecheck` passed.
- `pnpm --filter @verglos/hunt typecheck` passed.
- `pnpm --filter @verglos/hunt test` passed; 16 Linux/Docker integration cases
  were explicitly skipped because the required pinned integration image and
  Linux isolation run are still not supplied.
- `git diff --check` passed.
- Protected public checks passed on macOS, Ubuntu, and Windows with Node 20,
  22, and 24.
- Verglos self-scan passed.
- in-toto release binding passed.

## Acceptance boundary

This is implementation evidence for the A1 fixture layer only. `HUNT-008`
through `HUNT-011` remain open for the full target-code recipe treatment,
supported-rule approval, trusted/licensed provenance, hosted entitlement,
Linux/Docker adversarial qualification where required, independent assurance,
and final release acceptance. The live score remains **228 checked / 52 open /
280 total (81.4%)**.
