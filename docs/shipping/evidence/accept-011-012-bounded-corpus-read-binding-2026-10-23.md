# ACCEPT-011/012 bounded corpus read binding · 2026-10-23

## Implementation

The acceptance corpus verifiers now read authorization notices, architecture
evidence, JSON/HTML reports, and contract artifacts through bounded regular-file
handles with `O_NOFOLLOW`, opened-handle identity checks, post-read size and
identity checks, and a bounded UTF-8 decode. The changed verifiers are:

- `scripts/verify-acceptance-corpus.mjs`
- `scripts/verify-public-oss-corpus.mjs`

This closes a pathname-swap/read-time integrity gap in the repository-owned
ACCEPT-011/012 verification substrate. It does not claim customer consent,
finding adjudication, independent review, or release acceptance.

## Verification

- Acceptance corpus verification: **12 fixtures** — 6 public repositories, 4
  contract artifacts, and 2 internal synthetic fixtures; all full clones,
  complete coverage, intact artifacts, and complete internal fixtures.
- Public OSS verification: **8 exact-commit fixtures**, all four required
  architecture shapes, complete coverage, and no missing shapes.
- Public OSS triage: **354 findings / 23 rule groups / 0 coverage gaps**;
  adjudication remains open by design.
- Combined acceptance contracts: **60/60 passed**.
- `node --check` and `git diff --check`: passed.
- Fresh verification and triage artifacts were written only to `/tmp`:
  - verification SHA-256
    `1ff80d8e2821bd3440d34c7edb9e1c83614e5ed0872885f1af795cacb4b6867f`
  - triage SHA-256
    `9cdca7ce104c4eac1e11834f3143ff7908925b766c9dcca64a4762c9df8d4de1`

## Boundary

`ACCEPT-011` and `ACCEPT-012` remain unchecked for their declared dependency,
held-out correction, independent review, and final acceptance conditions. No
provider, customer, Production, deployment, publication, tag, or release
action occurred. Nothing was deleted or overwritten. The live score remains
**244 checked / 36 open / 280 total (87.1%)**.
