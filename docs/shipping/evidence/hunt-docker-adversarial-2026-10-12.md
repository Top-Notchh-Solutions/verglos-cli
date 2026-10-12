# Hunt Docker adversarial qualification — 2026-10-12

**Evidence type:** repository-owned technical qualification
**Status:** passed technical run; not an independent security review
**Source workspace:** `verglos-cli-shipping-worktree`
**Exact source commit:** `04b9a2b333a7dab8370ab40ae26f46c6b10a0156`
**Host:** macOS arm64, Node `v26.4.0`
**Docker:** `29.7.2`

## Command and pinned fixture

```sh
VERGLOS_HUNT_TEST_IMAGE=postgres:15-alpine \
VERGLOS_HUNT_TEST_DIGEST=sha256:2bf082886c059b4cf5af3f9e8d3a8916c35699062899061c13bc32d5921c631a \
node scripts/hunt-adversarial-evidence.mjs .artifacts/hunt-adversarial-2026-10-12
```

The harness ran:

```text
pnpm --filter @verglos/hunt test
```

## Result

```json
{
  "schema": "urn:verglos:evidence:hunt-adversarial:v1",
  "pass": 60,
  "skipped": 1,
  "failed": 0,
  "exitCode": 0,
  "image": "postgres:15-alpine",
  "imageDigest": "sha256:2bf082886c059b4cf5af3f9e8d3a8916c35699062899061c13bc32d5921c631a"
}
```

The one skip is the documented macOS namespace limitation. Namespace
qualification requires a Linux host. The fixture is a pinned test image, not a
customer repository or a Production workload.

## Honest disposition

This proves the repository-owned pinned Docker adversarial suite on this exact
macOS run. It does not prove Linux namespace behavior, licensed recipe
provenance, customer acceptance, or an independent AppSec review. Therefore
`HUNT-008`, `HUNT-011`, and `QUAL-CLI-004` remain unchecked.
