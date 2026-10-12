# HUNT-008 A2 reference harness evidence · 2026-10-13

## Result

Public CLI PR #100 was merged after every protected check passed:

- Merge commit: `5bf332fab894a21a61b798eb4c01fc000e84fe68`
- Repository: `Top-Notchh-Solutions/verglos-cli`
- PR: `https://github.com/Top-Notchh-Solutions/verglos-cli/pull/100`
- Feature source commit before merge: `2d4ab1b3`

The public repository now carries one sanitized deterministic reference harness
for each approved A2 target-harness family. These fixtures make the catalog
executable and testable without reading customer source or performing real
attacks.

## Reference harnesses

The seven files under
`packages/hunt/fixtures/target-code/.verglos/hunt/` are:

- `sql-nosql-injection.mjs`
- `command-injection.mjs`
- `path-traversal.mjs`
- `ssrf.mjs`
- `agent-mcp.mjs`
- `xss.mjs`
- `authorization.mjs`

Each fixture inspects an embedded synthetic string and emits the bounded
`verglos-hunt-result` JSON protocol. It does not access a database, make a
network request, render a browser, invoke a tool, execute a shell, or read
customer source.

## Verification

The new package test executed all seven fixtures through the local Node
runtime and validated `confirmed` output with the shared strict parser.

Each fixture was also run directly through the pinned Docker boundary with:

- `docker.io/library/node`
- image digest
  `sha256:0a7108bf6c7bf5de370ffb1a3ed6be93d405b43ff159f681a8d18c0e2bc2e402`
- network disabled, private IPC, read-only root and project mount;
  dropped capabilities, no-new-privileges, non-root UID, bounded PIDs,
  memory, CPU, output, and temporary storage

All seven emitted a confirmed bounded result. The package Hunt suite passed;
the existing 16 Linux-host integration cases remain explicit skips on the
macOS development host. The complete CLI test process exited 0, Hunt
typecheck passed, and the full build passed 8/8.

Protected public checks all passed before merge: Ubuntu, macOS, and Windows
Node 20/22/24, Verglos self-scan, and in-toto release binding.

## Boundary and remaining acceptance

This evidence proves reference-fixture execution and protocol coverage. It does
not prove that every customer repository has a qualified target-code harness,
or that HUNT-008 is complete. The row remains open for per-family customer
fixture/negative-timeout-failure qualification, supported-rule approval,
source/version/license/provenance treatment, hosted entitlement, required
Linux/Docker adversarial evidence, independent review, and final release
treatment.

No secret, customer source, private repository content, deployment credential,
database value, provider write, or Production write is included here.

## Backlog accounting

No checkbox changed. The private tracker remains **228 checked / 52 unchecked /
280 total (81.4%)**.
