# HUNT-008 A2 fixture outcome matrix — PR #102

Date: 2026-10-13  
Public repository: `Top-Notchh-Solutions/verglos-cli`  
Pull request: `#102`  
Head commit: `e1060842`
Superseded draft head: `3801125f9486ccc2d4725b178766ac703dd8f762`

## What this records

The public A2 target-harness fixtures now expose three deterministic fixture
cases for each approved Hunt family:

| Family | Positive | Negative | Unsupported |
| --- | --- | --- | --- |
| SQL/NoSQL injection | `confirmed` | `not-reproduced` | `unsupported` |
| Command injection | `confirmed` | `not-reproduced` | `unsupported` |
| Path traversal | `confirmed` | `not-reproduced` | `unsupported` |
| SSRF | `confirmed` | `not-reproduced` | `unsupported` |
| Agent/MCP boundary | `confirmed` | `not-reproduced` | `unsupported` |
| XSS | `confirmed` | `not-reproduced` | `unsupported` |
| Authorization/tenant boundary | `confirmed` | `not-reproduced` | `unsupported` |

That is 21 fixture executions. The harnesses inspect only sanitized synthetic
fixture values; they do not read customer repositories, make network calls,
launch a browser, invoke tools, access a database, or execute arbitrary shell.

## Verification

Local verification passed:

```text
pnpm --filter @verglos/hunt test       PASS
pnpm --filter verglos test             PASS
pnpm build                             PASS (8/8)
git diff --check                        PASS
```

The direct matrix was run with the pinned image:

```text
docker.io/library/node@sha256:0a7108bf6c7bf5de370ffb1a3ed6be93d405b43ff159f681a8d18c0e2bc2e402
```

The Docker boundary used denied network, private IPC, a read-only root and
fixture mount, dropped capabilities, `no-new-privileges`, non-root UID/GID
65532, bounded pids/memory/CPU, a bounded tmpfs, and bounded ulimits. All
seven families produced the expected result for all three cases.

Timeout and infrastructure failure are adapter-level outcomes. They are not
fabricated as harness verdicts and are mapped by the Docker adapter to the
canonical `inconclusive` or `environment-error` result when those conditions
occur.

## Public validation

PR #102 is on the fresh branch
`codex/hunt-a2-outcome-matrix-2026-10-13`, based directly on current public
`main`. The old branch history was replaced with `--force-with-lease` against
the verified superseded head so the PR no longer carries duplicate squashed
history. Fresh repository-dispatched self-scan and cross-platform runs were
started for `e1060842`; their final conclusions and merge state must be
recorded after GitHub finishes. A manually dispatched run is not silently
treated as a protected pull-request check.

## Limitations and acceptance state

This packet does not prove:

- customer-code execution or a remote DAST capability;
- recipe provenance, licensing, or supported-rule approval;
- hosted plan entitlement or Web/MCP integration;
- Linux-host namespace/device/socket/secret adversarial evidence;
- independent AppSec review;
- final release/legal treatment or HUNT-008 acceptance.

Therefore `HUNT-008` remains unchecked. The private tracker remains at
**228 checked / 52 unchecked / 280 total (81.4%)**. No backlog checkbox was
changed by this packet.
