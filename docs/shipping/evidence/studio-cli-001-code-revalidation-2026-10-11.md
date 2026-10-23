# STUDIO-CLI-001 code revalidation — 2026-10-11

## Code-side result

The current CLI head `2b05390f99811fb70f4dcdc1fca0b9662ed79f2c` still contains
the reviewed `record project-client` workflow. It admits only the bounded
allowlist, binds organization/workspace/record and projection digests, refuses
private/source/finding/unknown/nested fields, and requires an explicit
time-bounded upload approval. The command previews the projection and does
not upload by default.

The existing hosted custody implementation is Web `e3e416d`; its isolated
Test Database migration and route qualification are recorded in
`docs/shipping/evidence/studio-cli-001-hosted-custody-block-2026-10-10.md`.

## Verification

- Shared client-projection tests: **4 passed / 0 failed**.
- CLI client-projection command test: **1 passed / 0 failed**.
- The full CLI package test process at the same head exited **0**.
- Shared and CLI typechecks/builds: **passed**.
- `git diff --check`: **passed**.

## Acceptance boundary

`STUDIO-CLI-001` remains unchecked. The missing evidence is an independent
proof that the hosted recipient preserves the local redaction boundary and a
real authorized Studio recipient/customer acceptance run. Founder consent or
local tests cannot be substituted for those recipient-side observations.

No Production, provider, entitlement, account, customer, or public deployment
write was made by this recheck. `LIC-002` is the next dependency-ready item
after this blocked record.
