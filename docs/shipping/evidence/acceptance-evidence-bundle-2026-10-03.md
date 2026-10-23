# Acceptance evidence bundle — 2026-10-03

The private command `pnpm --silent acceptance:evidence:bundle` creates
`acceptance-evidence-bundle-2026-10-03.json`. It hashes twelve bounded evidence
documents and rejects secret-like material before writing the manifest.

The bundle is reproducibility evidence, not a release approval. Its explicit
open-gate boundary currently includes provider lifecycle, customer consent,
independent review, authenticated browser interaction, field Core Web Vitals,
and account deletion. It contains no source, credentials, customer data, or
reviewer signature.

The comprehension and Hunt-adjudication protocols are preregistered, but their
participant run, 100-sample adjudication, and independent sign-off remain open.
