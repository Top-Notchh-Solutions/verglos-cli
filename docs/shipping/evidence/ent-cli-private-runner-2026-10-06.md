# ENT-CLI-001 private runner protocol — 2026-10-06

## Scope

CLI PR #62 (`1633108b41dd8421a44f2ee40efb9572e8bcb3fa`, merged as
`e7b0986f4b33530288af149fc5ddf925c754a9d0`) adds the shared private-runner
protocol contract. It is a bounded decision layer, not a runner service.

The contract enforces tenant and runner binding, protocol version, short-lived
job issuance/expiry, replay refusal, target allowlists, network policy,
bounded timeout/output/memory/process limits, and least-evidence result
projection. It has no arbitrary shell-command field and emits a deterministic
result digest.

## Verification

- Focused shared tests: 3/3 passed.
- Shared package typecheck: passed.
- Shared package build: passed.
- `git diff --check`: passed.
- Hosted platform matrix run `37452872963`: all nine Ubuntu/macOS/Windows ×
  Node 20/22/24 cells passed.
- Hosted Self-scan run `37452872956`: passed.
- Hosted in-toto release binding: passed.

## Boundary

ENT-CLI-001 remains unchecked. HTTP enrollment/poll/result transport, hosted
runner integration, production deployment evidence, and independent review are
not present. This evidence records substrate progress only and does not claim
a deployable private runner or remote execution capability.

