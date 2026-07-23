# verglos-cli

Private monorepo for the `verglos` npm package and its supporting workspaces.

Packages:

- `packages/cli` — the `verglos` CLI (npm-published bin)
- `packages/scanner` — detectors, rules, orchestrator
- `packages/reporter` — terminal / HTML / JSON output
- `packages/shared` — types, config, fingerprint, paywall, explain-bank
- `packages/entitlement` — license verification client
- `packages/mcp` — Verglos MCP server

Requires Node 20+ and pnpm 9.

```sh
pnpm install
pnpm build
```
