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
verglos whoami
```

## CI usage

Activate a Pro license in a GitHub Actions job and run the scan without
tripping over the interactive login flow:

```yaml
- name: Activate Verglos
  run: npx verglos activate "$VERGLOS_LICENSE_KEY" --ci
  env:
    VERGLOS_LICENSE_KEY: ${{ secrets.VERGLOS_LICENSE_KEY }}

- name: Run Verglos CI scan
  run: npx verglos ci --threshold 80
```

`--ci` exits with a non-zero status (2) if the key is invalid or expired,
so the job fails fast instead of running the whole scan without Pro
features. Store your key in a repository secret named
`VERGLOS_LICENSE_KEY` — never commit it.

License: Apache-2.0.
