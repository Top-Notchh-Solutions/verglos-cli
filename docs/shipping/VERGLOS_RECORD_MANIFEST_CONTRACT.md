# Verglos Release Record Manifest Contract

Status: V1 contract implemented by `CONTRACT-010`

Owner: Record/Evidence

Last reviewed: 2026-09-09

Schema `urn:verglos:schema:release-record-manifest` version `1.0.0` describes the members of a portable Release Record without choosing ZIP, tar, directory, object-store, or another archive transport. It is a deterministic, transport-neutral index of bounded payloads.

## Member binding

Every member has a safe relative path, fixed member kind, media type, content digest, non-negative byte size, required/optional state, and explicit redaction state. Paths are unique and ordered by UTF-16 code units. Extensions are namespaced `urn:verglos:extension:*` records with the same version/media/digest/size/redaction discipline and deterministic ID ordering.

Each manifest contains exactly one required `release-decision` member with an explicit schema reference. A complete redaction state requires a non-omitted `redaction-manifest` member and its digest. An omitted payload must record zero size; no redaction state silently implies that raw evidence is safe to publish.

The manifest records bundle version, generator identity/version, generation time, member limits, and visible limitations. Unknown fields, malformed media types, invalid schema references, duplicate paths/IDs, unsorted layout, wildcard extension IDs, and unsupported future schema versions are rejected. The member digest is a claim about payload bytes; transport readers must hash and size the actual bytes before use.

## Non-claims and downstream work

This contract does not select an archive transport, store payload bytes, verify member digests, reject archive traversal/symlinks/bombs, sign the record, or authorize hosted/public access. Those controls belong to `RECORD-001` through `RECORD-012`, signing/verifier contracts, and release gates. A valid manifest alone is not a signed Release Record or public publication authorization.

`packages/shared/src/record-manifest.test.ts` covers deterministic sorting, required decision membership, duplicate/unsorted paths and extensions, redaction requirements, omitted-size bounds, namespaced extensions, explicit release schema references, and future-version failure.
