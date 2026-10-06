# DIST-006 rollback planning command — 2026-10-06

CLI PR #65 (`fc05fb4`) merged as `7946234a2072e12ca804b6f2c0948f5540ad4903`.

`verglos release rollback-plan` now exposes the existing fail-closed rollback
decision contract without performing provider writes. It requires explicit
approval, same-kind immutable current/target references, a bounded reason, and
historical-record preservation; signing-identity revocation additionally
requires a distinct replacement identity. Machine output contains the decision
only, not credentials or provider payloads.

Verification: focused command tests 2/2, CLI typecheck/build, and diff check
passed. Hosted platform matrix run `37456567078` passed all nine Ubuntu/macOS/
Windows × Node 20/22/24 cells after rerunning a transient Windows Node 24
toolchain crash; Self-scan and in-toto binding passed.

DIST-006 remains unchecked. Provider/registry/deployment execution, audit,
recovery, and independent rollback qualification have not been performed. No
production or database write occurred.

