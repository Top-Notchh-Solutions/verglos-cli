# Hunt Docker hosted Linux qualification — 2026-10-06

Authoritative hosted evidence: GitHub Actions Self-scan run `37113682760`,
head `18ab8e7da3003186b80346c3ee4a58c5d8211626`, conclusion `success`, with
artifact `hunt-docker-adversarial-18ab8e7da3003186b80346c3ee4a58c5d8211626`.
The workflow ran on `ubuntu-latest` using its pinned
`postgres:15-alpine@sha256:2bf082886c059b4cf5af3f9e8d3a8916c35699062899061c13bc32d5921c631a`
test image and `VERGLOS_HUNT_DOCKER_INTEGRATION=1`.

The uploaded log shows the Docker runtime adversarial group passing **16/16**,
including the PID and IPC namespace-private check that is unavailable from the
local macOS host. The surrounding Docker invocation/runner/adapter and Hunt
contract groups also passed with zero failures.

This closes the specific hosted Linux namespace evidence gap, but not the full
HUNT-011 acceptance item: trusted recipe publisher roots, supported recipe
coverage, independent review, and the beta-gated command still remain open.
The hosted run is evidence only; no production write, deployment, publication,
or backlog checkbox change occurred in this session.
