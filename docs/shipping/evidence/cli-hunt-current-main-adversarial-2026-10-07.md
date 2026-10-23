# CLI current-main Hunt adversarial qualification — 2026-10-07

## Scope

- Repository: `verglos-cli`
- Exact remote head: `7d060b2852551cc017bbb2b5f70bad22843e7273`
- Worktree: `feat/cli-shipping-next`
- Runtime: macOS arm64, Node `26.4.0`, pnpm `9.15.9`
- Docker: client/server `29.7.2/29.7.2`
- Test image: `postgres:15-alpine@sha256:2bf082886c059b4cf5af3f9e8d3a8916c35699062899061c13bc32d5921c631a`

## Command and result

```text
VERGLOS_HUNT_DOCKER_INTEGRATION=1 \
VERGLOS_HUNT_TEST_IMAGE=postgres:15-alpine \
VERGLOS_HUNT_TEST_DIGEST=sha256:2bf082886c059b4cf5af3f9e8d3a8916c35699062899061c13bc32d5921c631a \
pnpm --filter @verglos/hunt test
```

The exact-head run exited `0` with **60 passed / 1 explicit skip / 0
failures** across 61 assertions:

- Docker invocation: 5/5
- Docker runner: 8/8
- Docker runtime: 15/16, with one skip
- Docker sandbox adapter: 6/6
- Hunt orchestration: 18/18
- A1 adapter: 3/3
- recipe catalog: 5/5

The only skip is the PID/IPC namespace assertion, which requires a Linux host
namespace comparison. Docker had no containers remaining after the run.

## Boundary

This is repeatable current-source adversarial-suite evidence on macOS. It does
not establish Linux host isolation, trusted recipe/publisher provenance,
official release validators, legal/trusted-publishing approval, independent
security review, customer qualification, or production isolation. No
production/provider/customer/database/deployment/publication operation
occurred and no backlog checkbox changed. HUNT-008/009/010/011 and
QUAL-CLI-004/006 remain open.
