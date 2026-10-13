# HUNT-011 Docker adversarial-boundary qualification — PR #122

## Disposition

This is a public-safe HUNT-011 adversarial qualification contribution, not
complete HUNT-011 acceptance. The row remains unchecked because independent
review, trusted/licensed recipe provenance, and dependent row acceptance are
still open. The score remains **228 checked / 52 unchecked / 280 total
(81.4%)**. No `.vgl` record, customer source/data, provider state, hosted
target, credential, production workload, npm publish, or held-out experiment
was used.

## Public identity

- PR: #122
- Contribution commit: `00fc6b29c29d054579985953acc824dd3fc741e1`
- Public merge commit: `4d91c616b8744676220a48930034f20a7a64ee6a`
- Merge parents: `95ecf1bad7ff1cee69cf49eee2d0a4946c15bb0b` and
  `00fc6b29c29d054579985953acc824dd3fc741e1`
- Merge mode: regular two-parent merge; no squash, rebase, or force-push

## Implementation mapping

The contribution expands the public Hunt Docker boundary qualification with:

- unit assertions for read-only rootfs, restrictive writable `/tmp` tmpfs,
  dropped capabilities, and denial of privileged/device/host namespace flags;
- pinned-runtime checks for kernel device-node exposure, effective and bounded
  capabilities, no-new-privileges, read-only rootfs, source-mount write
  denial, output/timeout/process/CPU/memory/PID bounds, and restrictive `/tmp`
  mount flags;
- explicit PID, IPC, mount, network, and UTS namespace assertions where the
  host supports them, with an explicit Linux-only skip otherwise.

The CPU cgroup assertion fails closed when `cpu.max` is `max`; it accepts only
a numeric quota no greater than the configured one-CPU ceiling. The tests use
the existing pinned harness image and do not execute customer or production
target code.

## Local evidence

Environment: macOS arm64, Node `v26.4.0`, Docker image
`postgres:15-alpine@sha256:2bf082886c059b4cf5af3f9e8d3a8916c35699062899061c13bc32d5921c631a`.

Command:

```text
VERGLOS_HUNT_DOCKER_INTEGRATION=1 \
VERGLOS_HUNT_TEST_IMAGE=postgres:15-alpine \
VERGLOS_HUNT_TEST_DIGEST=sha256:2bf082886c059b4cf5af3f9e8d3a8916c35699062899061c13bc32d5921c631a \
node scripts/hunt-adversarial-evidence.mjs .artifacts/hunt-adversarial-followup-2026-10-13
```

The post-commit report bound to source commit `00fc6b29c29d054579985953acc824dd3fc741e1`
completed successfully with **94 passed / 3 skipped / 0 failed**. The
adversarial runtime group recorded **18 passed / 1 skipped / 0 failed**; the
single skip was the Linux-only namespace assertion on this macOS host.

Additional local gates passed: `pnpm build` 8/8, `pnpm typecheck` 14/14,
`pnpm lint` 6/6, MCP tests 48/48, complete CLI tests, and `git diff --check`.

## Protected verification and merge

The PR’s final protected platform/in-toto run was `38394513090` and its
Verglos self-scan was `38394513092`; all eleven required checks passed. The
first Ubuntu Node 20 attempt timed out during the pre-existing clean-consumer
`npm install` step and was terminated by the runner with `SIGTERM`; only that
failed job was rerun as job `115290052017`, which passed. The other ten checks
were already successful, and the final PR status was fully green before the
regular merge.

## Acceptance boundary

This contribution qualifies additional public Docker adversarial controls for
HUNT-011. It does not establish independent AppSec review, trusted/licensed
recipe provenance, customer/provider acceptance, complete per-family target
acceptance, `.vgl` Release Record binding, or final release acceptance. Those
gates remain recorded as open rather than inferred from owner approval or local
Docker evidence.
