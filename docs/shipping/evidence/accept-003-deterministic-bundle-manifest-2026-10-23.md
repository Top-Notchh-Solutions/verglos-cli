# ACCEPT-003 deterministic evidence-bundle manifest · 2026-10-23

## Implementation

Private commit `97bf5989` hardens
`scripts/build-acceptance-evidence-bundle.mjs` and adds its focused contract
tests. The builder now:

- rejects duplicate evidence paths and paths that escape the bundle root;
- sorts entries before hashing so equivalent input order produces the same
  manifest;
- rejects secret-like evidence content; and
- emits a deterministic `manifestSha256` over the unique file metadata.

The duplicate current-list entry for
`qual-web-006-current-head-requalification-2026-10-22.md` was removed; no
evidence file was deleted—the path was previously listed twice.

## Verification

- Bundle-builder contract tests: **3 passed / 0 failed**.
- Adjacent correction-loop, corpus-triage, and final-regression contracts:
  **13 passed / 0 failed**.
- Combined focused result: **16 passed / 0 failed**.
- Syntax and `git diff --check`: passed.

The regenerated bundle contains 133 unique files, has a passing secret scan,
and records its content-manifest digest in the bundle itself. Provider,
customer, independent-review, browser, field-CWV, and account-deletion gates
remain open. No provider, customer, Production, publication, deployment, or
release action occurred; nothing was deleted or overwritten.
