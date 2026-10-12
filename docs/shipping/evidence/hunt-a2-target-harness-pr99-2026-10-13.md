# HUNT-008 A2 target-harness implementation evidence · 2026-10-13

## Result

Public CLI PR #99 was merged after all protected checks passed:

- Merge commit: `8ff0e0cd2a236b107728e606e22f0364c4ddca8f`
- Repository: `Top-Notchh-Solutions/verglos-cli`
- PR: `https://github.com/Top-Notchh-Solutions/verglos-cli/pull/99`
- Source branch head tested before merge: `2636de7c74dbfaf4e663c107996e34e8a5fd335b`

The public CLI now contains an approved A2 target-harness path for seven
recipe families. The implementation is a bounded deterministic Docker worker;
it is not an autonomous AI agent, remote DAST service, or unrestricted command
executor.

## Implemented recipe families

The catalog adds these stable recipe/rule pairs:

1. SQL/NoSQL injection — `a2-sql-nosql-injection-harness` / `D1-001`
2. Command injection — `a2-command-injection-harness` / `D1-003`
3. Path traversal — `a2-path-traversal-harness` / `D1-006`
4. SSRF — `a2-ssrf-harness` / `D9-002`
5. Agent/MCP tool boundary — `a2-agent-mcp-harness` / `AGENT-001`
6. Safe XSS — `a2-xss-harness` / `D1-004`
7. Authorization/tenant boundary — `a2-authorization-harness` / `D3-001`

The earlier eight A1 deterministic fixture probes remain in the catalog. A1
and A2 are recipe families, not sixteen separate autonomous agents.

## Execution contract

- Adapter: `DockerSandboxAdapter` for A2 recipes.
- Image: `docker.io/library/node`.
- Pinned digest:
  `sha256:0a7108bf6c7bf5de370ffb1a3ed6be93d405b43ff159f681a8d18c0e2bc2e402`.
- Command: the catalog supplies a fixed Node harness path; it does not accept
  model-generated shell or arbitrary customer commands.
- Output: the final line must be the bounded JSON protocol
  `{ "verglos": "hunt-result", "verdict": "confirmed" | "not-reproduced" | "unsupported", "summary"?: string }`.
- A non-zero exit, malformed output, assertion mismatch, timeout, or Docker
  failure cannot be converted into a security verdict.
- The harness is executed with denied network, read-only project input,
  read-only root filesystem, dropped capabilities, no-new-privileges, bounded
  CPU/memory/PIDs, and a temporary filesystem. The adapter records the
  platform/host-daemon limitation rather than implying a complete OS boundary.

## Direct verification

Docker Desktop was reachable locally. The pinned Node image was pulled and the
public SQL/NoSQL fixture was run with the bounded settings above. It emitted:

```text
{"verglos":"hunt-result","verdict":"confirmed","summary":"deterministic SQL injection fixture"}
```

The public validation completed with:

- Hunt tests: passed; Docker integration cases that require a Linux host remain
  explicit skips in the public suite.
- CLI tests: 45 passed.
- Shared typecheck: passed.
- Full build: 8/8 passed.
- `git diff --check`: passed.
- Protected public checks: Ubuntu, macOS, and Windows on Node 20/22/24;
  self-scan; and in-toto release binding all passed before merge.

## What this evidence does not prove

This is an implementation slice, not HUNT-008 closure. The row remains open
until the repository has the required evidence for:

- approved source/provenance, licensing, modification, and redistribution
  treatment for every supported rule;
- supported-rule approval and fixture corpus for the target-code harnesses;
- hosted entitlement and approval execution on the intended plan path;
- required Linux/Docker adversarial qualification rather than only local
  macOS-host execution and explicit skips;
- the independent review requirement currently recorded by the shipping
  contract; and
- final release/acceptance treatment and dependent HUNT-009/HUNT-011 evidence.

No secret, customer source, private repository content, deployment credential,
database value, provider write, or Production write is included here.

## Backlog accounting

No checkbox changed from this implementation slice. The private tracker remains
**228 checked / 52 unchecked / 280 total (81.4%)**.
