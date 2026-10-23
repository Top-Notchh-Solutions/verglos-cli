# Hunt review evidence packet — 2026-10-02

This packet is prepared for an independent reviewer. It is not itself an independent review.

## Implementation under review

- Repository: `verglos-cli`
- Exact commit: `e63b5041727a175da1d770012cb945a061f05324`
- Package line: `2.0.0-alpha.1` built from the exact checkout
- Source diff: reviewer must obtain and inspect the diff from the agreed base commit to the exact commit

## Pinned runtime image

- Image: `alpine:3.20`
- Digest: `sha256:d9e853e87e55526f6b2917df91a2115c36dd7c696a35be12163d44e6e2a4b6bc`
- Host: macOS Docker Desktop

## Commands run

```bash
docker info
docker run --rm hello-world
VERGLOS_HUNT_DOCKER_INTEGRATION=1 \
VERGLOS_HUNT_TEST_IMAGE=alpine:3.20 \
VERGLOS_HUNT_TEST_DIGEST=sha256:d9e853e87e55526f6b2917df91a2115c36dd7c696a35be12163d44e6e2a4b6bc \
pnpm --filter @verglos/hunt test
```

## Current observed result

- Unit/policy/adapter tests: passed
- Docker runtime adversarial tests: 15 passed
- Docker runtime adversarial tests: 1 skipped because PID/IPC namespace comparison requires a Linux host
- Known limitation: this macOS run is not Linux-host isolation evidence
- Independent reviewer: not yet assigned
- Recommendation: pending independent review

## Reviewer completion fields

- Reviewer identity:
- Independence declaration:
- Scope reviewed:
- Tests actually rerun:
- Findings:
- Residual risks:
- Recommendation: PASS / CONDITIONAL PASS / FAIL
- Signature:
- Date:

