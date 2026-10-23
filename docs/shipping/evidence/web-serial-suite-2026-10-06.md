# Web serial qualification suite — 2026-10-06

Repository: `verglos-web` at the checked-out working tree used for this run.
Command: `pnpm test:serial`.

## Result

- **859 tests discovered**
- **837 passed**
- **0 failed**
- **22 skipped**
- **exit code 0**
- duration: approximately 9.1 seconds

The run includes the current web authorization, tenant isolation, dashboard,
SCM, queue, usage, runtime configuration, Razorpay contract, and security
regression suites registered by `scripts/run-tests-serial.mjs`.

## Boundary

The skipped tests are environment-dependent integration cases (database,
provider, or worker-recovery evidence). This is a clean serial test result,
not proof of production migration, live provider capture, field Core Web
Vitals, screen-reader review, Linux namespace isolation, independent Hunt
review, or customer acceptance. No production write, migration, deployment,
or backlog checkbox change occurred.
