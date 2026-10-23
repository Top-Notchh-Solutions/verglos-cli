# HUNT-008 current merged-head Docker qualification — 2026-10-14

## Scope

The current public CLI merge head
`ba6c75b4e1d11b59f1e6e7bf13edc3c4be02b13a` was qualified in disposable
worktree `/private/tmp/verglos-cli-qual-006`. The host is macOS arm64 with
Node `v26.4.0`, pnpm `9.15.9`, and Docker `29.7.2`. The target-harness image
was inspected by immutable reference:
`docker.io/library/node@sha256:0a7108bf6c7bf5de370ffb1a3ed6be93d405b43ff159f681a8d18c0e2bc2e402`.

This is local technical qualification only. No customer source, provider,
database, entitlement, publication, deployment, or release state was changed.

## Results

- Baseline `pnpm --filter @verglos/hunt test`: **78 passed / 19 explicit
  skips / 0 failed**. The 19 skips are the package test's environment-gated
  Docker cases; they were not counted as passes.
- Direct pinned runtime command:

  ```text
  VERGLOS_HUNT_DOCKER_INTEGRATION=1 \
  VERGLOS_HUNT_TEST_IMAGE=docker.io/library/node \
  VERGLOS_HUNT_TEST_DIGEST=sha256:0a7108bf6c7bf5de370ffb1a3ed6be93d405b43ff159f681a8d18c0e2bc2e402 \
  node --test --test-concurrency=1 packages/hunt/dist/docker-runtime-adversarial.test.js packages/hunt/dist/target-harness-fixtures.test.js
  ```

  The runtime group passed **18 checks** with one explicit macOS namespace
  skip and zero failures. It covered non-root execution, read-only source and
  root filesystems, network/socket/device denial, dropped capabilities,
  no-new-privileges, secret/output bounds, timeout/CPU/process/PID limits,
  restrictive `/tmp`, memory/CPU/PID cgroups, and signal failure handling.
- Direct target-harness command:

  ```text
  VERGLOS_HUNT_DOCKER_TARGET_INTEGRATION=1 \
  node --test --test-concurrency=1 packages/hunt/dist/target-harness-fixtures.test.js
  ```

  Passed **4/4 test groups**, including all ten public A2 target families'
  positive/negative/unsupported cases, timeout and adapter-failure outcomes,
  Agent/MCP capability-receipt replay rejection, and local target-code
  execution inside the pinned Docker boundary.

## Acceptance boundary

This advances HUNT-008 implementation/qualification only. The row remains
unchecked for supported-rule approval, trusted/licensed recipe provenance,
authorized customer-target evidence, hosted entitlement, independent AppSec
review, complete release-record binding, and final acceptance. Docker on a
macOS host does not replace the required supported Linux/host and independent
review evidence; the namespace case remains an explicit skip.

No score changed: **228 checked / 52 unchecked / 280 total (81.4%)**.
