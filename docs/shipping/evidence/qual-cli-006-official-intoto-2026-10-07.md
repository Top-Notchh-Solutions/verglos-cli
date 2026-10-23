# QUAL-CLI-006 official in-toto artifact binding · 2026-10-07

- **Source/verifier:** CLI `origin/main` and the disposable verifier worktree
  were both exact commit
  `6bde945c60ac34351c02a70f6e7a2cb24f98ae1d`.
- **Command:** A bounded disposable `python:3.12-slim` container installed
  pinned official `in-toto==3.0.0` and ran
  `scripts/verify-in-toto-release.py` against the six existing public archives.
  The command exited 0 and reported: `in-toto release binding verified: 6
  archives with exact SHA-256 products`.
- **Archive hashes:**
  - `verglos-2.0.0-alpha.1.tgz` —
    `504fa1bda2e71a6bec7ec3f951aaec93f74892bc41015b9b72ff30bf23855c68`
  - `verglos-entitlement-2.0.0-alpha.1.tgz` —
    `a8bbbc4cc6511348620cd4f3c9e686f33415a7b6daee35a267da581c34d3e346`
  - `verglos-mcp-2.0.0-alpha.1.tgz` —
    `f399a2536357fbb88cb9aeece74fac0fcbe4cb1e96420daf66669059560b95f1`
  - `verglos-reporter-2.0.0-alpha.1.tgz` —
    `e5b875ce8a159c021c86fe99c0e965c76ff55c45d8e8574ba3c89e14bf02c65b`
  - `verglos-scanner-2.0.0-alpha.1.tgz` —
    `c66f26e08f53a11b65f40412269952eb66578aba7738dc6c15cdfc0f48ebddaf`
  - `verglos-shared-2.0.0-alpha.1.tgz` —
    `0b279ac70760c94cef2f661b3974c57bc51945fefe97437183c4140b3f1a6100`
- **Boundary:** This verifies official in-toto layout/link signatures and exact
  archive products with ephemeral keys in a disposable container. It is not
  trusted keyless Sigstore/Fulcio/Rekor identity evidence, legal clearance,
  protected npm publication, or final release acceptance. QUAL-CLI-006 remains
  unchecked and no public release, tag, deployment, or publication occurred.
