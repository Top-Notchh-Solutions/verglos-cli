# Hunt Docker adversarial evidence — 2026-10-07

- **Source commit:** `67debee964c0c6be736d247793ec1d6faa7babb9`
- **Command:** `pnpm --filter @verglos/hunt test`, through
  `scripts/hunt-adversarial-evidence.mjs`
- **Runtime:** macOS arm64, Node `v26.4.0`
- **Pinned image:** `postgres:15-alpine@sha256:2bf082886c059b4cf5af3f9e8d3a8916c35699062899061c13bc32d5921c631a`
- **Result:** 60 pass / 1 explicit skip / 0 failures; exit code 0; elapsed
  9.5 seconds.
- **Skip:** PID/IPC namespace assertions require a Linux host; this macOS run
  records that limitation explicitly.

This is repeatable local/CI adversarial-suite evidence only. It is not an
independent security review, customer-repository qualification, or production
isolation claim. HUNT-011 and QUAL-CLI-004 remain open.
