# Hunt A2 Docker assurance disclosure — PR #98

Date: 2026-10-13  
Owner: Top Notchh Solutions release owner  
Public repository: `Top-Notchh-Solutions/verglos-cli`  
Pull request: #98  
Merged commit: `e6e3c0f12a31f9d6084cb772291dcb2abec02a05`

## What changed

The public Hunt Docker adapter now attaches explicit A2 assurance metadata to
each Docker outcome:

- container assurance class: `A2`
- read-only project input
- denied network
- dropped capabilities
- bounded process/resource settings
- an explicit limitation stating that host Docker-daemon/VM policy and
  platform-specific kernel differences are outside the result

The public README and `packages/hunt/README.md` explain the same boundary.
The change does not claim target-code recipe execution, autonomous AI agents,
or completion of HUNT-008.

## Verification

The following passed before merge:

- `pnpm --filter @verglos/hunt typecheck`
- `pnpm --filter @verglos/hunt test`
- `pnpm build` (8/8 tasks)
- complete CLI test process
- `git diff --check`
- protected macOS, Ubuntu, and Windows Node 20/22/24 checks
- Verglos self-scan
- in-toto release binding

Sixteen existing Linux/Docker integration cases remain explicit skips pending
their pinned integration image and Linux isolation run. This evidence is a
public-code qualification record, not a substitute for that run.

## Acceptance effect

This is a completed implementation/verification slice and is merged safely to
the public repository. It does not satisfy the full HUNT-008 acceptance row,
which still requires target-code recipe families, provenance/licensing and
supported-rule approval, entitlement wiring, required isolation qualification,
review evidence, and final release treatment. No backlog checkbox changed.

Score after recording: **228 checked / 52 unchecked / 280 total (81.4%)**.
