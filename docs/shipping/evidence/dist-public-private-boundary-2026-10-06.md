# Public archive private-dependency boundary — 2026-10-06

CLI PR #69 (`ad6ee14`) merged as `b684eba8cf1d9874f14af39b488c2bfacfa13969`.

The public archive packer now reads all workspace manifests and fails closed
when a public package declares a dependency on a private workspace package.
This protects clean npm archives from accidentally shipping or requiring
internal-only surfaces. A regression contract test covers the guard.

Verification: local pack test 2/2 passed; hosted run `37464586376` passed the
full Ubuntu/macOS/Windows × Node 20/22/24 matrix, clean consumer, upgrade /
rollback qualification, self-scan, and in-toto binding. No production,
customer, or database state was accessed. DIST-001 remains open because final
release/legal qualification and dependent product surfaces are not complete.
