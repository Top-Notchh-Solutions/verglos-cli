# Hunt adversarial suite — local revalidation — 2026-10-08

## Batch

- Backlog scope: `HUNT-011`, `QUAL-CLI-004`
- Repository: CLI shipping worktree
- Source commit: `7d060b2852551cc017bbb2b5f70bad22843e7273`
- Platform: macOS arm64
- Node: `v26.4.0`
- Docker image: `postgres:15-alpine`
- Image digest: `sha256:2bf082886c059b4cf5af3f9e8d3a8916c35699062899061c13bc32d5921c631a`

## Command and result

Command:

```text
VERGLOS_HUNT_TEST_IMAGE=postgres:15-alpine \
VERGLOS_HUNT_TEST_DIGEST=sha256:2bf082886c059b4cf5af3f9e8d3a8916c35699062899061c13bc32d5921c631a \
node scripts/hunt-adversarial-evidence.mjs .artifacts/hunt-adversarial-2026-10-08
```

Result: **60 passed / 1 explicit skip / 0 failed**, exit code `0`.
Docker had no running containers after the bounded run.

The generated report hash is
`sha256:266177a20c772c00522c60b208da0d70d3bb79d4f8dba6929025bec6040f0999`;
the raw log hash is
`sha256:f264e065a31ae49763952675475a5905347a3727d1a899aa528894d1eb0820b8`.

## Limits and disposition

The explicit skip is the Linux-only namespace assertion on macOS. The pinned
suite is local/CI adversarial evidence, not an independent security review,
trusted recipe provenance, or customer workload qualification. No backlog
checkbox changed; `HUNT-011` and `QUAL-CLI-004` remain open.
