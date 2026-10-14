# Hunt independent AppSec review packet · current target refreshed 2026-10-14

This packet supersedes the historical 2026-10-02 and 2026-10-09 packets. It is
a private review request, not a security certification and not a reviewer
sign-off. The copy-paste laptop procedure is in
`hunt-appsec-reviewer-runbook-2026-10-14.md`; an npm publication is not
required.

## Exact review target

- Repository: `verglos-cli`
- Exact review commit: `ba6c75b4e1d11b59f1e6e7bf13edc3c4be02b13a`
- Review target status: public `main` at the current CLI merge. The reviewer
  must use this exact commit; do not substitute a later local working tree.
- Current public branch: `main`
- Current hosted qualification: GitHub Actions run `38550747564`
- Hosted run URL: `https://github.com/Top-Notchh-Solutions/verglos-cli/actions/runs/38550747564`
- Hosted runner: `ubuntu-latest`
- Pinned adversarial image: `postgres:15-alpine`
- Pinned image digest: `sha256:2bf082886c059b4cf5af3f9e8d3a8916c35699062899061c13bc32d5921c631a`

The reviewer must verify that the checked-out commit is exactly the commit
above before interpreting any result. Do not use a later local working tree,
uncommitted files, or a different image digest as a substitute. Follow the
runbook for the full sequence and report template.

## Scope presented for review

Review the bounded Hunt execution and Docker isolation boundary at the exact
CLI commit above. The requested conclusion is limited to whether the supplied
implementation and evidence support the documented isolation claims. It is
not a product-security certification, penetration test, customer acceptance,
or approval to execute arbitrary commands.

## Threat model

The target repository is untrusted input. Ordinary scanning must not execute
target code. Explicit Hunt execution must be recipe-bound, approval-bound,
image-digest-pinned, network-denied, non-root, source/rootfs read-only,
without host Docker socket or kernel devices, with no-new-privileges, bounded
output/time/CPU/processes/tmpfs/memory, deterministic failure classification,
cleanup, and secret/path redaction. A failed or unavailable runtime must never
become a positive exploitability verdict.

## Supplied evidence

- Current exact-head local requalification records the baseline Hunt package
  test as **78 pass / 19 explicit environment skips / 0 fail**, direct enabled
  runtime checks as **18 pass / 1 macOS namespace skip / 0 fail**, and the
  ten-family target harness as **4/4 groups pass / 0 fail**.
- The protected run `38550747564` completed successfully across the hosted
  platform matrix and retained the current technical artifacts.
- The local run used the repository's pinned image and digest. The macOS skip
  is not Linux namespace evidence; the reviewer must independently verify the
  Linux behavior.
- The supplied evidence does not establish trusted/licensed recipe
  provenance, arbitrary-command safety, Firecracker isolation, customer
  repository authorization, or production tenant safety.

## Independent reviewer procedure

The reviewer must independently:

1. Clone or otherwise obtain the public repository without receiving private tracker
   files, credentials, customer source, or browser session data.
2. Check out exactly `ba6c75b4e1d11b59f1e6e7bf13edc3c4be02b13a`.
3. Verify the pinned image digest before running the tests.
4. Run the Linux/Docker adversarial suite and retain the exact command, image
   digest, runtime versions, pass/skip/fail totals, and relevant transcript.
5. Review network, sockets, devices, namespaces, secrets, resource limits,
   cleanup, and failure classification against the threat model.
6. Record findings, residual risks, limitations, and any test that could not
   be reproduced.
7. Choose exactly one recommendation: `PASS`, `PASS WITH LIMITATIONS`, or
   `FAIL`.

The reviewer must be a real AppSec/security reviewer who did not implement
the Hunt sandbox. Founder consent or an AI-generated signature is not
independent review evidence.

## Reviewer report and sign-off

- Reviewer name / organization: ____________________________________
- Reviewer contact or approval reference: ___________________________
- Date (UTC): ____________________________________________________
- Exact commit reviewed: __________________________________________
- Scope actually reviewed: ________________________________________
- Tests and commands actually run: _________________________________
- Runtime/image/digest verified: ___________________________________
- Findings: ______________________________________________________
- Residual risks: _________________________________________________
- Recommendation: `PASS` / `PASS WITH LIMITATIONS` / `FAIL`
- Verifiable signature or approval reference: _______________________

Return the completed report privately under `docs/shipping/evidence/`.
Until the signed report exists, `HUNT-011`, `QUAL-CLI-004`, and dependent
Hunt/release rows remain open.

## How the unreleased source is run

The reviewer reviews the source workspace, not an npm registry package. From a
Linux host or Ubuntu VM, the reviewer checks out the exact commit, installs
the lockfile-pinned workspace, verifies the image digest, and follows the
copy-paste procedure in
`hunt-appsec-reviewer-runbook-2026-10-14.md`, including this bounded evidence
command:

```text
VERGLOS_HUNT_DOCKER_INTEGRATION=1 \
VERGLOS_HUNT_TEST_IMAGE=postgres:15-alpine \
VERGLOS_HUNT_TEST_DIGEST=sha256:2bf082886c059b4cf5af3f9e8d3a8916c35699062899061c13bc32d5921c631a \
node scripts/hunt-adversarial-evidence.mjs /tmp/verglos-hunt-review
```

The reviewer records the actual commands and environment used rather than
copying the repository-owned result. A Mac-only Docker Desktop run may keep
the Linux namespace checks as skips and therefore cannot by itself establish
the full Linux qualification.
