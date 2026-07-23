# Verglos

Security scanning for AI-built JavaScript and TypeScript projects.

```bash
npx verglos
```

Verglos runs locally, prints a score, and shows every finding with file and
line. V1 includes secret detection, dependency CVE checks, git-history secret
scanning, AI-provenance heuristics, slopsquat checks, local reports,
pre-commit hooks, CI mode, and an MCP server for coding agents.

Useful commands:

```bash
npx verglos
verglos ci --threshold 80
verglos hook
verglos mcp --print-config
```

License: Apache-2.0.
