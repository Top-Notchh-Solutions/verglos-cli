# Verglos Release Record Provenance Member

Status: implemented locally and pushed to CLI PR #38; acceptance awaits exact-head hosted checks.

## Import contract

`verglos record import-provenance <source> <output-member> --provider <github|npm|buildkit|unknown> --subject-id <id> --expected-digest sha256:<hex>` imports an at-most-8-MiB in-toto statement or DSSE envelope to a no-overwrite JSON member. The source is read as a regular file. Output requests mode `0600`; the operator must treat the source and enclosing Release Record as sensitive. The command performs no network access or upload.

The member identifies `urn:verglos:schema:provider-provenance` v1.0.0, retains exact source bytes as canonical base64 plus their SHA-256 digest, parsed statement and all subjects, selected canonical Release Record `subjectId`, expected artifact SHA-256, provider match state, DSSE signature count, and explicit limitations. The `github`, `npm`, or `buildkit` value is caller-declared and not authenticated. The supported verification states are:

- `matched`: at least one in-toto SHA-256 subject digest equals the expected digest.
- `mismatched`: SHA-256 subject digests are present but none equals the expected digest.
- `unavailable`: there is no usable SHA-256 subject digest.

`record create`, `record verify`, and `record pack` reparse the retained source, recompute source digest and match state, require the provenance schema reference, and bind the named subject plus expected artifact digest to an included typed subject payload. Source digest integrity and digest equality do not establish source lineage or authenticate the provider.

## Signature and trust boundary

All imported envelope signatures remain `unverified`. DSSE signature entries and exact envelope bytes are preserved, but no key, certificate, issuer, transparency log, provider identity, or trust root is evaluated. A signature count is not a signature-validity result. Provider-specific verification/trust policy remains separate under RECORD-006; no cryptographic provenance claim is made by this importer.

RECORD-006 implementation addendum (CLI PR #38, `4545eb4`, unreleased): the
separate `record attest` flow signs the canonical Release Record statement
using a caller-supplied OIDC token and Sigstore Fulcio/Rekor, stores the bundle
and exact issuer/identity binding, and verifies offline with an explicit
trusted root and exact identity policy. This does not upgrade imported
GitHub/npm/BuildKit provider labels or their DSSE signatures: those remain
caller-declared/unverified until independent provider-specific verification
exists. Current signing E2E uses mocked services; no public Rekor write was
performed.

The retained source may contain sensitive build metadata. The record member is not redacted by import and must not be copied to a public projection. Public record projection does not expose arbitrary member payloads. Synthetic tests cover matched, mismatched, unavailable, malformed DSSE, digest tampering, record-subject mismatch, no-overwrite behavior, and CLI create/verify/package flow. These fixtures are software contract tests, not evidence from a production GitHub, npm, or BuildKit release.
