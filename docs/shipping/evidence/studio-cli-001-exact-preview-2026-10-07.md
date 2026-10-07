# STUDIO-CLI-001 exact-preview upload boundary — 2026-10-07

## Implementation

- Existing main substrate: `1fa878d` (`project-client` command)
- Hardening commit: `fdaec852652425806ba20e6b95b03617ab0c06df`
- Public PR: CLI #77
- Merge commit: `de92976d3790fef1bd4ce0cf00e9e589ae603974`

The client projection boundary now accepts only explicit safe fields, rejects
unknown/private/nested fields and raw limitations, and requires an explicit
`client-projection-upload` approval bound to organization, client workspace,
record digest, expiry window, and the exact canonical preview digest.

## Verification

- Shared focused client-projection tests: **4/4**
- CLI focused process test: **1/1**
- Shared and CLI typecheck/build: pass
- Shared full suite: exit 0
- CLI full configured suite: exit 0
- Public-boundary audit and diff check: pass

## Limitation

This is code-side Studio progress, not final acceptance. Hosted upload/custody,
client-workspace route integration, independent redaction proof, and Studio
recipient/customer acceptance remain open.
