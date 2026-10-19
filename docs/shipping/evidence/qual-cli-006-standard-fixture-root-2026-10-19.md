# QUAL-CLI-006 standard-validation fixture-root hardening · 2026-10-19

## Scope

This packet records a real CLI qualification-boundary fix. It does not claim
official validator availability, trusted keyless publication, legal clearance,
independent AppSec review, or final release acceptance.

## Source and contribution

- Repository: `Top-Notchh-Solutions/verglos-cli`
- Base: `origin/main` at `0823b513f2b1810ad9f6afcb8806ba46f61feedb`
- Implementation: `23280174` · `fix(cli): confine standard validation fixtures`
- Regression coverage: `cbb07472` · `test(cli): reject external Sigstore fixtures`
- Pull request: https://github.com/Top-Notchh-Solutions/verglos-cli/pull/154
- Branch: `codex/qual-cli-006-sigstore-root-20261019`

## Original logic changed

The exported standard-validation runner previously resolved configured
Sigstore payload, bundle, key, and trusted-root paths without checking that
they belonged to the declared artifact directory. It now rejects lexical
outside-root paths and resolved symlink escapes before any external validator
is invoked. The validator continues to use bounded regular-file checks,
argv-only execution, time/output limits, and redacted status results.

## Verification

- `node --test scripts/verify-standard-validation.test.mjs scripts/standard-validation-contract.test.mjs`: **10/10 pass**, 0 fail, 0 skip.
- Regression proves an outside-root Sigstore payload is classified as
  `sigstore-fixture-outside-root` and is not passed to the external tool.
- `git diff --check`: pass.

## Disposition

`QUAL-CLI-006` remains unchecked. Trusted keyless Sigstore/Fulcio/Rekor
identity, protected publication, legal clearance, independent AppSec review,
and final acceptance remain open. Score remains **239 checked / 41 open / 280
total (85.4%)**. No AppSec checkbox, provider state, npm state, production
state, or customer acceptance state changed.
