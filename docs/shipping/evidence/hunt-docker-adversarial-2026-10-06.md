# Hunt Docker runtime adversarial qualification — 2026-10-06

Source tree: exact current CLI commit `955412516b96cc09393e78c43bf7d02b9abd05d9`.
Docker engine: 29.7.2, Linux server. Test image was pulled by immutable digest:
`debian@sha256:7c7b2c966bc9ee8cedfeef67e0e279108992c77681fa595db4a9d65c06ccc587`.

Command:

```text
VERGLOS_HUNT_DOCKER_INTEGRATION=1
VERGLOS_HUNT_TEST_IMAGE=debian
VERGLOS_HUNT_TEST_DIGEST=sha256:7c7b2c966bc9ee8cedfeef67e0e279108992c77681fa595db4a9d65c06ccc587
pnpm --filter @verglos/hunt test
```

Results: Docker invocation/runner/adapter and Hunt contract suites passed;
the runtime adversarial group passed 15/15 enabled scenarios with 0 failures.
The one runtime namespace scenario was skipped because the host process running
the test is macOS even though Docker's daemon is Linux. The enabled checks
covered non-root execution, read-only source/root filesystem, no network,
absent Docker socket and kernel device, no-new-privileges, output/time/CPU/
process/disk/memory bounds, redaction, and signal failure classification.

This strengthens HUNT-011 and Docker evidence but does not claim host-level
Linux namespace qualification, independent review, trusted recipe publishers,
or a fully enabled `verglos hunt` command. No production write, deployment,
publication, or backlog checkbox change occurred.
