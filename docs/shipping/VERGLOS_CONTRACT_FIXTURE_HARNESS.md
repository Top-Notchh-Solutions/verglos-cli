# Verglos Contract Fixture Harness

The shared package exposes `validateContractFixture` and
`validateContractFixtureJson` as the single dispatch boundary for contract
documents. They select a parser by the stable `schemaId`, apply each
contract's strict validation and compatibility rules, and return deterministic
canonical JSON only for accepted documents.

The frozen catalog is published with `@verglos/shared` under `fixtures/` and
currently includes valid, invalid, and backward-compatible examples. Invalid
or unsupported documents return a bounded classification and never echo input
contents. Legacy scan reports are accepted only through their explicit
legacy-shape mapping; they do not acquire a new identity implicitly.

Downstream CLI, import, viewer, API, and independent verifier code should call
this boundary instead of reimplementing schema dispatch. The fixture tests are
the compatibility gate: changes to parser behavior require updating the
fixture and its expected class deliberately.
