# Verglos V1 release gates

## Gate 0 — Truth and scope

- Current capability registry reconciled with code/tests.
- Every command and plan has a shipped/partial/planned label.
- Open-core, premium content, third-party licenses, notices, and trademark boundaries reviewed.

## Gate 1 — Evidence correctness

- Subject identity is immutable and digest-bound.
- Native and imported observations preserve attribution.
- Duplicate, malformed, stale, and mismatched evidence tests pass.
- Engine absence/staleness yields `INCOMPLETE`, never false `PASS`.

## Gate 2 — Security and agent safety

- No target-code execution during ordinary scanning.
- Hunt recipes are signed, bounded, isolated, redacted, and network-denied by default.
- SSRF, path traversal, archive bomb, symlink, malformed input, resource exhaustion, webhook, and tenant-boundary tests pass.

## Gate 3 — Product and UX

- Local viewer answers release decision before deep evidence.
- Developer, lead, client, and procurement views are understandable without founder explanation.
- Keyboard, screen reader, contrast, reduced motion, and machine-readable alternatives pass.

## Gate 4 — Commercial and operations

- Server-side seats, quotas, retention, overages, billing, and modified-CLI tests pass.
- Idempotency, retries, dead letters, restore drill, rollback, alert delivery, and monitoring pass.
- Per-plan hosted COGS and support cost are measured; no unbounded managed execution exists.

## Gate 5 — Distribution and licensing

- Clean install/upgrade/rollback on supported macOS, Linux, and Windows architectures.
- Trusted npm provenance, dependency SBOM, `THIRD_PARTY_NOTICES`, license validation, attribution, and modification notices are complete.
- Current state (2026-09-12): OPEN. LIC-001 and LIC-004 engineering acceptance is complete and CI-verified; all six npm archives stage LICENSE/THIRD_PARTY_NOTICES and release evidence includes deterministic SBOMs/checksums/clean-consumer verification. Publishing remains fail-closed because the nested `benchmark@1.0.0` ISC/BSD-3-Clause conflict needs review; LIC-002 external content records, web redistribution review, release-note qualification, protected publish controls, and full amd64/arm64 install/rollback evidence remain open.

## Gate 6 — External acceptance

- Feature-complete release candidate tested against frozen public and authorized repositories/artifacts.
- Acceptance stories in `VERGLOS_FINAL_ACCEPTANCE_AND_POC.md` pass.
- Truth registry, docs, dashboard labels, pricing copy, and campaign claims updated only after evidence review.
