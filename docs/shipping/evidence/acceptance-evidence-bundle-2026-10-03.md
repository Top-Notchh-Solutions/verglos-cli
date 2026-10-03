# Acceptance evidence bundle — 2026-10-03

The private command `pnpm --silent acceptance:evidence:bundle` creates
`acceptance-evidence-bundle-2026-10-03.json`. It hashes ten bounded evidence
documents and rejects secret-like material before writing the manifest.

The bundle is reproducibility evidence, not a release approval. Its explicit
open-gate boundary currently includes provider lifecycle, customer consent,
independent review, authenticated browser interaction, field Core Web Vitals,
and account deletion. It contains no source, credentials, customer data, or
reviewer signature.
