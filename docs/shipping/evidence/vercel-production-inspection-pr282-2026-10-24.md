# Vercel Production deployment inspection · Web PR #282 · 2026-10-24

## Observed provider state

- Deployment: `dpl_7xFLAALkYPWAiDj8foH1qdq2Caza`
- Target: `production`
- Ready state: `READY`
- Aliases: `verglos.com`, `www.verglos.com`, `verglos-web.vercel.app`, and the
  two Vercel Git/main aliases returned by the provider
- Build region: `sfo1`
- Framework: Next.js
- Build command: `pnpm config:check && pnpm build`
- Vercel build Node: `24.x`; deployed function runtimes inspected as
  `nodejs22.x` and `nodejs24.x`

The read-only command was:

```text
vercel inspect dpl_7xFLAALkYPWAiDj8foH1qdq2Caza --json
```

This confirms the provider's current Production deployment is READY and that
the merged Web deployment is serving the expected aliases. The separate
HTTP route sweep remains the response-level receipt in
`vercel-production-smoke-pr282-2026-10-24.md`.

## Boundary

This was a read-only provider inspection. No deployment, alias, environment,
database, payment, webhook, customer, deletion, npm, tag, release, or GitHub
Actions operation was performed. It advances provider-state evidence for
`FINAL-WEB-007`/`FINAL-WEB-008` only. Human/field evidence, recipient/customer
acceptance, independent review, AppSec/Hunt review, and final release sign-off
remain separate gates; no checkbox changed.
