# Verglos SBOM Resolver

The SBOM resolver reads CycloneDX JSON and SPDX JSON without executing any
content. The subject is bound to the exact document-byte SHA-256 digest and
records the declared format and serial number. Missing or ambiguous document
identity remains incomplete or unsupported; the resolver does not infer a
source package or trust claims beyond the signed/verified evidence layers.
