# Verglos Local OCI Layout Resolver

Local OCI layouts are resolved offline from `oci-layout.json`, `index.json`,
and content-addressed `blobs/sha256` files. The reader requires one manifest
descriptor, verifies blob bytes against its digest before parsing, and rejects
missing, mismatched, or ambiguous content. It never extracts archives or
contacts a registry.
