# Decision: `.vgl` directory-v1 transport

Date: 2026-09-14
Status: selected for local Release Record packaging; no public release approval implied
Scope: `verglos record pack` / `record verify`, not `verglos attest`

## Context

RECORD-002 requires a portable `.vgl` assembly containing a canonical manifest,
content-addressed evidence members, export, viewer, optional signature, and
redaction manifest. The record manifest is transport-neutral. No demonstrated
need for ZIP/tar interoperability or a single-file archive was recorded. The
current verifier keeps all bounded members in memory and therefore needs a
documented aggregate cap.

## Decision

Use a versioned `directory-v1` profile: a `.vgl` path is a directory containing
canonical `manifest.json`, top-level content-addressed non-omitted member files,
strict `.vgl-package.json`, and deterministic `.vgl-release.intoto.json` and
`.vgl-viewer.html` projections. A detached signature envelope is optional and
is included only after verification against an operator-supplied public key,
exact trusted issuer, and optional signer ID. The signature continues to bind
the manifest; it does not establish an authority merely by being present.

`record verify` rechecks every manifest member, canonical package descriptor
and manifest, exact directory entry set, and deterministic projection bytes.
Symlinks, extra files, missing package metadata, and tampered projections fail
closed. A signed package requires an explicit trusted key and issuer to verify.

## Rationale and boundaries

- A directory avoids adding an archive parser, decompressor, extraction path,
  archive-bomb boundary, or dependency without demonstrated need.
- The transport is inspectable and reversible; the manifest and content digests
  remain independent of transport.
- The package contains every non-omitted evidence payload and may contain
  sensitive source, paths, findings, or identifiers. It is local-only by
  default; creation performs no upload/publication. Operators must inspect and
  keep it private before sharing.
- The static viewer is only a limited projection. It does not verify signer
  identity or prove sanitization. Redaction metadata is producer-declared,
  never an independent sanitization verdict.
- Member payloads are limited to 50 MB each and 256,000,000 bytes aggregate
  before the in-memory reader opens them. Larger records require a separately
  reviewed streaming design; the limit must not be silently raised.
- This command does not turn the alpha `verglos attest` shell into functional
  attestation, and it does not authorize hosted upload or public verification.

## Alternatives rejected or deferred

- ZIP/tar archive: deferred until an interoperability/user requirement justifies
  archive creation/extraction and its additional parser, path, link, and bomb
  risk.
- Store-only directory: rejected for RECORD-002 because it lacks a packaged
  descriptor, viewer, and derived export as one named `.vgl` unit.
- Opaque custom binary/single-file container: rejected as unnecessary format
  complexity.

## Reversal conditions

Revisit this decision if representative recipients cannot consume a directory,
an evidenced distribution channel requires a single-file artifact, a named
interoperability target requires ZIP/tar, or real package sizes exceed the
documented memory bound. Any replacement needs a versioned transport profile,
safe parser/extraction tests, deterministic conversion, compatibility policy,
and a rollback path. Do not change `directory-v1` semantics in place.

## Evidence required before acceptance/release

The RECORD-002 acceptance batch must prove full graph create → package → offline
verify with synthetic-only fixtures; exact record/signature bindings; optional
unsigned behavior; deterministic output; redaction-viewer non-leakage; malformed,
missing, extra, symlink, tampered, and over-limit rejection; supported-platform
CI; and matching private backlog/traceability/ledger records. This decision
alone does not check off RECORD-002 or approve a release.
