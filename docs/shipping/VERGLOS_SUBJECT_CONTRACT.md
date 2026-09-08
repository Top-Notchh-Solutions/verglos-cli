# Verglos Subject Contract

Status: V1 contract implemented by `CONTRACT-002`

Owner: Target/Evidence

Last reviewed: 2026-09-08

The subject contract answers one question: which immutable repository state, package, filesystem snapshot, SBOM document, artifact, OCI manifest, or OCI index did evidence evaluate? It does not resolve targets, run tools, establish application ownership, or decide whether evidence is complete.

## Envelope and identity

Every current subject document has:

- `schemaId: urn:verglos:schema:subject`;
- `schemaVersion: 1.0.0`;
- one of seven `kind` discriminators;
- `subjectId: urn:verglos:subject:<kind>:sha256:<canonical-identity-digest>`.

`createSubject` validates a kind-specific payload, canonicalizes only its immutable identity projection under Verglos canonical JSON v1, hashes it with SHA-256, and validates the completed document. `parseSubject` recomputes that identity and rejects mismatch. This prevents a syntactically valid caller-selected ID from being attached to different identity facts.

Subject identity is content-oriented. Application, tenant, release, display name, local absolute path, registry account, and evidence ownership are separate contracts. Matching subject IDs do not grant access or prove provenance.

## Kind invariants

| Kind | Required immutable identity | Non-identity context retained |
|---|---|---|
| `repository-tree` | Git commit object ID, tree object ID, clean/dirty state, and worktree digest when dirty | shallow state and submodule-resolution state |
| `package` | ecosystem, package name, version, and content digest | PURL rendering |
| `filesystem` | deterministic tree digest and ignore-policy digest | entry count and bounded relative scope path |
| `sbom` | SBOM format and complete document digest | declared serial number |
| `artifact` | complete content digest | byte size, media type, and bounded relative path |
| `oci-manifest` | manifest digest and explicit OS/architecture platform | registry, repository, optional mutable tag, and reported size |
| `oci-index` | index digest | registry, repository, optional mutable tag, size, and explicit unique platform descriptors |

SHA-256 and SHA-512 are accepted content digests and must be lowercase with exact length. Git SHA-1 and Git SHA-256 are named separately because a Git object ID is not treated as a generic modern content digest.

The repository tree is exact only when a dirty worktree carries a separate SHA-256/SHA-512 snapshot digest. A clean tree must not carry that field, avoiding two identities for the same declared clean state. `incomplete` submodule state remains visible for later coverage/policy contracts and cannot itself become PASS.

An OCI tag may be preserved only as a mutable lookup label beside a required immutable digest. It never contributes to `subjectId`. Registry mirrors and tags therefore converge on the same content/platform identity, while an OCI index remains distinct from each child manifest. Platform entries in an index must be explicit and unique; target resolution later must not silently select one.

## Path and string boundaries

Subject paths are portable relative POSIX-style paths only. They reject absolute paths, Windows drive prefixes, backslashes, empty/current/parent segments, control characters, unpaired UTF-16 surrogates, more than 4,096 UTF-8 bytes total, or more than 255 UTF-8 bytes per segment. Absolute local paths are not persisted in the subject contract.

Registry values are lowercase hosts with an optional valid port. URL schemes, credentials, repository paths, whitespace, invalid DNS labels, and ports outside 1–65,535 are rejected. Repository names and tags use bounded OCI-compatible character sets.

All subject objects are strict: unknown fields fail validation rather than silently altering meaning. Validation issues expose paths and stable classes; unsupported properties and enum values are sanitized so their raw attacker-controlled values are not repeated in the error.

## Boundaries left for dependent tasks

- `TARGET-001` through `TARGET-010` must obtain and independently verify these facts without executing target code, report unreadable/skipped coverage, bind SBOM declarations, and classify source/artifact mismatches as incomplete.
- `CONTRACT-003` and `CONTRACT-004` bind tool runs, engine health, observations, and coverage to a subject ID.
- Hosted ownership must authorize tenant/application relationships separately; possession of a subject ID or digest grants nothing.
- Release records must retain full subject documents and validate their canonical IDs before policy, signing, upload, or publication.

## Executable evidence

`packages/shared/src/subject.test.ts` covers all seven kinds, deterministic creation/read/JSON round trips, malformed and mismatched IDs, dirty-tree requirements, missing package/OCI digests, mutable tag behavior, mirror identity, registry safety, unique platforms, relative path bounds, digest/Git-ID grammar, future schema upgrades, and unknown fields.
