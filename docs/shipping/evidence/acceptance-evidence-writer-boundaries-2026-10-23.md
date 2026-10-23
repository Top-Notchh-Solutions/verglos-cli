# Acceptance evidence-writer boundaries · 2026-10-23

The private acceptance-story verifier and acceptance-evidence bundle builder
now create their JSON outputs with exclusive `wx` semantics. A second run
against an existing output fails with `EEXIST`; it cannot replace the prior
evidence. The current bundle input list also includes the two new acceptance
boundary evidence records while preserving the historical entries.

Verification completed:

- `node --check scripts/build-acceptance-evidence-bundle.mjs`
- `node --check scripts/verify-acceptance-stories.mjs`
- isolated bundle-writer run: first write passed, second write failed with
  `EEXIST`, and the original output remained byte-for-byte unchanged;
- `git diff --check` passed.

This is code-side progress for `ACCEPT-003` and its story-verification
substrate only. It does not create reviewer, customer, participant, provider,
independent-review, publication, or final-release evidence. No backlog
checkbox changed; the live score remains **244 checked / 36 open / 280 total
(87.1%)**. No user data, repository, branch, release, provider record, or
prior evidence was deleted or overwritten; the isolated test removed only its
temporary directory.
