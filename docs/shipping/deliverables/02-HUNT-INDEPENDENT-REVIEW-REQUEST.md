
# Hunt independent review request

**Private working packet — HUNT-011, QUAL-CLI-004**

## The reviewer packet already exists

Use:

    docs/shipping/evidence/hunt-independent-review-packet-2026-10-09.md

It targets:

- repository: verglos-cli;
- exact commit: 8bea4be2fa18533eafd088122be769e942965626;
- pinned Docker image and digest in the packet;
- Linux/Docker adversarial tests.

## What the reviewer must return

A real AppSec/security reviewer who did not implement Hunt must provide:

- name, organization, role, and verifiable contact/approval reference;
- exact commit and image digest checked;
- commands/tests actually run;
- network, sockets, devices, namespaces, privilege, and host-socket results;
- secrets/path/output redaction result;
- CPU, memory, disk, process, output, and time-limit result;
- cleanup after success, timeout, signal, and failure;
- failure classification and residual risks;
- one recommendation: PASS, PASS WITH LIMITATIONS, or FAIL;
- signature or verifiable approval reference.

## Message you can send to a reviewer

> Verglos is requesting an independent, bounded review of its Hunt sandbox.
> Please review the exact CLI commit and private review packet supplied,
> independently run the Linux/Docker adversarial tests, and report network,
> sockets, devices, namespaces, secrets, resource limits, cleanup, and failure
> handling. You did not implement the sandbox. Please return findings,
> residual risks, and exactly one recommendation: PASS, PASS WITH LIMITATIONS,
> or FAIL. This is not a request for a general product-security
> certification or permission to run arbitrary commands.

## Storage

Store the completed report privately at:

    docs/shipping/evidence/hunt-independent-review-<date>.md

Codex can prepare the packet, compare the report with the implementation, and
record limitations. Codex cannot sign as the independent reviewer.

## Current status

Engineering evidence exists. The missing deliverable is the real independent
run and signed report. No commit information is required from the founder.

