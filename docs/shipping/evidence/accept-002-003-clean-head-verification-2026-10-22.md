# ACCEPT-002/003 clean-head story verification — 2026-10-22

## Implementation

Private commit `c4e3da67` hardens `scripts/verify-acceptance-stories.mjs` to
require explicitly selected clean Git worktrees and to record their exact
commit/status in the result. It no longer treats a dirty parent checkout as a
reproducible current-head source.

## Verification

The verifier ran against CLI `5072204f9164c0f2b2e846dde98ee2a1c8d7bf89` and
Web `cb2302179533a7bc73eccbcb17b0c350685cc5cc`, both recorded `clean`:

- CLI package suite: **310/312 passed**, **2 explicit skips**, 0 failures;
- Web full suite: **949/979 passed**, **30 explicit skips**, 0 failures;
- composed Studio/Enterprise/Team/quality substrates: **74/74 passed**;
- all **12/12** story mappings executed; process exit **0**.

The machine-readable result is
`acceptance-stories-verification-2026-10-22.json`. This is reproducible
repository substrate evidence; it does not turn hosted/customer/provider or
reviewer acceptance into a local pass.
