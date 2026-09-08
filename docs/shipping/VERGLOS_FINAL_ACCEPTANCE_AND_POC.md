# V1 acceptance and post-build POC

## Sequencing

The external POC is last. It begins only after the feature-complete release candidate passes security, reliability, licensing, billing, cross-platform, accessibility, and migration gates.

## Corpus

Freeze 10–20 public repositories and customer-authorized fixtures at exact commits/digests. Retain license/NOTICE metadata. Never expose intentionally vulnerable fixtures to the public internet. Include JS/TS source, lockfiles, Docker/OCI, IaC, SBOM, Trivy, detect-secrets, SARIF, and provenance cases where available.

## Acceptance stories

1. A Free user scans locally without signup or source upload.
2. A CI run emits deterministic SARIF/JSON and blocks a critical finding.
3. Trivy output imports without Trivy-specific fields leaking into policy or records.
4. A duplicate finding from three tools becomes one canonical observation with lineage.
5. A source commit and image digest mismatch produces `INCOMPLETE`, never `PASS`.
6. A policy exception has owner, reason, expiry, and audit history.
7. A supported Hunt verdict records isolation and limitations.
8. A `.vgl` record verifies offline after dashboard outage and engine upgrade.
9. Pro limits are enforced server-side against a modified/untrusted CLI.
10. Studio recipient verifies a redacted record without dashboard membership.
11. Enterprise private runner sends only the configured evidence projection.
12. Deleting an account does not invalidate customer-held signed records.

## External validation questions

- Where do your existing scanner outputs become one release decision?
- Which artifacts do you already produce: SARIF, SBOM, VEX, provenance, image metadata?
- What do you still reconcile manually between source, CI, image, and deployment?
- Would local processing plus imported evidence reduce review friction?

## Go/no-go

Go only if all critical acceptance stories pass, no `INCOMPLETE` path can produce `PASS`, at least one authorized team can reproduce the workflow, and the public truth registry matches the released capability registry. Reddit validation tests the problem and message; it does not replace technical acceptance.
