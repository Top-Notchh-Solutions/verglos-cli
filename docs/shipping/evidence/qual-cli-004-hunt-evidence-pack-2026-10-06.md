# QUAL-CLI-004 Hunt isolation evidence pack — 2026-10-06

CLI PR #66 (`d3c0df0`) merged as `e62ae12ee93828bb8c2855bf4103cad98ccbf3b8`.

The Self-scan workflow now emits a structured evidence report alongside the
raw TAP log. The report binds the exact source commit, platform/runtime,
pinned `postgres:15-alpine` harness image digest, command, pass/skip/fail
totals, and explicit limitations. The local pinned run produced 55 passing
checks, one explicit macOS namespace skip, and zero failures. Hosted platform
run `37458869285` passed all nine Ubuntu/macOS/Windows × Node 20/22/24 cells
and the in-toto release binding; the first Windows Node 20 attempt hit a
runner `EBUSY` cleanup race and the failed cell was rerun successfully.

This is repeatable isolation evidence, not an independent security review.
Linux namespace assertions remain host-dependent, and the pinned image is a
harness fixture rather than a customer workload. QUAL-CLI-004 therefore stays
unchecked pending independent review and final Hunt recipe/provenance gates.
No production or customer data was accessed.
