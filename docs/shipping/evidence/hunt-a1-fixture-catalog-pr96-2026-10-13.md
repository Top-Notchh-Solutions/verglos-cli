# Hunt A1 fixture-probe catalog — PR #96 — 2026-10-13

## Purpose

This record captures the public implementation that expanded the existing A1
bounded worker from one deterministic fixture probe to five first-party
fixture probes. These probes are safe runtime fixtures, not autonomous AI
agents and not target-code attack recipes.

## Public identity

- Repository: `https://github.com/Top-Notchh-Solutions/verglos-cli`
- Pull request: `#96`
- Branch commit: `0cd1878c6960359aa84f485b1f308a3d865591af`
- Squash-merged commit: `9900ebb4f051595c202d11645f91a47f9bd85114`
- Public package line: `2.0.0-alpha.1`

## Implemented A1 fixture probes

The supported catalog now contains these deterministic built-in probes:

1. `a1-utf8-contains` — bounded text containment.
2. `a1-path-traversal` — path input containing a parent-directory segment.
3. `a1-command-injection` — command-like metacharacter shape detection.
4. `a1-ssrf-target` — classification of local/private HTTP(S) targets without
   making a request.
5. `a1-tenant-boundary` — mismatch between authorized and requested tenant
   identities.

Every catalog entry declares positive, negative, timeout, and adapter-failure
fixture outcomes. The adapter accepts only the exact built-in command prefix,
required input names, denied network, one worker, bounded resources,
unconditional cleanup, and required redaction.

## Safety boundary

- No target source or project root is read by these probes.
- No network request is made; the SSRF probe classifies text only.
- No shell, child process, VM, model-generated command, or arbitrary recipe is
  accepted.
- The worker imports no filesystem, network, process-execution, VM, or module
  loading API.
- The runtime explicitly says it is not an OS or security isolation boundary.

## Verification

- `pnpm build`: 8/8 packages passed.
- `pnpm --filter @verglos/hunt test`: all executable tests passed; 16 Docker
  namespace/device/network integration cases remain opt-in/skipped pending a
  pinned Linux integration image.
- `pnpm --filter verglos test`: complete CLI process/package suite passed.
- CLI and Hunt typechecks passed.
- Public PR checks passed on macOS, Ubuntu, and Windows for Node 20, 22, and
  24; self-scan and in-toto release binding also passed.

## Disposition

This is implementation and fixture evidence only. It does not close `HUNT-008`
or downstream Hunt rows. Actual target-code recipe families, supported-rule
approval, provenance/licensing, hosted entitlement, Linux/Docker adversarial
qualification where required, independent review, and final acceptance remain
open. The private score remains **228 checked / 52 unchecked / 280 total
(81.4%)**; no checkbox changed.
