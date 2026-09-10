# Verglos Observation Contract

Status: V1 contract implemented by `CONTRACT-004`

Owner: Evidence Contracts

Last reviewed: 2026-09-09

An observation is a producer-attributed claim about one immutable subject. Schema `urn:verglos:schema:observation` version `1.0.0` binds a UUID observation ID, subject ID, tool-run ID, origin, coverage class, rule, locations, original and normalized severity/confidence, remediation, redacted evidence, references, and namespaced extensions.

Native, adapter, and imported origins remain distinct and must match `native`, `external`, and `imported` coverage. Adapter/imported observations require the digest of their raw evidence. Producer severity and confidence remain beside versioned normalized mappings; unknown values stay `unknown`, never silently promoted.

Locations support bounded relative source paths/ranges, package version/PURL/CPE identity, OCI layer digest/index/path, and artifact offset/path. HTTPS references prevent unsafe renderer schemes. Unknown top-level fields are rejected; producer-specific data belongs only in a namespaced extension containing canonical JSON, with 64-entry and 64-KiB-per-entry limits.

Evidence excerpts declare `non-sensitive`, `sensitive`, or `secret` classification and `included`, `redacted`, or `omitted` handling. Sensitive content cannot be included raw; secret content must be omitted; omitted entries cannot carry content. This structural control complements, but does not replace, detector-specific redaction and leakage tests.

This contract does not deduplicate observations or define their stable cross-run fingerprint (`GRAPH-002`), decide policy, or erase disagreement. `packages/shared/src/observation.test.ts` covers lineage, origin/coverage integrity, location bounds, evidence handling, extension isolation, safe references, unknown normalization, future versions, and strict fields.
