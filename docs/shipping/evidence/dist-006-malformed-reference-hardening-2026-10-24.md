# DIST-006 malformed rollback-reference hardening · 2026-10-24

## Implementation

The shared release rollback decision contract now validates untrusted runtime
reference shapes before reading their fields. Malformed or null current/target
references return bounded `current-reference-invalid` or
`target-reference-invalid` decisions instead of throwing. Valid references
retain the existing kind, immutable-reference, approval, history-preservation,
and replacement-identity rules.

Code commit `cf9ab336e94757c143874ac7b586966f81efaa74` merged normally in CLI
PR [#368](https://github.com/Top-Notchh-Solutions/verglos-cli/pull/368) as
`0b789716a3120f9716aa55036932fb1f2f6f6c9e`.

## Verification

- Shared package suite exited successfully, including the new malformed
  runtime-reference regression.
- Shared typecheck passed.
- Shared build passed.
- CLI rollback-plan tests passed **8/8**.
- No provider rollback/revocation, registry write, signing action, Vercel
  mutation, publication, or paid Actions run occurred.

## Shipping boundary

This is code-side fail-closed implementation evidence for DIST-006. The row
remains unchecked for real authenticated provider/Production rollback or
revocation, operational review, and final release acceptance. Score remains
**246 checked / 34 open / 280 total (87.9%)**, split **13 AppSec-dependent /
21 non-AppSec**. Nothing was deleted or overwritten.
