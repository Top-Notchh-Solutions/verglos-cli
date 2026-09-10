# Verglos Schema Version and Canonical JSON Contract

Status: V1 foundation implemented by `CONTRACT-001`

Owner: CLI/domain contracts

Last reviewed: 2026-09-08

This contract defines the shared mechanics used by later subject, observation, policy, record, import, and verification schemas. It does not define those domain shapes.

## Schema identity

A Verglos schema descriptor has two independent values:

- `schemaId` identifies the document's meaning and matches `urn:verglos:schema:[a-z][a-z0-9]*(?:-[a-z0-9]+)*` with a maximum length of 128 characters.
- `schemaVersion` identifies the representation and is a stable, unsigned `MAJOR.MINOR.PATCH` version. Prerelease/build suffixes and leading zeroes are rejected. Each numeric component must fit a JavaScript safe integer and the whole value is limited to 64 characters.

Versions never appear inside schema IDs. The existing scan JSON is mapped to `urn:verglos:schema:scan-report` version `2.0.0`, but its emitted shape remains unchanged: it still contains only `schemaVersion`, not a newly injected `schemaId`.

Legacy identity is never guessed. A reader must explicitly select the known legacy schema ID before it may interpret an envelope that omits `schemaId`.

## Compatibility

Given a document version and a reader version for the same schema ID:

| Relationship | Classification | Reader behavior |
|---|---|---|
| Exact version | `exact` | Read |
| Same major; document minor is older | `backward-compatible` | Read; validation still applies |
| Same major/minor; patch differs | `backward-compatible` | Read; patches cannot change shape |
| Document minor or major is newer | `upgrade-required` | Stop with the required schema/version and upgrade action |
| Document major is older | `incompatible` | Stop unless an explicit migration/reader exists |

Version compatibility never substitutes for schema validation. It only determines whether the reader is allowed to attempt the schema-specific validator introduced by the relevant contract.

## Verglos canonical JSON v1

Canonical serialization is defined over an already constructed JSON data value:

1. Accept only `null`, booleans, valid-Unicode strings, finite numbers, dense arrays, and plain string-keyed objects.
2. Reject `undefined`, functions, symbols, bigint values, non-finite numbers, unpaired UTF-16 surrogates, sparse arrays, accessors, non-enumerable/symbol properties, non-plain prototypes, and cycles. Do not call `toJSON` or any other coercion hook.
3. Preserve array order. Sort object property names lexicographically by UTF-16 code units with no Unicode normalization.
4. Use ECMAScript JSON string/finite-number serialization. Negative zero serializes as `0`.
5. Emit no insignificant whitespace and encode the result as UTF-8.

This named rule set is intentionally narrower than ordinary `JSON.stringify`. A producer must not describe ordinary pretty JSON as canonical. Duplicate-name detection remains a responsibility of any future raw signed-envelope reader; converting attacker-controlled JSON directly through `JSON.parse` can erase duplicates and is not a signature verification procedure.

## Bounded JSON input

`parseBoundedJson` checks bytes before parsing and walks the parsed value iteratively. Defaults are:

| Limit | Default |
|---|---:|
| UTF-8 input bytes | 16 MiB |
| nesting depth | 64 |
| total nodes | 250,000 |
| total object properties | 200,000 |
| total array items | 200,000 |

Trusted callers may set explicit positive safe-integer overrides. Input is never included in syntax errors because runtime parser messages may echo secrets. Invalid UTF-8, invalid JSON, size/depth/node/container limits, envelope shape, schema identity, and schema compatibility use typed `JsonDocumentError` codes plus a human action.

These limits are admission defaults, not product allowance or retention claims. Format-specific readers may lower them and streaming importers must still be used where later contracts require larger inputs.

## Frozen compatibility evidence

`packages/shared/fixtures/legacy-scan-report-2.0.0.json` represents the existing report envelope. The shared test suite proves that:

- the fixture reads only when its legacy identity mapping is explicit;
- an unmapped missing schema ID fails visibly;
- a future unsupported major fails with `SCHEMA_UPGRADE_REQUIRED` and an upgrade action;
- canonical output is stable across object insertion order;
- byte, structural, UTF-8, JSON syntax, and non-JSON canonicalization failures are typed.
