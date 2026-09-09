# Verglos detect-secrets Baseline Importer

Baseline import is JSON-only and preserves detector plugins, generated time,
reviewed finding state, and exact source-byte digest. It never installs Python,
invokes detect-secrets, or treats a reviewed baseline entry as a native secret
verification claim.
