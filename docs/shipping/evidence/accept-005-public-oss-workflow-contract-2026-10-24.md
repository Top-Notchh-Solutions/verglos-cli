# ACCEPT-005 owner-authorized public-OSS workflow contract · 2026-10-24

## Implementation

The authorized-workflow validator now distinguishes the approved local public
open-source benchmark path from a real external-repository-owner workflow.
`subjectKind: owner-authorized-public-oss` requires an exact repository commit,
owner authorization, bounded scope, and a license/terms evidence digest. It
keeps the existing no-source-upload, redaction, retention, expiry, and bounded
evidence checks, and it always emits `customerAcceptance: not-claimed`.

The external customer-owner path is unchanged. A public OSS fixture cannot
produce customer, recipient, commercial, independent-review, or final-release
acceptance merely by passing this validator.


## Verification

- `scripts/validate-authorized-workflow.test.mjs`: **9/9** passed;
- public-OSS acceptance requires a valid license identifier and SHA-256 terms
  evidence digest;
- malformed or missing license binding is rejected;
- public-OSS output reports `publicOssBenchmark: authorized` and
  `customerAcceptance: not-claimed`;
- syntax and `git diff --check`: passed.

No external repository was contacted, no provider or Production state changed,
and no customer acceptance was inferred. The public-OSS benchmark path is now
represented explicitly in code; the separate external POC/recipient gate
remains open.
