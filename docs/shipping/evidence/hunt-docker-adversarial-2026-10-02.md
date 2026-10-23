# Hunt Docker adversarial runtime evidence

Date: 2026-10-02
Repository: `verglos-cli`
Image: `alpine@sha256:d9e853e87e55526f6b2917df91a2115c36dd7c696a35be12163d44e6e2a4b6bc`
Runtime: Docker Desktop Server 29.7.2, host macOS/aarch64

## Results

With `VERGLOS_HUNT_DOCKER_INTEGRATION=1`, the complete Hunt package test set passed **55/56** with zero failures. The 15 enabled Docker adversarial checks passed: non-root execution, read-only source mount and root filesystem, network denial, no Docker socket, no kernel device, no-new-privileges, secret-shaped output redaction, output cap, timeout, CPU bound, process-tree bound, tmpfs disk bound, cgroup memory ceiling, and signal-failure classification. Adapter and planner tests also passed.

One test was explicitly skipped because PID/IPC namespace comparison requires a Linux host namespace view; this host is macOS Docker Desktop. The run is stronger local runtime evidence, not Linux namespace qualification, independent Hunt review, recipe provenance, or final HUNT-011/QUAL-CLI-004 acceptance.

## Revalidation — 2026-10-06

Exact unreleased CLI source: `955412516b96cc09393e78c43bf7d02b9abd05d9`.
Docker Desktop was reachable (`29.7.2`, macOS/aarch64). Command:

```text
VERGLOS_HUNT_DOCKER_INTEGRATION=1 \
VERGLOS_HUNT_TEST_IMAGE=alpine:3.20 \
VERGLOS_HUNT_TEST_DIGEST=sha256:d9e853e87e55526f6b2917df91a2115c36dd7c696a35be12163d44e6e2a4b6bc \
pnpm --filter @verglos/hunt test
```

Result: **56 tests, 55 passed, 0 failed, 1 skipped**. The same 15 Docker runtime assertions passed; the sole skip remains the Linux-host PID/IPC namespace comparison. This revalidation refreshes local runtime evidence only and does not close HUNT-011 or QUAL-CLI-004.
