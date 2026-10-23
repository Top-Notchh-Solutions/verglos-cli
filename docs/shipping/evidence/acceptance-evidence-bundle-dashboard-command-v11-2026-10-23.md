# Acceptance evidence bundle v11 · 2026-10-23

The prior CLI-full-test bundle v10 was found to reference an older byte count
for `cli-workspace-full-test-2026-10-23.md`. It was retained unchanged. This
additive v11 bundle was regenerated from the current checked-in evidence and
adds the merged QUAL-WEB-006 dashboard-capture command evidence.

- file count: **187**
- manifest: `sha256:339afa1e60b7280fe65f4188c515c019cb2844c0f976dc13da9dcf7d50cb5e0c`
- verifier mismatch count: **0**
- manifest match: **yes**
- secret scan: **passed**
- open gates: provider lifecycle, customer consent, independent review,
  authenticated browser, field CWV, and account deletion

Commands:

```text
node --test scripts/build-acceptance-evidence-bundle.test.mjs scripts/verify-acceptance-evidence-bundle.test.mjs
VERGLOS_ACCEPTANCE_BUNDLE_OUTPUT=docs/shipping/evidence/acceptance-evidence-bundle-2026-10-23-dashboard-command-v11.json pnpm acceptance:evidence:bundle
node scripts/verify-acceptance-evidence-bundle.mjs docs/shipping/evidence/acceptance-evidence-bundle-2026-10-23-dashboard-command-v11.json
```

This repairs evidence integrity only. It does not close any backlog checkbox
or infer provider, customer, reviewer, field, or release action.
