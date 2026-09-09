# Verglos Engine Manifest

Engine manifests are signed compatibility records for platform artifacts. Each
artifact has an immutable SHA-256 digest, bounded size, source URL, license,
platform, and CLI compatibility range. Optional rollback metadata points to a
previous manifest by digest. Signature fields identify the verification key;
cryptographic verification and trust-root policy remain separate release gates.
