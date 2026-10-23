# ACCEPT-003 current-head Preview bundle · 2026-10-24

The additive ACCEPT-003 evidence bundle was regenerated after the current Web
Preview provider receipt was merged into the private shipping ledger.

## Verification

```text
VERGLOS_ACCEPTANCE_BUNDLE_OUTPUT=docs/shipping/evidence/acceptance-evidence-bundle-2026-10-24-current-head-preview.json pnpm --silent acceptance:evidence:bundle
node scripts/verify-acceptance-evidence-bundle.mjs docs/shipping/evidence/acceptance-evidence-bundle-2026-10-24-current-head-preview.json
```

Result:

- **197/197** bounded evidence files hashed;
- manifest: `sha256:e1bc6c513cdd3c884a6815ab3c7b4e9033925636e5b51444bd9761408d152008`;
- per-file mismatches: **0**;
- manifest recomputation: passed;
- secret-like material scan: passed;
- included provider receipt: `docs/shipping/evidence/vercel-web-current-head-preview-2026-10-23.md`.

## Boundary

This is reproducibility and current Preview-provider evidence for ACCEPT-003.
The bundle still records provider lifecycle, customer consent, independent
review, authenticated-browser, field-CWV, and account-deletion gates as open.
It does not create Production publication, customer/recipient acceptance,
independent review, or final release approval. No backlog checkbox changed.

