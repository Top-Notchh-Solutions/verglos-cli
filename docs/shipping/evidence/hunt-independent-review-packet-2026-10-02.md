# Hunt independent review packet · 2026-10-02

## Scope presented for review

Review the bounded Hunt execution and Docker isolation boundary in Verglos CLI at merge head `b781bc41539df3870769996426c03e9209a08ab7` (CLI PR #55). The requested conclusion is limited to whether the supplied implementation and evidence support the documented isolation claims; it is not a product-security certification.

## Threat model

The target repository is untrusted input. Ordinary scanning must not execute target code. Explicit Hunt execution must be recipe-bound, approval-bound, image-digest-pinned, network-denied, non-root, source/rootfs read-only, without host Docker socket or kernel devices, with no-new-privileges, bounded output/time/CPU/processes/tmpfs/memory, deterministic failure classification, cleanup, and secret/path redaction. A failed or unavailable runtime must never become a positive exploitability verdict.

## Exact implementation and runtime evidence

- CLI merge head: `b781bc41539df3870769996426c03e9209a08ab7`.
- Manual hosted `main` self-scan: GitHub Actions run `36984993552`.
- Hosted runner: `ubuntu-latest`.
- Hosted pinned image: `postgres:15-alpine@sha256:2bf082886c059b4cf5af3f9e8d3a8916c35699062899061c13bc32d5921c631a`.
- Hosted Hunt transcript artifact: `hunt-docker-adversarial-ded46a8fbf08770f05d952f91b92b99b95b03e1c` (GitHub artifact ID `11216049055`, run-retained artifact).
- Local supplementary image: `alpine@sha256:d9e853e87e55526f6b2917df91a2115c36dd7c696a35be12163d44e6e2a4b6bc`.
- Local package run: `VERGLOS_HUNT_DOCKER_INTEGRATION=1 VERGLOS_HUNT_TEST_IMAGE=alpine VERGLOS_HUNT_TEST_DIGEST=sha256:d9e853e87e55526f6b2917df91a2115c36dd7c696a35be12163d44e6e2a4b6bc packages/cli/node_modules/.bin/tsx --test packages/hunt/src/*.test.ts`.

## Results

- Hosted self-scan completed successfully.
- Hosted pinned Docker adversarial suite passed, including private PID and IPC namespaces on Linux, network denial, no socket/device exposure, non-root, read-only mounts/rootfs, no-new-privileges, redaction, output/time/CPU/process/disk/memory bounds, and signal classification.
- Local supplementary run: 55 pass / 1 macOS-only namespace skip / 0 failures; the hosted Linux run is the authoritative namespace evidence.
- Full hosted self-scan also passed build, package archives, clean consumer install, release verifier, typecheck, package/public-boundary audits, and self-scan.

## Commands/results to reproduce

1. `gh run view 36984993552 --repo Top-Notchh-Solutions/verglos-cli --log` — inspect the hosted transcript and artifact upload.
2. On Linux with Docker and the exact digest available, run the local package command above.
3. Inspect the Hunt runtime adversarial test files under `packages/hunt/src/` and compare every runtime flag with the emitted transcript.

## Known limitations and open boundaries

- Recipe execution/provenance and licensed recipe-feed provenance are separate open gates.
- The local macOS run cannot establish Linux host namespace behavior; the hosted Ubuntu run supplies that evidence.
- No reviewer has yet independently reproduced or signed this packet.
- No claim is made about arbitrary commands, Firecracker, customer repositories, or production tenant data.

## Independent reviewer sign-off

- Reviewer name / organization: ____________________________________
- Reviewer contact: _______________________________________________
- Date (UTC): ____________________________________________________
- Scope actually reviewed: ________________________________________
- Tests actually run: _____________________________________________
- Findings: ______________________________________________________
- Residual risks: _________________________________________________
- Recommendation:  PASS / PASS WITH LIMITATIONS / FAIL
- Signature or verifiable approval reference: _______________________
