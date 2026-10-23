# ACCEPT-003 bundle integrity verification — 2026-10-23

The current additive bundle
`acceptance-evidence-bundle-2026-10-23-source-queue-audit.json` was verified
without rewriting it. The verification recomputed the manifest digest from the
ordered file metadata, opened every listed evidence file, and checked each
listed byte count and SHA-256.

Command: an isolated Node.js read-only verifier over the private shipping root.

Result:

- schema: `verglos.private.acceptance-evidence-bundle.v1`
- files verified: **175/175**
- manifest: `sha256:85fb43c459de28ac2256f8995fdbbf8bfa500d4d0422c61c01b9283a5c66de00`
- bundle-builder secret scan: passed

This verifies reproducibility and byte integrity for `ACCEPT-003` only. It
does not create reviewer sign-off, hosted/provider evidence, customer
acceptance, independent review, or final release approval. No backlog checkbox,
provider, Production, publication, customer, or release state changed.
