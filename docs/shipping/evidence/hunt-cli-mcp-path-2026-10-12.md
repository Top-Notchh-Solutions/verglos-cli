# Hunt CLI and MCP path qualification — 2026-10-12

**Evidence type:** repository-owned technical qualification
**Status:** passed technical tests; not a release or independent review
**Source workspace:** `verglos-cli-shipping-worktree`
**Exact source commit:** `04b9a2b333a7dab8370ab40ae26f46c6b10a0156`

## Commands

```text
pnpm --filter @verglos/shared test
pnpm --filter verglos test
pnpm --filter @verglos/mcp test
```

All three commands exited `0` on the exact source commit. The MCP test output
included 29 passing dispatch/capability tests covering Hunt finding/report,
before-write, verdict explanation, complete execution bindings, entitlement
checks, approval scope, and arbitrary-code refusal. The CLI package test
exercised the wired `hunt` command and its recipe verification/execution
paths; the shared suite exercised recipe schema, trust, planner, execution
gate, redaction, verdict, and Trivy boundaries.

The companion Docker run is recorded in
`hunt-docker-adversarial-2026-10-12.md` and passed 60 checks with one
documented macOS namespace skip and zero failures.

## Disposition

This proves the repository-owned CLI/MCP technical path and bounded Docker
fixture on this commit. It does not prove licensed external recipe provenance,
Linux namespace coverage, independent AppSec review, hosted plan entitlement,
or customer acceptance. HUNT-008, HUNT-009, HUNT-010, HUNT-011, and
QUAL-CLI-004 therefore remain unchecked.
