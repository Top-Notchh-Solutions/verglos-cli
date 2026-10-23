# ACCEPT-003 reusable bundle verifier · 2026-10-23

## Implementation

Private `scripts/verify-acceptance-evidence-bundle.mjs` now verifies the
acceptance bundle as a checked-in command. It validates the schema, canonical
sorted/unique safe paths, regular-file identity, bounded reads, byte counts,
per-file SHA-256 values, canonical manifest SHA-256, and secret-like material.
It emits a bounded JSON report and exits non-zero on any mismatch or failed
invariant. The package command is:

```text
pnpm acceptance:evidence:verify <bundle.json>
```

## Verification

- Verifier regression tests: **4/4 passed**.
- Existing bundle-builder regression tests: **5/5 passed**.
- Current v4 packet verification: **179 files / 0 mismatches / manifest
  matched / secret scan passed**.
- Current v4 manifest:
  `sha256:358cd4820cc38425eb2945f2b345c3b183e7d37e3430145cd4a110239209c603`.

## Disposition

This advances ACCEPT-003 implementation and reproducibility only. It does not
provide reviewer, hosted/provider, customer, browser, field-performance,
account-deletion, independent-review, AppSec/Hunt, or final-release
acceptance. No external state was changed and nothing was deleted or
overwritten.
