# STUDIO-CLI-001 client projection workflow — 2026-10-06

CLI PR #64 (`468bdc0`) merged as `1fa878dd8516785bea5cfeaf3ad2b23b98ee5428`.

The shared contract and CLI command now validate a redacted client projection
before any future upload: organization, client workspace, and record digest
must bind exactly; private/source/finding/signature fields are refused; payloads
are bounded to 256 KiB; an explicit time-bounded approval is required; and the
accepted projection receives a deterministic SHA-256 digest. The command is
`verglos record project-client` and emits a bounded machine-readable preview.

Verification: shared projection tests 3/3, CLI projection/policy tests 3/3,
shared and CLI typecheck/build, and diff check passed. Hosted platform matrix
run `37455398105` passed all nine Ubuntu/macOS/Windows × Node 20/22/24 cells;
Self-scan `37455398273` and in-toto binding passed.

STUDIO-CLI-001 remains unchecked. Upload transport, Web admission/persistence,
and customer acceptance evidence are not present. No production or database
write occurred.

